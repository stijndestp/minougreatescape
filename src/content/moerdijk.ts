/**
 * CONTENT — Moerdijk: "Bouw de Moerdijkbrug!".
 *
 * Alles wat je later wilt verbeteren staat hier, los van de spellogica
 * (src/game/bridge.ts) en de weergave (src/components/scenes/moerdijk/):
 *  - `bridgeShapes`   de SVG-vormen (één definitie voor onderdeel én opening)
 *  - `bridgeParts`    de acht brugdelen (5 juist, 3 afleiders)
 *  - `bridgeSlots`    de vijf openingen in de brug
 *  - `trayOrder`      volgorde van de delen op de oever
 *  - `moerdijkTexts`  dialogen en teksten
 *
 * Alle vormen liggen in een eigen vak rond (0, 0) in eenheden van de vaste
 * scène-viewBox (1600 × 900) en worden alleen uniform geschaald.
 * Gebruik ALLEEN absolute padcommando's M L H V Q Z (de test leest ze uit).
 */
import type { DialogueLine } from "./dialogue";

export interface BridgeShape {
  id: string;
  /** SVG-pad rond (0, 0), alleen M L H V Q Z. */
  d: string;
}

/** Eén definitie per vorm: het onderdeel en zijn opening gebruiken exact dit pad. */
export const bridgeShapes: readonly BridgeShape[] = [
  // --- de vijf juiste vormen ---
  { id: "boog", d: "M-60 30 L-60 10 Q-30 -40 0 -40 Q30 -40 60 10 L60 30 L30 30 L30 18 Q15 -6 0 -6 Q-15 -6 -30 18 L-30 30 Z" },
  { id: "pyloon", d: "M-18 -55 H18 V-30 H34 V-14 H18 V55 H-18 V-14 H-34 V-30 H-18 Z" },
  { id: "vakwerk", d: "M-60 30 L-60 -10 L-30 -40 L30 -40 L60 -10 L60 30 L40 30 L0 -10 L-40 30 Z" },
  { id: "dek", d: "M-60 -8 H-44 V-14 H44 V-8 H60 V10 H34 V16 H-34 V10 H-60 Z" },
  { id: "pijler", d: "M-56 -40 H56 V-16 H24 V40 H-24 V-16 H-56 Z" },
  // --- drie afleiders: lijken op echte delen, passen nergens ---
  { id: "boog-plat", d: "M-60 30 L-60 14 Q-48 -34 -20 -36 H20 Q48 -34 60 14 L60 30 L36 30 L36 20 Q24 -8 0 -8 Q-24 -8 -36 20 L-36 30 Z" },
  { id: "pyloon-scheef", d: "M-18 -55 H18 V-30 H34 V-14 H18 V55 H-18 V10 H-34 V-6 H-18 Z" },
  { id: "dek-breed", d: "M-60 -8 H-36 V-14 H36 V-8 H60 V10 H44 V16 H-44 V10 H-60 Z" },
];

export interface BridgePartDef {
  id: string;
  shapeId: string;
  /** Slot waar dit onderdeel in past; leeg bij een afleider. */
  correctSlot?: string;
}

export interface BridgeSlotDef {
  id: string;
  /** Het ene onderdeel dat hier past. */
  requires: string;
  /** Vorm van de opening (= vorm van het vereiste onderdeel). */
  shapeId: string;
  /** Plek in de scène (1600 × 900) en schaal van het silhouet. */
  x: number;
  y: number;
  scale: number;
}

export const bridgeParts: readonly BridgePartDef[] = [
  { id: "p-dek-breed", shapeId: "dek-breed" },
  { id: "p-pijler", shapeId: "pijler", correctSlot: "s-pijler" },
  { id: "p-boog", shapeId: "boog", correctSlot: "s-boog" },
  { id: "p-pyloon-scheef", shapeId: "pyloon-scheef" },
  { id: "p-vakwerk", shapeId: "vakwerk", correctSlot: "s-vakwerk" },
  { id: "p-boog-plat", shapeId: "boog-plat" },
  { id: "p-dek", shapeId: "dek", correctSlot: "s-dek" },
  { id: "p-pyloon", shapeId: "pyloon", correctSlot: "s-pyloon" },
];

/** De vijf openingen, verdeeld over de brug. */
export const bridgeSlots: readonly BridgeSlotDef[] = [
  { id: "s-pyloon", requires: "p-pyloon", shapeId: "pyloon", x: 480, y: 336, scale: 1.5 },
  { id: "s-boog", requires: "p-boog", shapeId: "boog", x: 800, y: 250, scale: 1.7 },
  { id: "s-vakwerk", requires: "p-vakwerk", shapeId: "vakwerk", x: 1110, y: 370, scale: 1.6 },
  { id: "s-dek", requires: "p-dek", shapeId: "dek", x: 800, y: 438, scale: 1.7 },
  { id: "s-pijler", requires: "p-pijler", shapeId: "pijler", x: 800, y: 524, scale: 1.5 },
];

/** Positie en schaal van de onderdelen op de oever (2 rijen van 4), op volgorde van `bridgeParts`. */
export const trayLayout = {
  scale: 1.05,
  cells: [
    { x: 140, y: 730 }, { x: 330, y: 730 }, { x: 520, y: 730 }, { x: 710, y: 730 },
    { x: 140, y: 840 }, { x: 330, y: 840 }, { x: 520, y: 840 }, { x: 710, y: 840 },
  ],
} as const;

/** Waar Minou staat en hoe ver ze oversteekt (kamercoördinaten). */
export const crossing = { startX: 235, endX: 1385, y: 418, scale: 1.15 };

export const moerdijkTexts = {
  sceneTitle: "Bouw de Moerdijkbrug!",
  bridgeDone: "De brug is af!",
  /** Aria-label voor een brugdeel (verraadt niets over de plek). */
  partLabel: (n: number) => `Brugdeel ${n}`,
  slotLabel: (n: number) => `Opening ${n}`,

  intro: [
    {
      speaker: "sinterklaas",
      text: "Ach Minou, wat vervelend nou. De brug is kapot! De Pieten zouden alleen wat onderhoud doen, maar blijkbaar hebben ze de handleiding niet helemaal begrepen.",
    },
    {
      speaker: "sinterklaas",
      text: "Gelukkig liggen de onderdelen er nog. Succes met puzzelen! Ik hoop dat je een beetje technisch inzicht hebt, want zwemmen naar Dordrecht lijkt me behoorlijk fris.",
    },
  ] satisfies DialogueLine[],

  /** Grappige opmerkingen bij een verkeerde plaatsing; verraden niet waar het deel wél past. */
  wrong: [
    "Ho ho ho, dat klikt niet, Minou. Zelfs mijn Pieten zagen dat aankomen.",
    "Hmm, nee. Dat zit er net niet in. Probeer het nog maar eens.",
    "Dat is niet de bedoeling, hoor. Maar goed, zo leer je het.",
    "Auw! Dat paste voor geen meter. Mijn paard Amerigo had het beter gedaan.",
  ],

  outro: [
    {
      speaker: "sinterklaas",
      text: "Wat een prachtige brug! Technisch inzicht heb je dus wel, Minou. De Pieten krijgen straks extra les. Vooruit, op naar Dordrecht!",
    },
    {
      speaker: "minou",
      text: "Dankjewel, Sint. Nu snel verder, Job wacht op me!",
    },
  ] satisfies DialogueLine[],
};
