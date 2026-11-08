import { describe, expect, it } from "vitest";
import { familyMembers, oosterhoutTexts, quiz, tableItems } from "@/content/oosterhout";
import { arriveAt, canTravelTo, completeLocation, createInitialState, getStatus } from "./progress";
import { answerQuestion, createDinnerState, isDinnerComplete, servedCourses, type DinnerState } from "./dinner";

const questions = quiz;
const wrongIndex = (i: number) => (questions[i].correctIndex + 1) % 3;

describe("Oosterhout-configuratie", () => {
  it("heeft de zes familieleden aan tafel, allemaal getekend", () => {
    expect(familyMembers.map((m) => m.name)).toEqual(["Ingeborgh", "Ivo", "Stijn", "Nadia", "Eline", "Wouter"]);
    for (const m of familyMembers) expect(m.look.photo).toBeUndefined();
  });  it("heeft zes vragen met elk drie antwoorden en een geldig juist antwoord", () => {
    expect(quiz).toHaveLength(6);
    for (const q of quiz) {
      expect(q.answers).toHaveLength(3);
      expect([0, 1, 2]).toContain(q.correctIndex);
      expect(new Set(q.answers).size).toBe(3);
      expect(q.onCorrect).toBeTruthy();
      expect(q.onWrong.length).toBeGreaterThan(0);
    }
  });
  it("laat elke vraag door een bestaand familielid stellen", () => {
    const ids = new Set(familyMembers.map((m) => m.id));
    for (const q of quiz) expect(ids.has(q.askedBy)).toBe(true);
    // Iedereen aan tafel stelt precies één vraag.
    for (const id of ids) expect(quiz.filter((q) => q.askedBy === id)).toHaveLength(1);
  });
  it("heeft unieke id's en unieke plekken aan tafel", () => {
    expect(new Set(familyMembers.map((m) => m.id)).size).toBe(6);
    expect(new Set(familyMembers.map((m) => m.seat.x)).size).toBe(6);
    expect(new Set(quiz.map((q) => q.id)).size).toBe(6);
  });
  it("laat het juiste antwoord niet altijd op dezelfde plek staan", () => {
    expect(new Set(questions.map((q) => q.correctIndex)).size).toBeGreaterThan(1);
  });
  it("serveert bij elke gang iets en de tafel wordt steeds voller", () => {
    const perCourse = [0, 1, 2, 3, 4, 5, 6].map((c) => tableItems.filter((t) => t.course === c).length);
    perCourse.forEach((n) => expect(n).toBeGreaterThan(0));
    expect(perCourse[6]).toBeGreaterThanOrEqual(perCourse[1]);
    expect(new Set(tableItems.map((t) => t.id)).size).toBe(tableItems.length);
  });
});
describe("diner", () => {
  it("begint bij vraag 1 zonder gangen", () => {
    const s = createDinnerState();
    expect(s.current).toBe(0);
    expect(servedCourses(s)).toBe(0);
    expect(isDinnerComplete(questions, s)).toBe(false);
  });
  it("blijft bij een fout antwoord op dezelfde vraag", () => {
    const r = answerQuestion(questions, createDinnerState(), wrongIndex(0));
    expect(r.outcome).toBe("wrong");
    expect(r.state.current).toBe(0);
    expect(r.state.wrongAttempts).toBe(1);
  });
  it("kan na een fout antwoord opnieuw proberen", () => {
    let s: DinnerState = createDinnerState();
    s = answerQuestion(questions, s, wrongIndex(0)).state;
    s = answerQuestion(questions, s, wrongIndex(0)).state;
    expect(s.wrongAttempts).toBe(2);
    const r = answerQuestion(questions, s, questions[0].correctIndex);
    expect(r.outcome).toBe("correct");
    expect(r.state).toEqual({ current: 1, wrongAttempts: 0 });
  });
  it("gaat bij een goed antwoord door en serveert een gang", () => {
    const r = answerQuestion(questions, createDinnerState(), questions[0].correctIndex);
    expect(servedCourses(r.state)).toBe(1);
  });
  it("is pas klaar na zes goede antwoorden, in volgorde", () => {
    let s = createDinnerState();
    for (let i = 0; i < questions.length; i++) {
      expect(isDinnerComplete(questions, s)).toBe(false);
      s = answerQuestion(questions, s, wrongIndex(i)).state; // fout eerst
      expect(s.current).toBe(i);
      s = answerQuestion(questions, s, questions[i].correctIndex).state;
      expect(s.current).toBe(i + 1);
    }
    expect(isDinnerComplete(questions, s)).toBe(true);
    expect(servedCourses(s)).toBe(questions.length);
  });
  it("kan niet voortijdig of door overslaan afgerond worden", () => {
    const s = createDinnerState();
    expect(answerQuestion(questions, s, -1)).toEqual({ state: s, outcome: "invalid" });
    expect(answerQuestion(questions, s, 3)).toEqual({ state: s, outcome: "invalid" });
    expect(answerQuestion(questions, s, 0.5)).toEqual({ state: s, outcome: "invalid" });
    expect(isDinnerComplete(questions, s)).toBe(false);
  });
  it("negeert antwoorden nadat de quiz klaar is", () => {
    let s = createDinnerState();
    for (let i = 0; i < questions.length; i++) s = answerQuestion(questions, s, questions[i].correctIndex).state;
    const r = answerQuestion(questions, s, 0);
    expect(r.outcome).toBe("invalid");
    expect(r.state).toBe(s);
  });
});

