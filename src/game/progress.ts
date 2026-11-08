/**
 * Spelstatus — pure logica, geen browser-API's (volledig testbaar).
 *
 * Opgeslagen (persistent): voltooide locaties, waar Minou staat, en welke
 * viering-animaties al getoond zijn. De animatiestatus zelf wordt NIET
 * bewaard: bij verversen valt alles terug op deze consistente staat.
 *
 * Statussen: locked | available | active | completed.
 *  - `active` is tijdelijk (reis of scène bezig) en wordt door de UI meegegeven.
 */
import { locations } from "@/content/locations";

export const LOCATION_ORDER: readonly string[] = locations.map((l) => l.id);

export type LocationStatus = "locked" | "available" | "active" | "completed";

export const SAVE_VERSION = 2;

export interface GameState {
  version: typeof SAVE_VERSION;
  /** Voltooide locaties, altijd een prefix van LOCATION_ORDER. */
  completed: string[];
  /** Locatie waar Minou nu staat: laatst voltooide of de eerstvolgende. */
  minouAt: string;
  /** Sleutels van viering-animaties die al getoond zijn ("done:x", "unlock:x"). */
  celebrated: string[];
}

export function createInitialState(order: readonly string[] = LOCATION_ORDER): GameState {
  return {
    version: SAVE_VERSION,
    completed: [],
    minouAt: order[0],
    celebrated: [`unlock:${order[0]}`],
  };
}

/** De enige locatie die nu aan de beurt is (of null als alles klaar is). */
export function getNextId(state: GameState, order: readonly string[] = LOCATION_ORDER): string | null {
  return order[state.completed.length] ?? null;
}

export function getStatus(
  state: GameState,
  id: string,
  activeId: string | null = null,
  order: readonly string[] = LOCATION_ORDER,
): LocationStatus {
  if (state.completed.includes(id)) return "completed";
  if (id !== getNextId(state, order)) return "locked";
  return id === activeId ? "active" : "available";
}

/** Mag de speler reizen naar `id`? Alleen naar de volgende locatie, vanaf de vorige. */
export function canTravelTo(state: GameState, id: string, order: readonly string[] = LOCATION_ORDER): boolean {
  const i = order.indexOf(id);
  return i > 0 && id === getNextId(state, order) && state.minouAt === order[i - 1];
}

/** Mag de scène van `id` starten? Alleen als het de volgende is én Minou er staat. */
export function canEnter(state: GameState, id: string, order: readonly string[] = LOCATION_ORDER): boolean {
  return id === getNextId(state, order) && state.minouAt === id;
}

/** Minou komt aan na een reis. Ongeldige aanvragen laten de staat ongemoeid. */
export function arriveAt(state: GameState, id: string, order: readonly string[] = LOCATION_ORDER): GameState {
  if (!canTravelTo(state, id, order)) return state;
  return { ...state, minouAt: id };
}

/** Rond een locatie af. Alleen mogelijk als de speler er daadwerkelijk is. */
export function completeLocation(state: GameState, id: string, order: readonly string[] = LOCATION_ORDER): GameState {
  if (!canEnter(state, id, order)) return state;
  return { ...state, completed: [...state.completed, id] };
}

export function markCelebrated(state: GameState, ...keys: string[]): GameState {
  const fresh = keys.filter((k) => !state.celebrated.includes(k));
  return fresh.length ? { ...state, celebrated: [...state.celebrated, ...fresh] } : state;
}

export interface PendingCelebrations {
  /** Locatie die net voltooid is en nog een succesanimatie moet krijgen. */
  doneId: string | null;
  /** Locatie die net vrijgespeeld is en nog moet oplichten. */
  unlockId: string | null;
}

export function getPendingCelebrations(
  state: GameState,
  order: readonly string[] = LOCATION_ORDER,
): PendingCelebrations {
  const last = state.completed[state.completed.length - 1] ?? null;
  const next = getNextId(state, order);
  return {
    doneId: last && !state.celebrated.includes(`done:${last}`) ? last : null,
    unlockId: next && !state.celebrated.includes(`unlock:${next}`) ? next : null,
  };
}

/**
 * Valideert/repareert ruwe opslag (ook oude v1). Geeft null bij onbruikbare data.
 * Herstelt altijd naar een consistente staat, zodat verversen nooit corrupt is.
 */
export function normalizeState(raw: unknown, order: readonly string[] = LOCATION_ORDER): GameState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if ((r.version !== 1 && r.version !== SAVE_VERSION) || !Array.isArray(r.completed)) return null;

  // completed moet een prefix van de route zijn; neem de langste geldige prefix.
  let n = 0;
  while (n < r.completed.length && n < order.length && r.completed[n] === order[n]) n++;
  const completed = order.slice(0, n);

  const last = completed[completed.length - 1] ?? order[0];
  const next = order[completed.length];
  const minouAt = r.minouAt === last || (next !== undefined && r.minouAt === next) ? (r.minouAt as string) : last;

  const celebrated =
    r.version === SAVE_VERSION && Array.isArray(r.celebrated)
      ? r.celebrated.filter((k): k is string => typeof k === "string")
      : [
          // Migratie: alles wat al behaald is, telt als gevierd.
          ...completed.map((id) => `done:${id}`),
          ...(next ? [`unlock:${next}`] : []),
          `unlock:${order[0]}`,
        ];

  return { version: SAVE_VERSION, completed, minouAt, celebrated };
}

export type CrossState = "hidden" | "static" | "animate";

/**
 * Rood kruis over Leiden op de kaart: pas zichtbaar als Rotterdam voltooid is (voor beide keuzes
 * hetzelfde), met één keer een tekenanimatie; daarna ("cross:leiden" gevierd) direct zichtbaar.
 */
export function leidenCrossState(state: GameState): CrossState {
  if (!state.completed.includes("rotterdam")) return "hidden";
  return state.celebrated.includes("cross:leiden") ? "static" : "animate";
}