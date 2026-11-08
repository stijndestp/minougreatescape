import type { Point } from "./projection";

export interface GeoFeature {
  properties: { name: string };
  geometry: {
    type: "MultiPolygon" | "MultiLineString";
    coordinates: number[][][][] | number[][][];
  };
}

export interface GeoCollection {
  features: GeoFeature[];
}

type Projector = (lon: number, lat: number) => Point;

const fmt = (n: number) => Math.round(n * 10) / 10;

function ringToPath(ring: number[][], project: Projector, close: boolean): string {
  return (
    ring
      .map(([lon, lat], i) => {
        const p = project(lon, lat);
        return `${i === 0 ? "M" : "L"}${fmt(p.x)} ${fmt(p.y)}`;
      })
      .join("") + (close ? "Z" : "")
  );
}

/** Zet een GeoJSON-feature om naar één SVG-pad (`d`-attribuut). */
export function featureToPath(f: GeoFeature, project: Projector): string {
  if (f.geometry.type === "MultiPolygon") {
    return (f.geometry.coordinates as number[][][][])
      .map((poly) => poly.map((ring) => ringToPath(ring, project, true)).join(""))
      .join("");
  }
  return (f.geometry.coordinates as number[][][])
    .map((line) => ringToPath(line, project, false))
    .join("");
}

export function collectionToPaths(c: GeoCollection, project: Projector) {
  return c.features.map((f) => ({ name: f.properties.name, d: featureToPath(f, project) }));
}
