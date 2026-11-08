/**
 * Kaartgegevens — echte geografische coördinaten (WGS84, graden).
 * Het stadscentrum/station is gebruikt; ter controle vergeleken met de PDOK-
 * woonplaatscentroïden (binnen enkele km). Geen weergavecode in dit bestand.
 *
 * `id` komt overeen met de locatie-id's in src/content/locations.ts.
 * `role: "optional"` = zichtbaar op de kaart, maar niet op de hoofdroute.
 */
export interface City {
  id: string;
  name: string;
  lat: number;
  lon: number;
  role: "route" | "optional";
  /** Waar het label staat t.o.v. de stip. */
  labelSide: "left" | "right" | "above" | "below";
}

export const cities: readonly City[] = [
  { id: "tilburg", name: "Tilburg", lat: 51.5606, lon: 5.0835, role: "route", labelSide: "right" },
  { id: "oosterhout", name: "Oosterhout", lat: 51.6453, lon: 4.859, role: "route", labelSide: "below" },
  { id: "moerdijk", name: "Moerdijk", lat: 51.7003, lon: 4.5911, role: "route", labelSide: "below" },
  { id: "dordrecht", name: "Dordrecht", lat: 51.807, lon: 4.6677, role: "route", labelSide: "right" },
  { id: "rotterdam", name: "Rotterdam", lat: 51.9244, lon: 4.4694, role: "route", labelSide: "right" },
  { id: "delft", name: "Delft", lat: 52.0067, lon: 4.3563, role: "route", labelSide: "left" },
  { id: "leiden", name: "Leiden", lat: 52.1664, lon: 4.4814, role: "optional", labelSide: "right" },
];

/** Volgorde van de hoofdroute (lineair naar Delft). */
export const ROUTE_IDS = ["tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam", "delft"] as const;

/** Leiden is een zijtak vanaf Rotterdam (alleen visueel, geen spelregel). */
export const OPTIONAL_LINKS: readonly [string, string][] = [["rotterdam", "leiden"]];

export interface PointLabel {
  text: string;
  lat: number;
  lon: number;
  kind: "water" | "sea";
}

/** Kaartlabels voor water (posities op echte locaties). */
export const waterLabels: readonly PointLabel[] = [
  { text: "Noordzee", lat: 52.02, lon: 3.85, kind: "sea" },
  { text: "Hollands Diep", lat: 51.725, lon: 4.47, kind: "water" },
  { text: "Haringvliet", lat: 51.815, lon: 4.17, kind: "water" },
  { text: "Nieuwe Maas", lat: 51.907, lon: 4.38, kind: "water" },
  { text: "Oude Maas", lat: 51.832, lon: 4.40, kind: "water" },
];

/** De Moerdijkbrug over het Hollands Diep. */
export const moerdijkBridge = { lat: 51.7025, lon: 4.5878 };
