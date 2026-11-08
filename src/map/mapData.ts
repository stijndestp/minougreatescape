/**
 * Bouwt alle kaartgegevens (SVG-paden, stadspunten, route) uit de lokale
 * GeoJSON-bestanden. Pure data — geen React. De weergave staat in
 * src/components/WorldMap.tsx en OverviewMap.tsx.
 */
import provincesDetail from "./geo/provinces-detail.geo.json";
import provincesOverview from "./geo/provinces-overview.geo.json";
import rivers from "./geo/rivers.geo.json";
import neighbours from "./geo/neighbours.geo.json";
import waterbodies from "./geo/waterbodies.geo.json";
import { cities, moerdijkBridge, OPTIONAL_LINKS, ROUTE_IDS, waterLabels } from "./cities";
import { collectionToPaths, type GeoCollection, type GeoFeature } from "./geometry";
import { DEFAULT_CAMERA, project, unproject, type Point } from "./projection";

const asCollection = (c: unknown) => c as GeoCollection;

export const provincePaths = collectionToPaths(asCollection(provincesDetail), project);
export const neighbourPaths = collectionToPaths(asCollection(neighbours), project);
const waterBodies = asCollection(waterbodies);
const isPolygon = (f: GeoFeature) => f.geometry.type === "MultiPolygon";

/** Rivieren als lijnen (OSM-waterlopen + lijn-relaties zoals Nieuwe Merwede). */
export const riverPaths = collectionToPaths(
  { features: [...asCollection(rivers).features, ...waterBodies.features.filter((f) => !isPolygon(f))] },
  project,
);

/** Brede waterlichamen als vlakken (Hollands Diep). */
export const waterBodyPaths = collectionToPaths(
  { features: waterBodies.features.filter(isPolygon) },
  project,
);

export interface MapCity {
  id: string;
  name: string;
  role: "route" | "optional";
  labelSide: "left" | "right" | "above" | "below";
  point: Point;
}

export const mapCities: MapCity[] = cities.map((c) => ({
  id: c.id,
  name: c.name,
  role: c.role,
  labelSide: c.labelSide,
  point: project(c.lon, c.lat),
}));

export const cityPoint = (id: string): Point => {
  const c = mapCities.find((m) => m.id === id);
  if (!c) throw new Error(`Onbekende stad: ${id}`);
  return c.point;
};

/** Hoofdroute als lijst punten (lineair Tilburg → Delft). */
export const routePoints: Point[] = ROUTE_IDS.map(cityPoint);

/** Routestuk tussen twee route-steden (inclusief), in reisrichting. */
export function routeBetween(fromId: string, toId: string): Point[] {
  const a = ROUTE_IDS.indexOf(fromId as (typeof ROUTE_IDS)[number]);
  const b = ROUTE_IDS.indexOf(toId as (typeof ROUTE_IDS)[number]);
  if (a < 0 || b < 0) throw new Error(`Geen route van ${fromId} naar ${toId}`);
  return a <= b ? routePoints.slice(a, b + 1) : routePoints.slice(b, a + 1).reverse();
}

export const optionalLinks = OPTIONAL_LINKS.map(([a, b]) => [cityPoint(a), cityPoint(b)] as const);

export const mapWaterLabels = waterLabels.map((l) => ({ ...l, point: project(l.lon, l.lat) }));

export const bridgePoint = project(moerdijkBridge.lon, moerdijkBridge.lat);

/* ---------- overzichtskaart van heel Nederland ---------- */
const OV = { minLon: 3.2, maxLon: 7.3, minLat: 50.7, maxLat: 53.6, scale: 100 };
const OV_COS = Math.cos((52.1 * Math.PI) / 180);
export const overviewSize = {
  width: (OV.maxLon - OV.minLon) * OV_COS * OV.scale,
  height: (OV.maxLat - OV.minLat) * OV.scale,
};
const overviewProject = (lon: number, lat: number): Point => ({
  x: (lon - OV.minLon) * OV_COS * OV.scale,
  y: (OV.maxLat - lat) * OV.scale,
});

/** Kaartpunt (speelgebied) → punt op de overzichtskaart. */
export function toOverview(p: Point): Point {
  const g = unproject(p.x, p.y);
  return overviewProject(g.lon, g.lat);
}

export const overviewPaths = collectionToPaths(asCollection(provincesOverview), overviewProject);

/** Rechthoek van het huidige speelgebied (standaardcamera) op de overzichtskaart. */
export function overviewViewport(camera = DEFAULT_CAMERA) {
  const tl = unproject(camera.x, camera.y);
  const br = unproject(camera.x + camera.width, camera.y + camera.height);
  const a = overviewProject(tl.lon, tl.lat);
  const b = overviewProject(br.lon, br.lat);
  return { x: a.x, y: a.y, width: b.x - a.x, height: b.y - a.y };
}
