/**
 * Inventaris van Minou — afgeleid van de centrale spelstatus (geen aparte opslag,
 * dus nooit uit de pas met de voortgang). Wat in Tilburg is ingepakt, is vanaf
 * dan beschikbaar: de zeven juiste voorwerpen uit content/tilburg.ts.
 */
import { packingItems } from "@/content/tilburg";
import type { GameState } from "./progress";

export function collectedItemIds(state: GameState): string[] {
  if (!state.completed.includes("tilburg")) return [];
  return packingItems.filter((i) => i.correct).map((i) => i.id);
}

export function hasItem(state: GameState, itemId: string): boolean {
  return collectedItemIds(state).includes(itemId);
}
