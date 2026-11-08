/**
 * Rotterdam Centraal — pure logica: de treinpuzzel én de verhaalstroom.
 * Alle inhoud (treinen, aanwijzingen, teksten) staat in content/rotterdam.ts.
 *
 * De puzzel is volledig vast en controleerbaar: elke aanwijzing is een regel
 * (`ClueRule`) die op de vaste feiten van een trein wordt toegepast. De oplossing
 * is de ene trein die aan álle aanwijzingen voldoet (zie rotterdam.test.ts).
 */

export type Heading = "den-haag" | "dordrecht";
export type TrainKind = "intercity" | "sprinter";

export interface TrainDef {
  id: string;
  platform: number;
  kind: TrainKind;
  /** Vertrektijd zoals op het bord. */
  time: string;
  /** Richting zoals op het bord. */
  destination: string;
  heading: Heading;
  /** Eindstation. */
  terminus: string;
  /** Alle stations waar de trein stopt (incl. eindstation). Niet direct op het bord getoond. */
  stops: readonly string[];
  /** Stopt op ook de kleinere stations? */
  stopsAtSmallStations: boolean;
}

export type ClueRule =
  | { type: "smallStations" }
  | { type: "notHeading"; heading: Heading }
  | { type: "intermediateStop"; station: string };

export interface ClueDef {
  id: string;
  rule: ClueRule;
}

export function trainSatisfies(train: TrainDef, rule: ClueRule): boolean {
  switch (rule.type) {
    case "smallStations":
      return train.stopsAtSmallStations;
    case "notHeading":
      return train.heading !== rule.heading;
    case "intermediateStop":
      return train.stops.includes(rule.station) && train.terminus !== rule.station;
  }
}

/** Treinen die aan alle aanwijzingen voldoen. */
export function validTrains(trains: readonly TrainDef[], clues: readonly ClueDef[]): TrainDef[] {
  return trains.filter((t) => clues.every((c) => trainSatisfies(t, c.rule)));
}

export interface PuzzleRules {
  trains: readonly TrainDef[];
  clues: readonly ClueDef[];
}

/** De oplossing bestaat alleen als er exact één trein overblijft. */
export function solutionOf(rules: PuzzleRules): string | null {
  const v = validTrains(rules.trains, rules.clues);
  return v.length === 1 ? v[0].id : null;
}

export type DestinationId = "leiden" | "delft";

export type RotterdamPhase =
  | "announcement" // verplichte Eline-omroep + reactie van Sinterklaas
  | "clues" // Sinterklaas legt de aanwijzingen uit
  | "puzzle" // vertrekbord: kies een trein
  | "wrong" // grappige reactie op een verkeerde trein
  | "found" // juiste trein licht op + Sinterklaas' vraag
  | "choice" // Leiden of Delft?
  | "delft" // Sinterklaas reageert op Delft
  | "therapy" // volledige scène met Relatiepsycholoog-Piet
  | "advice" // knop "Accepteer het relatieadvies"
  | "boarding" // Minou stapt in
  | "departing" // de trein vertrekt
  | "done";

export interface RotterdamState {
  phase: RotterdamPhase;
  /** De omroep is daadwerkelijk getoond en bevestigd. */
  announcementHeard: boolean;
  solved: boolean;
  wrongAttempts: number;
  lastWrongTrainId: string | null;
  destination: DestinationId | null;
  adviceAccepted: boolean;
}

export type RotterdamAction =
  | { type: "announcementDone" }
  | { type: "cluesDone" }
  | { type: "pickTrain"; trainId: string }
  | { type: "wrongDone" }
  | { type: "foundDone" }
  | { type: "pickDestination"; id: DestinationId }
  | { type: "delftDone" }
  | { type: "therapyDone" }
  | { type: "acceptAdvice" }
  | { type: "boardDone" }
  | { type: "departDone" };

export function createRotterdamState(): RotterdamState {
  return {
    phase: "announcement",
    announcementHeard: false,
    solved: false,
    wrongAttempts: 0,
    lastWrongTrainId: null,
    destination: null,
    adviceAccepted: false,
  };
}

/**
 * Verhaalstroom van Rotterdam. Ongeldige acties (verkeerde fase, onbekende trein)
 * geven dezelfde staat terug; je kunt dus nooit een stap overslaan.
 */
export function rotterdamReducer(
  rules: PuzzleRules,
  state: RotterdamState,
  action: RotterdamAction,
): RotterdamState {
  const go = (phase: RotterdamPhase, patch: Partial<RotterdamState> = {}): RotterdamState => ({ ...state, ...patch, phase });

  switch (action.type) {
    case "announcementDone":
      return state.phase === "announcement" ? go("clues", { announcementHeard: true }) : state;
    case "cluesDone":
      return state.phase === "clues" ? go("puzzle") : state;
    case "pickTrain": {
      if (state.phase !== "puzzle" || !state.announcementHeard) return state;
      if (!rules.trains.some((t) => t.id === action.trainId)) return state;
      if (action.trainId === solutionOf(rules)) return go("found", { solved: true });
      return go("wrong", { wrongAttempts: state.wrongAttempts + 1, lastWrongTrainId: action.trainId });
    }
    case "wrongDone":
      return state.phase === "wrong" ? go("puzzle") : state;
    case "foundDone":
      return state.phase === "found" && state.solved ? go("choice") : state;
    case "pickDestination":
      if (state.phase !== "choice") return state;
      return action.id === "delft" ? go("delft", { destination: "delft" }) : go("therapy", { destination: "leiden" });
    case "delftDone":
      return state.phase === "delft" ? go("boarding") : state;
    case "therapyDone":
      return state.phase === "therapy" ? go("advice") : state;
    case "acceptAdvice":
      return state.phase === "advice" ? go("boarding", { adviceAccepted: true }) : state;
    case "boardDone":
      return state.phase === "boarding" ? go("departing") : state;
    case "departDone":
      return state.phase === "departing" ? go("done") : state;
  }
}

/** Rotterdam mag pas voltooid worden als alle verplichte stappen echt zijn doorlopen. */
export function isRotterdamFinished(state: RotterdamState): boolean {
  if (state.phase !== "done" || !state.announcementHeard || !state.solved) return false;
  return state.destination === "delft" || (state.destination === "leiden" && state.adviceAccepted);
}
