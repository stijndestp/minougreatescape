/**
 * Opslag in localStorage + React-hook. Alle statuswijzigingen lopen via de
 * pure functies in progress.ts; hier alleen lezen/schrijven en abonneren.
 */
import { useMemo, useSyncExternalStore } from "react";
import {
  arriveAt,
  completeLocation,
  createInitialState,
  markCelebrated,
  normalizeState,
  type GameState,
} from "./progress";

export const STORAGE_KEY = "minou-great-escape:save";

const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): GameState | null {
  if (!raw) return null;
  try {
    return normalizeState(JSON.parse(raw));
  } catch {
    return null;
  }
}

function write(state: GameState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* opslag niet beschikbaar: spel werkt dan zonder opslag */
  }
  emit();
}

/** Leest de huidige staat (null = geen opslag). */
export const loadState = (): GameState | null => parse(readRaw());

function update(fn: (s: GameState) => GameState) {
  const s = loadState();
  if (!s) return;
  const next = fn(s);
  if (next !== s) write(next);
}

export function startNewGame(): void {
  write(createInitialState());
}

/** Wordt aangeroepen na elk voltooid level (automatische opslag). */
export function saveCompleteLocation(id: string): void {
  update((s) => completeLocation(s, id));
}

export function saveArriveAt(id: string): void {
  update((s) => arriveAt(s, id));
}

export function saveCelebrated(...keys: string[]): void {
  update((s) => markCelebrated(s, ...keys));
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

/**
 * `undefined` tijdens eerste render/hydratie, `null` zonder opslag,
 * anders de (gevalideerde) spelstatus.
 */
export function useSave(): GameState | null | undefined {
  const raw = useSyncExternalStore<string | null | undefined>(subscribe, readRaw, () => undefined);
  // useMemo: stabiele identiteit zolang de ruwe opslag niet verandert.
  return useMemo(() => (raw === undefined ? undefined : parse(raw)), [raw]);
}
