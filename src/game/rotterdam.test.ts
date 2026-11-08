import { describe, expect, it } from "vitest";
import { clues, correctTrainId, destinations, texts, trains } from "@/content/rotterdam";
import {
  arriveAt,
  canEnter,
  canTravelTo,
  completeLocation,
  createInitialState,
  getStatus,
  normalizeState,
  type GameState,
} from "./progress";
import {
  createRotterdamState,
  isRotterdamFinished,
  rotterdamReducer,
  solutionOf,
  trainSatisfies,
  validTrains,
  type RotterdamAction,
  type RotterdamState,
} from "./rotterdam";

const rules = { trains, clues };
const run = (actions: RotterdamAction[], from: RotterdamState = createRotterdamState()) =>
  actions.reduce((s, a) => rotterdamReducer(rules, s, a), from);

const toPuzzle: RotterdamAction[] = [{ type: "announcementDone" }, { type: "cluesDone" }];
const solve: RotterdamAction = { type: "pickTrain", trainId: correctTrainId };
const toChoice: RotterdamAction[] = [...toPuzzle, solve, { type: "foundDone" }];

describe("treinpuzzel: inhoud", () => {
  it("heeft drie treinen met de voorlopige perrons 3, 6 en 9", () => {
    expect(trains.map((t) => t.platform)).toEqual([3, 6, 9]);
    expect(new Set(trains.map((t) => t.id)).size).toBe(3);
  });

  it("heeft drie aanwijzingen en de ene oplossing is perron 6", () => {
    expect(clues).toHaveLength(3);
    expect(validTrains(trains, clues).map((t) => t.platform)).toEqual([6]);
    expect(solutionOf(rules)).toBe(correctTrainId);
    expect(trains.find((t) => t.id === correctTrainId)?.platform).toBe(6);
  });

  it("de inhoud komt overeen met de opdracht (Intercity zonder Delft, Sprinter met Delft, Sprinter naar Dordrecht)", () => {
    const [p3, p6, p9] = trains;
    expect(p3.kind).toBe("intercity");
    expect(p3.stops).not.toContain("Delft");
    expect(p6.kind).toBe("sprinter");
    expect(p6.stops).toContain("Delft");
    expect(p6.terminus).not.toBe("Delft");
    expect(p9.heading).toBe("dordrecht");
  });

  it("elke aanwijzing sluit minstens één trein uit (geen overbodige aanwijzing)", () => {
    for (const c of clues) {
      expect(trains.some((t) => !trainSatisfies(t, c.rule))).toBe(true);
    }
  });

  it("elke verkeerde trein faalt op minstens één aanwijzing", () => {
    for (const t of trains.filter((x) => x.id !== correctTrainId)) {
      expect(clues.some((c) => !trainSatisfies(t, c.rule))).toBe(true);
    }
  });

  it("de gegeven aanwijzingen zijn exact de verwachte regels", () => {
    expect(clues.map((c) => c.rule.type)).toEqual(["smallStations", "notHeading", "intermediateStop"]);
  });

  it("de reacties op verkeerde treinen noemen het juiste perron niet", () => {
    const all = [...Object.values(texts.wrong).flat(), ...texts.genericWrong].join(" ").toLowerCase();
    expect(all).not.toMatch(/perron\s*6|sprinter naar den haag/);
    expect(Object.keys(texts.wrong)).not.toContain(correctTrainId);
  });

  it("het vertrekbord toont de tussenstops niet in de bordregels", () => {
    // Het bord toont tijd, perron, type en richting; stops zijn alleen via details beschikbaar.
    for (const t of trains) expect(t.destination).not.toContain("Delft");
  });

  it("een ongeldige set aanwijzingen heeft geen eenduidige oplossing (de controle werkt)", () => {
    expect(solutionOf({ trains, clues: clues.slice(0, 1) })).toBeNull(); // twee Sprinters blijven over
    expect(solutionOf({ trains, clues: [] })).toBeNull();
  });
});

