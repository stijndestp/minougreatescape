/**
 * PERSOONLIJKE CONTENT — locaties op de route.
 * De volgorde van deze lijst is de volgorde van de reis.
 * De geografische positie staat in src/map/cities.ts (zelfde `id`).
 * `image` wijst naar een illustratie in /public (nu nog placeholders).
 */
export interface LocationContent {
  id: string;
  name: string;
  /** Titel van de minigame of scène op deze locatie. */
  sceneTitle: string;
  description: string;
  /** Pad naar de scène-illustratie in /public. */
  image: string;
}

export const locations: readonly LocationContent[] = [
  {
    id: "tilburg",
    name: "Tilburg",
    sceneTitle: "Pak je koffers!",
    description: "Kies 7 juiste spullen uit een hoop grappige voorwerpen.",
    image: "/placeholders/tilburg.svg",
  },
  {
    id: "oosterhout",
    name: "Oosterhout",
    sceneTitle: "Overleef de schoonfamilie!",
    description: "Een familie-etentje met 5 meerkeuzevragen.",
    image: "/placeholders/oosterhout.svg",
  },
  {
    id: "moerdijk",
    name: "Moerdijk",
    sceneTitle: "Bouw de Moerdijkbrug!",
    description: "Plaats 5 brugdelen in de juiste openingen.",
    image: "/placeholders/moerdijk.svg",
  },
  {
    id: "dordrecht",
    name: "Dordrecht",
    sceneTitle: "Grenscontrole",
    description: "Een korte, grappige dialoog met een Piet.",
    image: "/placeholders/dordrecht.svg",
  },
  {
    id: "rotterdam",
    name: "Rotterdam",
    sceneTitle: "De verkeerde trein",
    description: "Een logische puzzel met drie treinen, perrons en aanwijzingen.",
    image: "/placeholders/rotterdam.svg",
  },
  {
    id: "delft",
    name: "Delft",
    sceneTitle: "De finale",
    description: "Sinterklaas heeft een rijm geschreven. En daar is een codeslot.",
    image: "/placeholders/delft.svg",
  },
];

