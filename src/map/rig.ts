/**
 * Herbruikbare animaties voor de kaart (requestAnimationFrame, imperatief,
 * zodat de zware SVG-lagen niet per frame opnieuw renderen).
 *
 * `MapRig` is de brug naar de weergave: wie de camera en Minou kan zetten.
 * Alle trajecten (nu en later) gebruiken `runTravel` / `runZoom`.
 */
import { buildPath, cameraAround, distanceAt, easeInOutCubic, makeProfile, pointAt, zoomCamera } from "./motion";
import type { Camera, Point } from "./projection";

export interface MinouPose {
  walking?: boolean;
  facingLeft?: boolean;
}

export interface MapRig {
  setCamera(camera: Camera): void;
  setMinou(point: Point, pose?: MinouPose): void;
}

export const TRAVEL = {
  /** Kaarteenheden per seconde (constante loopsnelheid). */
  speed: 120,
  /** Camerabreedte tijdens het reizen (zoom op Minou). */
  zoomWidth: 640,
  zoomInMs: 900,
  /** Camera toont kort de bestemming. */
  showDestinationMs: 900,
};

/** Draait `onFrame(p)` met p van 0 → 1 gedurende `ms`. Resolve false bij annuleren. */
export function animate(ms: number, onFrame: (p: number) => void, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      if (signal.aborted) return resolve(false);
      const p = ms <= 0 ? 1 : Math.min(1, Math.max(0, (now - start) / ms));
      onFrame(p);
      if (p >= 1) resolve(true);
      else requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

export function wait(ms: number, signal: AbortSignal): Promise<boolean> {
  return new Promise((resolve) => {
    const id = setTimeout(() => resolve(!signal.aborted), ms);
    signal.addEventListener("abort", () => {
      clearTimeout(id);
      resolve(false);
    });
  });
}

/** Zoom de camera soepel naar een punt. */
export async function runZoom(
  rig: MapRig,
  from: Camera,
  center: Point,
  width: number,
  ms: number,
  signal: AbortSignal,
): Promise<boolean> {
  const to = cameraAround(center, width);
  return animate(ms, (p) => rig.setCamera(zoomCamera(from, to, easeInOutCubic(p))), signal);
}

/**
 * Volledige reis: inzoomen op Minou → lopen langs `route` (camera volgt) →
 * stoppen → camera toont de bestemming. Resolve true als alles afgerond is.
 */
export async function runTravel(
  rig: MapRig,
  route: readonly Point[],
  fromCamera: Camera,
  signal: AbortSignal,
  opts: Partial<typeof TRAVEL> = {},
): Promise<boolean> {
  const cfg = { ...TRAVEL, ...opts };
  const path = buildPath(route);
  const start = path.points[0];
  const end = path.points[path.points.length - 1];
  const facingLeft0 = pointAt(path, 0).angle;
  const left0 = Math.cos(facingLeft0) < 0;

  rig.setMinou(start, { walking: false, facingLeft: left0 });
  if (!(await runZoom(rig, fromCamera, start, cfg.zoomWidth, cfg.zoomInMs, signal))) return false;

  const profile = makeProfile(path.length, cfg.speed);
  const walked = await animate(
    profile.duration * 1000,
    (p) => {
      const d = distanceAt(profile, p * profile.duration, path.length);
      const s = pointAt(path, d);
      rig.setMinou(s, { walking: true, facingLeft: Math.cos(s.angle) < 0 });
      rig.setCamera(cameraAround(s, cfg.zoomWidth));
    },
    signal,
  );
  if (!walked) return false;

  rig.setMinou(end, { walking: false, facingLeft: Math.cos(pointAt(path, path.length).angle) < 0 });
  const focus = cameraAround(end, cfg.zoomWidth);
  const closer = cameraAround(end, cfg.zoomWidth * 0.8);
  if (!(await animate(cfg.showDestinationMs, (p) => rig.setCamera(zoomCamera(focus, closer, easeInOutCubic(p))), signal))) {
    return false;
  }
  return true;
}