describe("Rotterdam: verhaalstroom", () => {
  it("begint met de verplichte omroep en de puzzel is dan nog niet bereikbaar", () => {
    const s = createRotterdamState();
    expect(s.phase).toBe("announcement");
    expect(s.announcementHeard).toBe(false);
    // Probeer vooruit te springen: niets gebeurt.
    expect(run([{ type: "pickTrain", trainId: correctTrainId }])).toEqual(s);
    expect(run([{ type: "cluesDone" }])).toEqual(s);
    expect(run([{ type: "foundDone" }])).toEqual(s);
    expect(run([{ type: "pickDestination", id: "delft" }])).toEqual(s);
    expect(run([{ type: "boardDone" }])).toEqual(s);
  });

  it("de omroep is ook zichtbaar als de puzzel in één keer goed wordt opgelost", () => {
    const s = run(toPuzzle);
    expect(s.announcementHeard).toBe(true);
    const solved = rotterdamReducer(rules, s, solve);
    expect(solved.solved).toBe(true);
    expect(solved.wrongAttempts).toBe(0);
    expect(solved.announcementHeard).toBe(true);
  });

  it("de omroep bevat de verplichte tekst over Eline en Sinterklaas reageert daarna", () => {
    const [a, b, c] = texts.announcement;
    expect(a.speaker).toBe("omroep");
    expect(a.text).toContain("Eline, de zus van Job");
    expect(a.text).toContain("Zij wilde naar Utrecht, maar stapte in de verkeerde trein en eindigde daardoor in Breda.");
    expect(b.text).toContain("Wij willen voorkomen dat Minou hetzelfde overkomt. Dank voor uw aandacht.");
    expect(c.speaker).toBe("sinterklaas");
    expect(c.text).toBe("Nou Minou, je bent gewaarschuwd. Laten we hopen dat jij iets beter kunt navigeren dan je schoonzus!");
  });

  it("een verkeerde trein geeft geen voortgang en mag onbeperkt opnieuw", () => {
    let s = run(toPuzzle);
    for (const wrong of trains.filter((t) => t.id !== correctTrainId)) {
      for (let i = 0; i < 3; i++) {
        s = rotterdamReducer(rules, s, { type: "pickTrain", trainId: wrong.id });
        expect(s.phase).toBe("wrong");
        expect(s.solved).toBe(false);
        s = rotterdamReducer(rules, s, { type: "wrongDone" });
        expect(s.phase).toBe("puzzle");
      }
    }
    expect(s.wrongAttempts).toBe(6);
    // Tijdens de reactie kun je niet doorklikken naar de oplossing.
    s = rotterdamReducer(rules, s, { type: "pickTrain", trainId: "perron-3" });
    expect(rotterdamReducer(rules, s, solve)).toEqual(s);
  });

  it("onbekende treinen worden genegeerd", () => {
    const s = run(toPuzzle);
    expect(rotterdamReducer(rules, s, { type: "pickTrain", trainId: "perron-42" })).toBe(s);
  });

  it("zonder het juiste perron is er geen keuze Leiden/Delft", () => {
    let s = run(toPuzzle);
    s = rotterdamReducer(rules, s, { type: "pickTrain", trainId: "perron-9" });
    s = rotterdamReducer(rules, s, { type: "wrongDone" });
    expect(rotterdamReducer(rules, s, { type: "pickDestination", id: "delft" })).toBe(s);
    expect(rotterdamReducer(rules, s, { type: "foundDone" })).toBe(s);
  });

  it("na het juiste perron verschijnt de keuze Leiden/Delft", () => {
    const s = run(toChoice);
    expect(s.phase).toBe("choice");
    expect(s.solved).toBe(true);
    expect(destinations.map((d) => d.id)).toEqual(["leiden", "delft"]);
  });
});

