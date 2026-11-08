/**
 * Projectie: lon/lat → kaartcoördinaten (SVG-eenheden).
 * Equirectangulair met breedtegraadcorrectie (cos 51.85°) — accuraat genoeg
 * voor dit gebied en eenvoudig. Eenheid: 1 graad breedte = SCALE eenheden.
 */
export const SCALE = 1250;
const LAT_CORRECTION = Math.cos((51.85 * Math.PI) / 180);

/** Linkerbovenhoek van de standaardweergave (1600 × 900). */
export const ORIGIN = { lon: 3.7, lat: 52.22 };

export interface Point {
  x: number;
  y: number;
}

export function project(lon: number, lat: number): Point {
  return {
    x: (lon - ORIGIN.lon) * LAT_CORRECTION * SCALE,
    y: (ORIGIN.lat - lat) * SCALE,
  };
}

export function unproject(x: number, y: number): { lon: number; lat: number } {
  return {
    lon: ORIGIN.lon + x / (LAT_CORRECTION * SCALE),
    lat: ORIGIN.lat - y / SCALE,
  };
}

export interface Camera {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Standaardcamera: heel het speelgebied in 16:9. Later te animeren. */
export const DEFAULT_CAMERA: Camera = { x: 0, y: 0, width: 1600, height: 900 };

export const cameraToViewBox = (c: Camera) => `${c.x} ${c.y} ${c.width} ${c.height}`;
