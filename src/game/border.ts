/**
 * Regels van de grenscontrole in Dordrecht — pure logica.
 * Welk voorwerp telt als toegangsbewijs en welke voorwerpen getoond worden,
 * staat in content/dordrecht.ts.
 */
export interface BorderRules {
  /** Het enige voorwerp dat de controle laat slagen. */
  requiredItemId: string;
  /** Voorwerpen die de speler kan tonen (alleen wat ook echt in de inventaris zit). */
  offeredItemIds: readonly string[];
}

export type BorderOutcome = "accepted" | "rejected" | "unavailable";

/** De voorwerpen die op de balie liggen: gewenste lijst ∩ inventaris, in de volgorde van de lijst. */
export function offeredItems(rules: BorderRules, inventory: readonly string[]): string[] {
  return rules.offeredItemIds.filter((id) => inventory.includes(id));
}

/**
 * Toont de speler dit voorwerp aan Piet?
 *  - `unavailable`: het voorwerp zit niet in de inventaris of ligt niet op de balie
 *  - `accepted`: het juiste toegangsbewijs
 *  - `rejected`: elk ander voorwerp (onbeperkt opnieuw proberen)
 */
export function checkItem(rules: BorderRules, inventory: readonly string[], itemId: string): BorderOutcome {
  if (!offeredItems(rules, inventory).includes(itemId)) return "unavailable";
  return itemId === rules.requiredItemId ? "accepted" : "rejected";
}