describe("Rotterdam: beide verhaalvertakkingen", () => {
  it("Delft: Sinterklaas reageert en Minou kan rechtstreeks verder", () => {
    let s = run([...toChoice, { type: "pickDestination", id: "delft" }]);
    expect(s.phase).toBe("delft");
    expect(texts.delft[0].text).toBe("Kijk, daar spreekt de ware liefde! Vooruit dan, op naar Job!");
    s = run([{ type: "delftDone" }, { type: "boardDone" }], s);
    expect(s.phase).toBe("departing");
    expect(isRotterdamFinished(s)).toBe(false);
    s = run([{ type: "departDone" }], s);
    expect(s.phase).toBe("done");
    expect(s.destination).toBe("delft");
    expect(s.adviceAccepted).toBe(false);
    expect(isRotterdamFinished(s)).toBe(true);
  });

  it("Leiden: de volledige Relatiepsycholoog-Piet-scène en het advies zijn verplicht", () => {
    let s = run([...toChoice, { type: "pickDestination", id: "leiden" }]);
    expect(s.phase).toBe("therapy");
    // Je kunt de therapie niet overslaan naar het instappen.
    expect(rotterdamReducer(rules, s, { type: "acceptAdvice" })).toBe(s);
    expect(rotterdamReducer(rules, s, { type: "boardDone" })).toBe(s);
    expect(rotterdamReducer(rules, s, { type: "delftDone" })).toBe(s);
    s = rotterdamReducer(rules, s, { type: "therapyDone" });
    expect(s.phase).toBe("advice");
    expect(rotterdamReducer(rules, s, { type: "boardDone" })).toBe(s);
    s = run([{ type: "acceptAdvice" }, { type: "boardDone" }, { type: "departDone" }], s);
    expect(s.phase).toBe("done");
    expect(s.destination).toBe("leiden");
    expect(s.adviceAccepted).toBe(true);
    expect(isRotterdamFinished(s)).toBe(true);
  });

  it("de therapietekst en de knop komen exact overeen met de opdracht", () => {
    expect(texts.therapy.map((l) => l.text)).toEqual([
      "Minou... Ga eens rustig zitten. We moeten het toch even over jouw prioriteiten hebben.",
      "Je bent helemaal vanuit Tilburg vertrokken om bij Job te komen. Je hebt de schoonfamilie overleefd, een complete brug gerepareerd en bijna de verkeerde trein gepakt.",
      "En nu wil je ineens naar Leiden? Volgens mij hebben we hier te maken met een klassiek geval van acute bindingsangst!",
      "Ik schrijf je een enkeltje Delft voor. Drie keer daags knuffelen met Job en vooral niet meer twijfelen!",
    ]);
    expect(texts.therapy.every((l) => l.speaker === "piet" && l.name === "Relatiepsycholoog-Piet")).toBe(true);
    expect(texts.adviceButton).toBe("Accepteer het relatieadvies");
    expect(texts.found.text).toContain("Naar je familie in Leiden, of naar jouw grote liefde in Delft?");
  });

  it("beide routes komen in dezelfde eindstaat: precies één voltooide Rotterdam, beide richting Delft", () => {
    const delft = run([...toChoice, { type: "pickDestination", id: "delft" }, { type: "delftDone" }, { type: "boardDone" }, { type: "departDone" }]);
    const leiden = run([
      ...toChoice,
      { type: "pickDestination", id: "leiden" },
      { type: "therapyDone" },
      { type: "acceptAdvice" },
      { type: "boardDone" },
      { type: "departDone" },
    ]);
    expect(isRotterdamFinished(delft)).toBe(true);
    expect(isRotterdamFinished(leiden)).toBe(true);
    expect(delft.phase).toBe(leiden.phase);
    expect(delft.solved && leiden.solved && delft.announcementHeard && leiden.announcementHeard).toBe(true);
  });

  it("onvolledige routes tellen niet als voltooid", () => {
    expect(isRotterdamFinished(createRotterdamState())).toBe(false);
    expect(isRotterdamFinished(run(toChoice))).toBe(false);
    const half = run([...toChoice, { type: "pickDestination", id: "leiden" }, { type: "therapyDone" }]);
    expect(isRotterdamFinished(half)).toBe(false);
    // Geforceerde "done" zonder de verplichte stappen telt ook niet.
    expect(isRotterdamFinished({ ...createRotterdamState(), phase: "done" })).toBe(false);
    expect(isRotterdamFinished({ ...createRotterdamState(), phase: "done", announcementHeard: true, solved: true, destination: "leiden" })).toBe(false);
  });
});

describe("Rotterdam: integratie met de centrale spelstatus", () => {
  const route = (...ids: string[]): GameState => {
    let s = createInitialState();
    for (const id of ids) s = completeLocation(arriveAt(s, id), id);
    return s;
  };
  const afterDordrecht = route("tilburg", "oosterhout", "moerdijk", "dordrecht");

  it("Rotterdam is pas bereikbaar na Dordrecht", () => {
    expect(canTravelTo(route("tilburg", "oosterhout", "moerdijk"), "rotterdam")).toBe(false);
    expect(canTravelTo(afterDordrecht, "rotterdam")).toBe(true);
  });

  it("Minou kan niet direct naar Delft reizen zonder Rotterdam", () => {
    expect(canTravelTo(afterDordrecht, "delft")).toBe(false);
    const inRotterdam = arriveAt(afterDordrecht, "rotterdam");
    expect(canTravelTo(inRotterdam, "delft")).toBe(false);
    expect(getStatus(inRotterdam, "delft")).toBe("locked");
  });

  it("Delft wordt pas ontgrendeld na volledige afronding van Rotterdam", () => {
    const inRotterdam = arriveAt(afterDordrecht, "rotterdam");
    expect(canEnter(inRotterdam, "rotterdam")).toBe(true);
    const done = completeLocation(inRotterdam, "rotterdam");
    expect(done.completed).toHaveLength(5);
    expect(canTravelTo(done, "delft")).toBe(true);
    expect(getStatus(done, "delft")).toBe("available");
  });

  it("verversen midden in Rotterdam geeft een veilige staat zonder locaties over te slaan", () => {
    // Opslag zegt: Rotterdam nog niet voltooid; zelfs met valse extra gegevens blijft het consistent.
    const inRotterdam = arriveAt(afterDordrecht, "rotterdam");
    const restored = normalizeState(JSON.parse(JSON.stringify(inRotterdam)));
    expect(restored?.completed).toEqual(["tilburg", "oosterhout", "moerdijk", "dordrecht"]);
    expect(restored?.minouAt).toBe("rotterdam");
    const tampered = normalizeState({ version: 2, completed: ["tilburg", "oosterhout", "rotterdam"], minouAt: "delft", celebrated: [] });
    expect(tampered?.completed).toEqual(["tilburg", "oosterhout"]);
    expect(canTravelTo(tampered!, "delft")).toBe(false);
    // Een nieuwe poging op Rotterdam begint opnieuw bij de omroep.
    expect(createRotterdamState().phase).toBe("announcement");
  });
});
