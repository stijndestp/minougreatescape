# Bronnen kaartdata

Ruwe bronbestanden voor `scripts/build-map-data.mjs`.

| Bestand | Bron | Licentie |
|---|---|---|
| pdok_provincies.geojson | PDOK / CBS Gebiedsindelingen 2023, laag `provincie_gegeneraliseerd` (WFS, EPSG:4326) | CC BY 4.0 |
| osm_rivers_1.json, osm_rivers_2.json | OpenStreetMap via Overpass API (waterway=river/canal, geselecteerde rivieren) | ODbL, © OpenStreetMap-bijdragers |
| ne_neighbours.geojson | Natural Earth 10m admin-0 countries, alleen België en Duitsland | Public domain |

Steden: coördinaten van het stadscentrum/station staan in `src/map/cities.ts`.
Opnieuw genereren: `npm run build:map`.

osm_water_relations.json: OpenStreetMap (Overpass), relaties Hollands Diep (multipolygon) en Nieuwe Merwede. ODbL.
