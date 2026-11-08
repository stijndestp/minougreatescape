/**
 * Logica van de Tilburg-puzzel "Pak je koffers!". Pure functies; welke
 * voorwerpen er zijn en welke juist zijn staat in src/content/tilburg.ts.
 */
export interface PackingItem {
  id: string;
  correct: boolean;
}

export interface PackingState {
  /** Id's van correct ingepakte voorwerpen, in volgorde van inpakken. */
  collected: string[];
}

export type PickOutcome = "collected" | "duplicate" | "wrong" | "unknown";

export const createPackingState = (): PackingState => ({ collected: [] });

export function requiredIds(items: readonly PackingItem[]): string[] {
  return items.filter((i) => i.correct).map((i) => i.id);
}

/** Pak een voorwerp. Verkeerde/onbekende/dubbele keuzes veranderen niets. */
export function pickItem(
  items: readonly PackingItem[],
  state: PackingState,
  id: string,
): { state: PackingState; outcome: PickOutcome } {
  const item = items.find((i) => i.id === id);
  if (!item) return { state, outcome: "unknown" };
  if (!item.correct) return { state, outcome: "wrong" };
  if (state.collected.includes(id)) return { state, outcome: "duplicate" };
  return { state: { collected: [...state.collected, id] }, outcome: "collected" };
}

/** Klaar als precies de juiste voorwerpen zijn ingepakt (niet slechts een aantal). */
export function isPackingComplete(items: readonly PackingItem[], state: PackingState): boolean {
  const required = requiredIds(items);
  return (
    required.length > 0 &&
    required.every((id) => state.collected.includes(id)) &&
    state.collected.every((id) => required.includes(id))
  );
}
