/**
 * Logica van de brugpuzzel (Moerdijk). Pure functies op stabiele ID's — geen
 * pixels, geen muispositie, geen schermafmetingen. De vormen, onderdelen en
 * openingen staan in src/content/moerdijk.ts.
 */
export interface PartRule {
  id: string;
  /** Slot waar dit onderdeel in past; leeg bij een afleider. */
  correctSlot?: string;
}

export interface SlotRule {
  id: string;
  /** Het ene onderdeel dat hier past. */
  requires: string;
}

export interface BridgeRules {
  parts: readonly PartRule[];
  slots: readonly SlotRule[];
}

export interface BridgeState {
  /** slotId → partId van de correct geplaatste onderdelen. */
  placed: Readonly<Record<string, string>>;
}

export type PlaceOutcome = "placed" | "wrong" | "invalid";

export const createBridgeState = (): BridgeState => ({ placed: {} });

export const isPartPlaced = (s: BridgeState, partId: string) => Object.values(s.placed).includes(partId);
export const isSlotFilled = (s: BridgeState, slotId: string) => slotId in s.placed;

/**
 * Probeer `partId` in `slotId` te plaatsen. Alleen de echte combinatie slaagt.
 * Een verkeerde plaatsing, een al geplaatst onderdeel, een gevulde opening of
 * onbekende id's veranderen de staat niet (dezelfde state-referentie).
 */
export function placePart(
  rules: BridgeRules,
  state: BridgeState,
  partId: string,
  slotId: string,
): { state: BridgeState; outcome: PlaceOutcome } {
  const part = rules.parts.find((p) => p.id === partId);
  const slot = rules.slots.find((s) => s.id === slotId);
  if (!part || !slot || isPartPlaced(state, partId) || isSlotFilled(state, slotId)) {
    return { state, outcome: "invalid" };
  }
  if (slot.requires === part.id && part.correctSlot === slot.id) {
    return { state: { placed: { ...state.placed, [slotId]: partId } }, outcome: "placed" };
  }
  return { state, outcome: "wrong" };
}

/** Voltooid zodra elke opening met haar juiste onderdeel gevuld is. */
export const isBridgeComplete = (rules: BridgeRules, s: BridgeState) =>
  rules.slots.length > 0 && rules.slots.every((slot) => s.placed[slot.id] === slot.requires);
