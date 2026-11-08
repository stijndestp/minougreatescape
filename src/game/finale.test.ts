import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { codeHash, delftTexts, effects, timeline } from "@/content/delft";
import { arriveAt, canEnter, canTravelTo, completeLocation, createInitialState, getNextId, getStatus, type GameState } from "./progress";
import {
  checkCode,
  createFinaleState,
  finaleReducer,
  hashCode,
  type FinaleAction,
  type FinaleState,
} from "./finale";

const rules = { codeHash };
const run = (actions: FinaleAction[], from: FinaleState = createFinaleState()) =>
  actions.reduce((s, a) => finaleReducer(rules, s, a), from);
const type = (code: string): FinaleAction[] => [...code].map((digit) => ({ type: "digit", digit }));
const toLock: FinaleAction[] = [{ type: "introDone" }];
const CORRECT = "2912"; // alleen in de test; staat nergens in de spelbestanden

describe("codevalidatie", () => {
  it("de code 2912 is correct", () => {
    expect(checkCode(rules, CORRECT)).toBe("correct");
    expect(hashCode(CORRECT)).toBe(codeHash);
  });

  it("alle andere vier-cijfercodes zijn fout", () => {
    let correct = 0;
    for (let n = 0; n < 10000; n++) {
      if (checkCode(rules, String(n).padStart(4, "0")) === "correct") correct++;
    }
    expect(correct).toBe(1);
  });

  it("alleen precies vier cijfers tellen mee", () => {
    for (const bad of ["", "291", "29123", "29a2", "29 2", " 2912", "2912 ", "２９１２", "-912"]) {
      expect(checkCode(rules, bad)).toBe("incomplete");
    }
  });

  it("de code staat nergens leesbaar in de spelbestanden (ook niet in teksten)", () => {
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const f of readdirSync(dir)) {
        const p = join(dir, f);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(ts|tsx|css)$/.test(f) && !/\.test\.ts$/.test(f)) files.push(p);
      }
    };
    walk(join(process.cwd(), "src"));
    expect(files.length).toBeGreaterThan(20);
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toContain(CORRECT);
    expect(JSON.stringify(delftTexts)).not.toContain(CORRECT);
  });

  it("foutmeldingen geven geen aanwijzing over cijfers", () => {
    for (const line of delftTexts.wrong) expect(line).not.toMatch(/\d/);
    expect(delftTexts.wrong.length).toBeGreaterThan(0);
  });
});

describe("codeslot-invoer", () => {
  it("het slot is pas bereikbaar na de verplichte introductie", () => {
    const s = createFinaleState();
    expect(s.phase).toBe("intro");
    expect(run(type("1234"))).toEqual(s); // niets typen tijdens de dialoog
    expect(run([{ type: "submit" }])).toEqual(s);
    expect(run([{ type: "advance" }])).toEqual(s);
    expect(run(toLock).phase).toBe("lock");
  });

  it("accepteert uitsluitend cijfers, maximaal vier", () => {
    let s = run([...toLock, ...type("12")]);
    expect(s.code).toBe("12");
    s = run([{ type: "digit", digit: "a" }, { type: "digit", digit: "-" }, { type: "digit", digit: "12" }, { type: "digit", digit: "" }], s);
    expect(s.code).toBe("12");
    s = run(type("3456789"), s);
    expect(s.code).toBe("1234");
  });

  it("kan cijfers verwijderen en corrigeren", () => {
    let s = run([...toLock, ...type("1294"), { type: "backspace" }, ...type("2")]);
    expect(s.code).toBe("1292");
    s = run([{ type: "backspace" }, { type: "backspace" }, { type: "backspace" }, { type: "backspace" }, { type: "backspace" }], s);
    expect(s.code).toBe("");
  });

  it("bevestigen met minder dan vier cijfers doet niets", () => {
    const s = run([...toLock, ...type("291")]);
    expect(run([{ type: "submit" }], s)).toBe(s);
  });

  it("een foute code opent de poort niet en mag onbeperkt opnieuw", () => {
    let s = run(toLock);
    for (let i = 0; i < 25; i++) {
      s = run([...type("1234"), { type: "submit" }], s);
      expect(s.phase).toBe("wrong");
      expect(s.code).toBe(""); // geen aanwijzing welke cijfers kloppen
      s = run([{ type: "wrongDone" }], s);
      expect(s.phase).toBe("lock");
    }
    expect(s.wrongAttempts).toBe(25);
    expect(s.completed).toBe(false);
  });

  it("tijdens de reactie van Sinterklaas kan niets worden ingevoerd of bevestigd", () => {
    const wrong = run([...toLock, ...type("0000"), { type: "submit" }]);
    expect(run([...type("2912"), { type: "submit" }], wrong)).toEqual(wrong);
  });

  it("de juiste code opent de poort; dubbele Enter/klik start niets opnieuw", () => {
    let s = run([...toLock, ...type(CORRECT), { type: "submit" }]);
    expect(s.phase).toBe("gate");
    const again = run([{ type: "submit" }, { type: "submit" }, ...type("1")], s);
    expect(again).toEqual(s);
    s = run([{ type: "wrongDone" }, { type: "introDone" }], s);
    expect(s.phase).toBe("gate");
  });
});

