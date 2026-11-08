/**
 * Zet de ruwe bronbestanden in data/source om naar compacte GeoJSON-bestanden
 * in src/map/geo. Draai met: npm run build:map
 *
 * - provincies: PDOK/CBS (echte contouren). Detail-versie voor het speelgebied,
 *   sterk vereenvoudigde versie voor de overzichtskaart.
 * - rivieren: OpenStreetMap-waterlopen, samengevoegd per rivier.
 * - buurlanden: Natural Earth (België, Duitsland), geknipt op het speelgebied.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = (f) => path.join(root, "data", "source", f);
const out = (f) => path.join(root, "src", "map", "geo", f);
const read = (f) => JSON.parse(fs.readFileSync(src(f), "utf8"));

// Wereld-uitsnede (lon/lat) waarbinnen we data bewaren voor de spelkaart.
const WORLD = { minLon: 3.2, maxLon: 6.3, minLat: 51.1, maxLat: 52.7 };

const round = (n, d = 4) => Number(n.toFixed(d));

/* ---------- geometrie-hulpjes ---------- */
function perpDist(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  if (dx === 0 && dy === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  return Math.hypot(p[0] - (a[0] + t * dx), p[1] - (a[1] + t * dy));
}

/** Douglas-Peucker. */
function simplify(pts, eps) {
  if (pts.length < 3) return pts;
  let max = 0;
  let idx = 0;
  for (let i = 1; i < pts.length - 1; i++) {
    const d = perpDist(pts[i], pts[0], pts[pts.length - 1]);
    if (d > max) {
      max = d;
      idx = i;
    }
  }
  if (max <= eps) return [pts[0], pts[pts.length - 1]];
  return [
    ...simplify(pts.slice(0, idx + 1), eps).slice(0, -1),
    ...simplify(pts.slice(idx), eps),
  ];
}

function simplifyRing(ring, eps) {
  const s = simplify(ring, eps);
  return s.length >= 4 ? s.map(([x, y]) => [round(x), round(y)]) : null;
}

function bboxOf(ring) {
  let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
  for (const [x, y] of ring) {
    if (x < a) a = x;
    if (x > c) c = x;
    if (y < b) b = y;
    if (y > d) d = y;
  }
  return [a, b, c, d];
}

function touchesWorld(ring) {
  const [a, b, c, d] = bboxOf(ring);
  return !(c < WORLD.minLon || a > WORLD.maxLon || d < WORLD.minLat || b > WORLD.maxLat);
}

/** Sutherland–Hodgman: knip een ring op een rechthoek. */
function clipRing(ring, box) {
  const edges = [
    (p) => p[0] >= box.minLon, (p) => p[0] <= box.maxLon,
    (p) => p[1] >= box.minLat, (p) => p[1] <= box.maxLat,
  ];
  const inter = (p, q, i) => {
    if (i === 0 || i === 1) {
      const x = i === 0 ? box.minLon : box.maxLon;
      return [x, p[1] + ((q[1] - p[1]) * (x - p[0])) / (q[0] - p[0])];
    }
    const y = i === 2 ? box.minLat : box.maxLat;
    return [p[0] + ((q[0] - p[0]) * (y - p[1])) / (q[1] - p[1]), y];
  };
  let poly = ring.slice(0, -1);
  edges.forEach((inside, i) => {
    const next = [];
    for (let k = 0; k < poly.length; k++) {
      const cur = poly[k];
      const prev = poly[(k + poly.length - 1) % poly.length];
      if (inside(cur)) {
        if (!inside(prev)) next.push(inter(prev, cur, i));
        next.push(cur);
      } else if (inside(prev)) next.push(inter(prev, cur, i));
    }
    poly = next;
  });
  return poly.length >= 3 ? [...poly, poly[0]] : null;
}

const polygonsOf = (geom) =>
  geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;

/* ---------- provincies ---------- */
const prov = read("pdok_provincies.geojson");

function buildProvinces(eps, onlyWorld) {
  return {
    type: "FeatureCollection",
    features: prov.features.flatMap((f) => {
      const polys = polygonsOf(f.geometry)
        .filter((poly) => !onlyWorld || touchesWorld(poly[0]))
        .map((poly) => poly.map((r) => simplifyRing(r, eps)).filter(Boolean))
        .filter((poly) => poly.length > 0);
      if (polys.length === 0) return [];
      return [
        {
          type: "Feature",
          properties: { name: f.properties.statnaam, code: f.properties.statcode },
          geometry: { type: "MultiPolygon", coordinates: polys },
        },
      ];
    }),
  };
}

/* ---------- rivieren ---------- */
const WATER_NAMES = new Set([
  "Waal", "Lek", "Maas", "Bergsche Maas", "Amer", "Nieuwe Maas", "Oude Maas",
  "Noord", "Beneden-Merwede", "Boven-Merwede", "Nieuwe Merwede", "Spui",
  "Nieuwe Waterweg", "Haringvliet", "Dintel", "Mark", "Volkerak",
]);

function buildRivers() {
  const elements = [...read("osm_rivers_1.json").elements, ...read("osm_rivers_2.json").elements];
  const byName = new Map();
  const seen = new Set();
  for (const e of elements) {
    const name = e.tags?.name;
    if (!e.geometry || !WATER_NAMES.has(name) || e.tags.waterway === "fairway") continue;
    if (seen.has(e.id)) continue;
    seen.add(e.id);
    const line = e.geometry.map((g) => [g.lon, g.lat]);
    if (!byName.has(name)) byName.set(name, []);
    byName.get(name).push(line);
  }
  const features = [];
  for (const [name, lines] of byName) {
    const coords = lines
      .map((l) => simplify(l, 0.0006).map(([x, y]) => [round(x), round(y)]))
      .filter((l) => l.length >= 2 && touchesWorld(l));
    if (coords.length === 0) continue;
    features.push({
      type: "Feature",
      properties: { name },
      geometry: { type: "MultiLineString", coordinates: coords },
    });
  }
  return { type: "FeatureCollection", features };
}

/* ---------- waterlichamen (OSM-relaties: Hollands Diep, Nieuwe Merwede) ---------- */
const keyOf = (p) => `${p[0].toFixed(6)},${p[1].toFixed(6)}`;

/** Voegt losse ways samen tot gesloten ringen (op gedeelde eindpunten). */
function assembleRings(ways) {
  const rings = [];
  const pool = ways.map((w) => w.slice());
  while (pool.length) {
    let ring = pool.pop();
    let grew = true;
    while (grew && keyOf(ring[0]) !== keyOf(ring[ring.length - 1])) {
      grew = false;
      for (let i = 0; i < pool.length; i++) {
        const w = pool[i];
        const end = keyOf(ring[ring.length - 1]);
        if (keyOf(w[0]) === end) ring = ring.concat(w.slice(1));
        else if (keyOf(w[w.length - 1]) === end) ring = ring.concat(w.slice().reverse().slice(1));
        else continue;
        pool.splice(i, 1);
        grew = true;
        break;
      }
    }
    if (keyOf(ring[0]) === keyOf(ring[ring.length - 1]) && ring.length >= 4) rings.push(ring);
  }
  return rings;
}

function buildWaterBodies() {
  const rels = read("osm_water_relations.json").elements;
  const features = [];
  for (const rel of rels) {
    const line = (m) => m.geometry.map((g) => [g.lon, g.lat]);
    if (rel.tags.type === "multipolygon") {
      const outers = assembleRings(rel.members.filter((m) => m.type === "way" && m.role !== "inner").map(line));
      const inners = assembleRings(rel.members.filter((m) => m.type === "way" && m.role === "inner").map(line));
      const polys = [...outers, ...inners]
        .map((r) => simplifyRing(r, 0.0004))
        .filter(Boolean)
        .map((r) => [r]);
      if (polys.length) {
        features.push({
          type: "Feature",
          properties: { name: rel.tags.name },
          geometry: { type: "MultiPolygon", coordinates: polys },
        });
      }
    } else {
      const lines = rel.members
        .filter((m) => m.type === "way" && m.geometry)
        .map((m) => simplify(m.geometry.map((g) => [g.lon, g.lat]), 0.0006).map(([x, y]) => [round(x), round(y)]));
      features.push({
        type: "Feature",
        properties: { name: rel.tags.name },
        geometry: { type: "MultiLineString", coordinates: lines },
      });
    }
  }
  return { type: "FeatureCollection", features };
}

/* ---------- buurlanden ---------- */
function buildNeighbours() {
  const n = read("ne_neighbours.geojson");
  const features = n.features.flatMap((f) => {
    const polys = polygonsOf(f.geometry)
      .map((poly) => poly[0])
      .filter(touchesWorld)
      .map((r) => clipRing(simplify(r, 0.002), WORLD))
      .filter(Boolean)
      .map((r) => [r.map(([x, y]) => [round(x), round(y)])]);
    return polys.length
      ? [{ type: "Feature", properties: { name: f.properties.name }, geometry: { type: "MultiPolygon", coordinates: polys } }]
      : [];
  });
  return { type: "FeatureCollection", features };
}

function write(file, data) {
  fs.mkdirSync(path.dirname(out(file)), { recursive: true });
  fs.writeFileSync(out(file), JSON.stringify(data));
  console.log(file, (fs.statSync(out(file)).size / 1024).toFixed(1), "KB");
}

write("provinces-detail.geo.json", buildProvinces(0.0006, true));
write("provinces-overview.geo.json", buildProvinces(0.01, false));
write("rivers.geo.json", buildRivers());
write("waterbodies.geo.json", buildWaterBodies());
write("neighbours.geo.json", buildNeighbours());