describe("definitieve schoonfamiliequiz", () => {
  const byId = (id: string) => familyMembers.find((m) => m.id === id)!;

  it("volgorde van de gangen en sprekers klopt", () => {
    expect(quiz.map((q) => q.askedBy)).toEqual(["ivo", "ingeborgh", "stijn", "nadia", "wouter", "eline"]);
    expect(quiz.map((q) => q.course)).toEqual(["Voorgerecht", "Soep", "Tussengerecht", "Hoofdgerecht", "Dessert", "Koffie en afsluiting"]);
  });

  it("de juiste antwoorden zijn A, B, B, A, C en A", () => {
    expect(quiz.map((q) => "ABC"[q.correctIndex])).toEqual(["A", "B", "B", "A", "C", "A"]);
    for (const q of quiz) expect(q.answers).toHaveLength(3);
  });

  it("elk familielid stelt zijn vraag zelf aan Minou, in de ik-vorm", () => {
    for (const q of quiz) {
      expect(q.text.startsWith("Minou,")).toBe(true);
      const name = byId(q.askedBy).name;
      expect(q.text.split(/[\s,.?!]+/)).not.toContain(name); // geen derde persoon over zichzelf
    }
    expect(quiz[0].text).toBe("Minou, stel dat ik één dag volledig onzichtbaar zou zijn. Wat denk jij dat ik dan het allerliefste zou doen?");
  });

  it("elk familielid heeft de opgegeven persoonlijke reactie bij een fout antwoord", () => {
    expect(quiz.map((q) => q.onWrong[0])).toEqual([
      "Nee Minou, je kent me blijkbaar toch minder goed dan ik dacht!",
      "Nee Minou! Maar als die auto straks verdwenen is, weet ik in ieder geval wie ik de schuld kan geven.",
      "Pardon?! Minou, drie stemmen vóór mij. Dat is geen mening meer, dat is wetenschappelijk bewezen!",
      "Minou, ik begin me toch echt af te vragen of je mij wel een beetje kent!",
      "Minou, dit valt me tegen. Ik dacht dat jij mijn dierenliefde inmiddels wel kende!",
      "Nee Minou! Let de volgende keer maar eens goed op hoe Wouter eet. Dan snap je me vanzelf!",
    ]);
  });

  it("de quiz eindigt niet na vijf goede antwoorden en geeft bij elk goed antwoord een gang", () => {
    let s = createDinnerState();
    for (let i = 0; i < 5; i++) {
      s = answerQuestion(questions, s, questions[i].correctIndex).state;
      expect(servedCourses(s)).toBe(i + 1);
      expect(isDinnerComplete(questions, s)).toBe(false);
    }
    expect(s.current).toBe(5);
    s = answerQuestion(questions, s, questions[5].correctIndex).state;
    expect(isDinnerComplete(questions, s)).toBe(true);
    expect(servedCourses(s)).toBe(6);
  });

  it("elke gang levert iets op de tafel en de zesde gang is het volst", () => {
    const per = [1, 2, 3, 4, 5, 6].map((c) => tableItems.filter((t) => t.course === c).length);
    per.forEach((n) => expect(n).toBeGreaterThan(0));
    const upTo = (c: number) => tableItems.filter((t) => t.course <= c).length;
    for (let c = 1; c <= 6; c++) expect(upTo(c)).toBeGreaterThan(upTo(c - 1));
  });

  it("voortgangsteller telt tot zes", () => {
    expect(oosterhoutTexts.progress(0, 6, "Voorgerecht")).toBe("Gang 1 van 6 · Voorgerecht");
    expect(oosterhoutTexts.progress(5, 6)).toBe("Gang 6 van 6");
    expect(oosterhoutTexts.progress(6, 6)).toBe("Gang 6 van 6");
  });

  it("de afsluitende dialoog van Sinterklaas is compleet", () => {
    const text = oosterhoutTexts.outro.map((l) => l.text).join(" ");
    expect(oosterhoutTexts.outro.every((l) => l.speaker === "sinterklaas")).toBe(true);
    expect(text).toContain("Nou, nou, Minou! Je hebt het voor elkaar. Zes gangen, zes familieleden");
    expect(text).toContain("Bij Moerdijk wacht je namelijk een wel héél bijzondere verrassing...");
  });

  it("Moerdijk wordt pas vrijgegeven nadat Oosterhout is afgerond", () => {
    let s = arriveAt(completeLocation(arriveAt(createInitialState(), "tilburg"), "tilburg"), "oosterhout");
    expect(getStatus(s, "moerdijk")).toBe("locked");
    expect(canTravelTo(s, "moerdijk")).toBe(false);
    s = completeLocation(s, "oosterhout");
    expect(s.completed).toContain("oosterhout");
    expect(canTravelTo(s, "moerdijk")).toBe(true);
  });
});