describe("finale: vaste verhaalstroom", () => {
  const full: FinaleAction[] = [
    ...toLock,
    ...type(CORRECT),
    { type: "submit" },
    { type: "advance" }, // gate -> run
    { type: "advance" }, // run -> hug
    { type: "advance" }, // hug -> escalate
    { type: "advance" }, // escalate -> outro
  ];

  it("doorloopt poort, rennen, knuffels, escalatie en de afsluitende dialoog in volgorde", () => {
    const phases: string[] = ["intro"];
    let s = createFinaleState();
    for (const a of [...full, { type: "outroDone" } as FinaleAction]) {
      s = finaleReducer(rules, s, a);
      if (phases[phases.length - 1] !== s.phase) phases.push(s.phase);
    }
    expect(phases).toEqual(["intro", "lock", "gate", "run", "hug", "escalate", "outro", "end"]);
  });

  it("de finale is pas voltooid na de afsluitende dialoog", () => {
    const beforeOutro = run(full);
    expect(beforeOutro.phase).toBe("outro");
    expect(beforeOutro.completed).toBe(false);
    const end = run([{ type: "outroDone" }], beforeOutro);
    expect(end.phase).toBe("end");
    expect(end.completed).toBe(true);
  });

  it("er is geen manier om fases over te slaan", () => {
    const lock = run(toLock);
    expect(run([{ type: "advance" }, { type: "outroDone" }], lock)).toEqual(lock);
    const gate = run([...toLock, ...type(CORRECT), { type: "submit" }]);
    expect(run([{ type: "outroDone" }, { type: "introDone" }], gate)).toEqual(gate);
  });

  it("totale tijdlijn van de hereniging is 20–30 seconden", () => {
    const total = timeline.gate + timeline.run + timeline.hug + timeline.escalate;
    expect(total).toBeGreaterThanOrEqual(20000);
    expect(total).toBeLessThanOrEqual(30000);
  });

  it("er zijn eindige, vaste aantallen hartjes", () => {
    const total = effects.gateHearts + effects.hugHearts + effects.escalateHearts + 14 + effects.endHearts;
    expect(total).toBeLessThan(200);
  });

  it("de teksten komen overeen met de opdracht", () => {
    expect(delftTexts.intro).toHaveLength(6);
    expect(delftTexts.intro.every((l) => l.speaker === "sinterklaas")).toBe(true);
    expect(delftTexts.intro[5].text).toBe("Vier cijfers scheiden jou nog van de liefde van je leven. Succes, Minou!");
    expect(delftTexts.wrong[0]).toBe("Ho, ho, ho! Dat is hem niet, Minou. Volgens mij moet je dat prachtige rijm van mij nog eens goed lezen!");
    expect(delftTexts.outro.map((l) => l.text)).toEqual([
      "Nou, nou, nou! Het is inmiddels wel duidelijk dat jullie elkaar gemist hebben!",
      "Bewaar ook nog een paar kusjes voor de rest van het jaar, hè? Zelfs ik word hier een beetje verlegen van!",
    ]);
    expect(delftTexts.foreverText).toBe("MINOU + JOB = FOREVER");
    expect(delftTexts.end).toMatchObject({
      title: "MINOU'S GREAT ESCAPE",
      subtitle: "MISSIE VOLTOOID!",
      tagline: "Liefde overwint alles. Zelfs de NS en de schoonfamilie.",
      backToMenu: "Terug naar hoofdmenu",
    });
  });
});

describe("finale: integratie met de spelstatus", () => {
  const route = (...ids: string[]): GameState => {
    let s = createInitialState();
    for (const id of ids) s = completeLocation(arriveAt(s, id), id);
    return s;
  };
  const afterRotterdam = route("tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam");

  it("Delft is niet bereikbaar voordat Rotterdam is voltooid", () => {
    expect(canTravelTo(route("tilburg", "oosterhout", "moerdijk", "dordrecht"), "delft")).toBe(false);
    expect(getStatus(arriveAt(route("tilburg", "oosterhout", "moerdijk", "dordrecht"), "rotterdam"), "delft")).toBe("locked");
    expect(canTravelTo(afterRotterdam, "delft")).toBe(true);
  });

  it("de finale kan alleen worden gestart na aankomst in Delft", () => {
    expect(canEnter(afterRotterdam, "delft")).toBe(false);
    expect(canEnter(arriveAt(afterRotterdam, "delft"), "delft")).toBe(true);
  });

  it("voltooien registreert het volledige avontuur; verversen herstelt de oude staat", () => {
    const inDelft = arriveAt(afterRotterdam, "delft");
    // Verversen in het codeslot: opslag is ongewijzigd, Delft is nog te spelen.
    expect(inDelft.completed).toHaveLength(5);
    expect(canEnter(JSON.parse(JSON.stringify(inDelft)), "delft")).toBe(true);
    const done = completeLocation(inDelft, "delft");
    expect(done.completed).toEqual(["tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam", "delft"]);
    expect(getNextId(done)).toBeNull();
    expect(completeLocation(done, "delft")).toBe(done); // dubbel voltooien verandert niets
  });
});
