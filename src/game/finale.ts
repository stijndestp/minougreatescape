/**
 * Finale in Delft — pure logica: codeslot en vaste verhaalstroom (geen browser-API's).
 *
 * De juiste code staat NIET in de content als tekst, alleen als hash (zie
 * content/delft.ts); de speler krijgt de aanwijzing uitsluitend via het fysieke rijm.
 * Er bestaat bewust geen actie om dialogen of de animatie over te slaan.
 */
export const CODE_LENGTH = 4;

/** Eenvoudige FNV-1a-hash (32 bit); alleen bedoeld om de code niet leesbaar in de content te zetten. */
export function hashCode(value: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

export interface FinaleRules {
  codeHash: number;
}

export type CodeCheck = "incomplete" | "correct" | "wrong";

export function checkCode(rules: FinaleRules, input: string): CodeCheck {
  if (!/^\d{4}$/.test(input)) return "incomplete";
  return hashCode(input) === rules.codeHash ? "correct" : "wrong";
}

export type FinalePhase =
  | "intro" // verplichte Sinterklaasdialogen
  | "lock" // codeslot
  | "wrong" // Sinterklaas reageert op een foute code
  | "gate" // scène A: slot en poort gaan open
  | "run" // scène B: Minou rent naar Job
  | "hug" // scène C: knuffels en kusjes
  | "escalate" // scène D: het wordt steeds erger
  | "outro" // scène E: Sinterklaas grijpt in
  | "end"; // eindscherm

/** Fases die een vaste tijdlijn volgen (duur in content/delft.ts). */
export const TIMELINE_PHASES = ["gate", "run", "hug", "escalate"] as const;
export type TimelinePhase = (typeof TIMELINE_PHASES)[number];

export interface FinaleState {
  phase: FinalePhase;
  /** Wat de speler nu heeft ingetypt (alleen cijfers, maximaal vier). */
  code: string;
  wrongAttempts: number;
  /** Pas true nadat de hele finale (incl. afsluitende dialoog) is doorlopen. */
  completed: boolean;
}

export type FinaleAction =
  | { type: "introDone" }
  | { type: "digit"; digit: string }
  | { type: "backspace" }
  | { type: "submit" }
  | { type: "wrongDone" }
  | { type: "advance" }
  | { type: "outroDone" };

export function createFinaleState(): FinaleState {
  return { phase: "intro", code: "", wrongAttempts: 0, completed: false };
}

const NEXT: Record<TimelinePhase, FinalePhase> = { gate: "run", run: "hug", hug: "escalate", escalate: "outro" };

export function finaleReducer(rules: FinaleRules, state: FinaleState, action: FinaleAction): FinaleState {
  switch (action.type) {
    case "introDone":
      return state.phase === "intro" ? { ...state, phase: "lock" } : state;
    case "digit":
      if (state.phase !== "lock" || !/^\d$/.test(action.digit) || state.code.length >= CODE_LENGTH) return state;
      return { ...state, code: state.code + action.digit };
    case "backspace":
      return state.phase === "lock" && state.code.length > 0 ? { ...state, code: state.code.slice(0, -1) } : state;
    case "submit": {
      if (state.phase !== "lock") return state; // dubbele klik/Enter start niets opnieuw
      const result = checkCode(rules, state.code);
      if (result === "incomplete") return state;
      if (result === "correct") return { ...state, phase: "gate" };
      return { ...state, phase: "wrong", code: "", wrongAttempts: state.wrongAttempts + 1 };
    }
    case "wrongDone":
      return state.phase === "wrong" ? { ...state, phase: "lock" } : state;
    case "advance": {
      const next = (TIMELINE_PHASES as readonly string[]).includes(state.phase) ? NEXT[state.phase as TimelinePhase] : null;
      return next ? { ...state, phase: next } : state;
    }
    case "outroDone":
      return state.phase === "outro" ? { ...state, phase: "end", completed: true } : state;
  }
}
