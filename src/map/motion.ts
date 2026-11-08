/**
 * Bewegings- en camerawiskunde (puur, geen DOM). Herbruikbaar voor alle trajecten.
 */
import type { Camera, Point } from "./projection";

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* ---------- pad ---------- */
export interface PathInfo {
  points: Point[];
  /** Cumulatieve afstand tot elk punt (cum[0] = 0). */
  cum: number[];
  length: number;
}

export function buildPath(points: readonly Point[]): PathInfo {
  const cum = [0];
  for (let i = 1; i < points.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y));
  }
  return { points: [...points], cum, length: cum[cum.length - 1] };
}

export interface PathSample extends Point {
  /** Bewegingsrichting in radialen. */
  angle: number;
}

/** Punt op afstand `d` langs het pad (geklemd tussen 0 en lengte). */
export function pointAt(path: PathInfo, d: number): PathSample {
  const dist = Math.min(path.length, Math.max(0, d));
  let i = 1;
  while (i < path.cum.length - 1 && path.cum[i] < dist) i++;
  const a = path.points[i - 1];
  const b = path.points[i];
  const segLen = path.cum[i] - path.cum[i - 1] || 1;
  const t = (dist - path.cum[i - 1]) / segLen;
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), angle: Math.atan2(b.y - a.y, b.x - a.x) };
}

/* ---------- snelheidsprofiel ---------- */
export interface Profile {
  /** Totale duur in seconden. */
  duration: number;
  vMax: number;
  ramp: number;
}

/**
 * Trapeziumprofiel: soepel optrekken, constante snelheid, soepel afremmen.
 * `speed` in kaarteenheden per seconde.
 */
export function makeProfile(length: number, speed: number, ramp = 0.5): Profile {
  // Bij korte paden de ramp verkleinen zodat optrekken + afremmen past.
  const r = Math.min(ramp, length / speed / 2);
  return { duration: length / speed + r, vMax: speed, ramp: r };
}

/** Afgelegde afstand na `t` seconden. */
export function distanceAt(p: Profile, t: number, length: number): number {
  if (t <= 0) return 0;
  if (t >= p.duration) return length;
  const { vMax, ramp: r } = p;
  if (r === 0) return Math.min(length, vMax * t);
  if (t < r) return (vMax * t * t) / (2 * r);
  const tEnd = p.duration - r; // begin afremmen
  if (t <= tEnd) return (vMax * r) / 2 + vMax * (t - r);
  const u = p.duration - t; // resterende tijd
  return length - (vMax * u * u) / (2 * r);
}

/* ---------- camera ---------- */
export const ASPECT = 9 / 16;

/** Camera gecentreerd op `center` met gegeven breedte (16:9). */
export function cameraAround(center: Point, width: number): Camera {
  const height = width * ASPECT;
  return { x: center.x - width / 2, y: center.y - height / 2, width, height };
}

export function lerpCamera(a: Camera, b: Camera, t: number): Camera {
  return {
    x: lerp(a.x, b.x, t),
    y: lerp(a.y, b.y, t),
    width: lerp(a.width, b.width, t),
    height: lerp(a.height, b.height, t),
  };
}

/**
 * Zoom-interpolatie: interpoleert het cameramiddelpunt en de breedte
 * (logaritmisch), zodat in- en uitzoomen visueel gelijkmatig voelt.
 */
export function zoomCamera(a: Camera, b: Camera, t: number): Camera {
  const center = {
    x: lerp(a.x + a.width / 2, b.x + b.width / 2, t),
    y: lerp(a.y + a.height / 2, b.y + b.height / 2, t),
  };
  const width = Math.exp(lerp(Math.log(a.width), Math.log(b.width), t));
  return cameraAround(center, width);
}
