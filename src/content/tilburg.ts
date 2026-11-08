/**
 * PERSOONLIJKE CONTENT — Tilburg: "Pak je koffers!".
 * Voorwerpen, juiste/verkeerde keuzes, plek in de kamer en alle teksten.
 *
 * Plaatsing: `x`/`y` zijn kamercoördinaten (de kamer is 1600 × 900). (x, y) is het
 * punt waar het voorwerp ONDERAAN, in het midden staat/ligt — dus op het oppervlak
 * van het meubel (`place`). Verplaats een voorwerp door alleen x/y aan te passen.
 * De tekening zelf staat bij `art` in src/components/scenes/tilburg/itemArt.tsx.
 *
 * Er moeten precies 7 voorwerpen met `correct: true` zijn (de test controleert dit).
 */
import type { DialogueLine } from "./dialogue";

export type ArtId =
  | "sieraden" | "foto-job" | "studentenpas" | "ov-kaart" | "haarshampoo" | "boek" | "pepernoten"
  | "airfryer" | "baksteen" | "gourmetstel" | "fietspomp" | "kaaswiel" | "knuffel" | "stoomboot";

export type ItemCategory = "persoonlijk" | "reizen" | "verzorging" | "eten" | "absurd";

/** Kleine eigen reactie bij hover/klik; standaard is "pop". */
export type ObjectMotion = "pop" | "wiggle" | "tilt";

export interface RoomItem {
  id: string;
  label: string;
  correct: boolean;
  art: ArtId;
  category: ItemCategory;
  /** Waar in de kamer het voorwerp ligt (alleen ter documentatie/onderhoud). */
  place: string;
  /** Kamercoördinaten (1600 × 900), onderaan-midden van het voorwerp. */
  x: number;
  y: number;
  /** Schaal van de tekening (standaard 1). */
  scale?: number;
  /** Tekenvolgorde: hoger ligt voor lager. */
  layer: number;
  /** Optionele animatie bij hover/klik. */
  motion?: ObjectMotion;
  /** Grappige reacties van Sinterklaas bij een verkeerd voorwerp (wisselen bij herhaling). */
  reactions?: string[];
}

export const packingItems: readonly RoomItem[] = [
  // --- de zeven juiste voorwerpen ---
  { id: "sieraden", label: "Veel sieraden", correct: true, art: "sieraden", category: "persoonlijk", place: "kaptafel", x: 835, y: 512, scale: 1.2, layer: 3, motion: "wiggle" },
  { id: "foto-job", label: "Foto van Job", correct: true, art: "foto-job", category: "persoonlijk", place: "nachtkastje", x: 672, y: 482, scale: 1.2, layer: 3, motion: "tilt" },
  { id: "studentenpas", label: "Studentenpas", correct: true, art: "studentenpas", category: "reizen", place: "bureau", x: 1208, y: 522, scale: 1.12, layer: 3 },
  { id: "ov-kaart", label: "OV-kaart", correct: true, art: "ov-kaart", category: "reizen", place: "bureau", x: 1276, y: 522, scale: 1.12, layer: 3, motion: "tilt" },
  { id: "haarshampoo", label: "Rode haarshampoo", correct: true, art: "haarshampoo", category: "verzorging", place: "wandplank", x: 190, y: 252, scale: 1.25, layer: 3 },
  { id: "boek", label: "Boek over communicatie", correct: true, art: "boek", category: "persoonlijk", place: "bureau", x: 1085, y: 522, scale: 1.2, layer: 3 },
  { id: "pepernoten", label: "Pepernoten-noodvoorraad", correct: true, art: "pepernoten", category: "eten", place: "bed", x: 370, y: 462, scale: 1.2, layer: 3, motion: "wiggle" },

  // --- verkeerde voorwerpen ---
  {
    id: "airfryer", label: "Airfryer", correct: false, art: "airfryer", category: "absurd", place: "bovenop de kast", x: 1455, y: 142, scale: 1.05, layer: 3,
    reactions: [
      "Een airfryer! Ho ho ho. Job heeft vast al frituur genoeg in zijn leven. Nee.",
      "Nog steeds een airfryer. Ik waardeer je vertrouwen in knapperige friet, maar nee.",
    ],
  },
  {
    id: "baksteen", label: "Baksteen", correct: false, art: "baksteen", category: "absurd", place: "vloer", x: 330, y: 852, scale: 1.2, layer: 4,
    reactions: [
      "Een baksteen? Wil je Job imponeren of bekogelen? Leg maar terug.",
      "Bakstenen zijn voor de Moerdijkbrug, niet voor in je koffer.",
    ],
  },
  {
    id: "gourmetstel", label: "Gourmetstel", correct: false, art: "gourmetstel", category: "absurd", place: "vloer", x: 1015, y: 862, scale: 1.1, layer: 4,
    reactions: [
      "Gourmetten in de trein? De conducteur zou het niet waarderen. Ik trouwens ook niet.",
      "Het gourmetstel blijft hier, Minou. Dat is voor een andere avond.",
    ],
  },
  {
    id: "fietspomp", label: "Fietspomp", correct: false, art: "fietspomp", category: "absurd", place: "vloer, tegen de kast", x: 1225, y: 840, scale: 1.1, layer: 4, motion: "tilt",
    reactions: [
      "Een fietspomp! Mijn paard Amerigo heeft banden nodig, maar jij niet.",
      "Je gaat met de trein, Minou. De trein heeft geen banden. Meestal.",
    ],
  },
  {
    id: "kaaswiel", label: "Gigantisch kaaswiel", correct: false, art: "kaaswiel", category: "absurd", place: "vloerkleed", x: 760, y: 818, scale: 1.1, layer: 4,
    reactions: [
      "Een kaaswiel van tien kilo! Dat is dapper, maar je tas is geen kaaswinkel.",
      "Nee, nee, nee. Hoe lekker het ook ruikt: het kaaswiel blijft thuis.",
    ],
  },
  {
    id: "knuffel", label: "Knuffel", correct: false, art: "knuffel", category: "persoonlijk", place: "kussen op het bed", x: 125, y: 452, scale: 1.2, layer: 3, motion: "wiggle",
    reactions: [
      "Aaah, een knuffel. Schattig, maar Job is de enige knuffel die je vanavond nodig hebt.",
      "De knuffel mag blijven oppassen op je kamer. Hij is erg betrouwbaar.",
    ],
  },
  {
    id: "stoomboot", label: "Miniatuurstoomboot", correct: false, art: "stoomboot", category: "absurd", place: "wandplank", x: 385, y: 252, scale: 1.1, layer: 3,
    reactions: [
      "Een miniatuurstoomboot! Prachtig, maar de rivieren heb ik vanavond zelf al dichtgetimmerd.",
      "Zelfs voor Delft heb je geen stoomboot nodig. Terug op de plank ermee.",
    ],
  },
];

export const tilburgTexts = {
  sceneTitle: "Pak je koffers!",
  bagTitle: "Reistas",
  bagCount: (n: number, total: number) => `${n} / ${total}`,
  bagClosed: "Tas dicht!",
  prompt: "Klik op de spullen die mee moeten.",

  intro: [
    {
      speaker: "sinterklaas",
      text: "Ho ho ho! Welkom in je slaapkamer, Minou! Het is Sinterklaasavond en ik heb alle wegen veranderd in één grote escape room. Dat was nogal een klus, maar een Sint moet toch iets te doen hebben.",
    },
    {
      speaker: "minou",
      text: "Sint! Ik wil alleen maar naar Job in Delft. Wat moet ik doen?",
    },
    {
      speaker: "sinterklaas",
      text: "Pak je tas in, kind. Zeven spullen die je écht nodig hebt voor deze reis. Je weet zelf wel welke. Geen haast, mijn paard Amerigo staat toch nog te eten.",
    },
  ] satisfies DialogueLine[],

  /** Reacties als een verkeerd voorwerp nog geen eigen reactie heeft. */
  genericWrong: [
    "Hmm, dat lijkt me niet echt nodig, Minou. Probeer het nog eens.",
    "Ho ho ho, creatief! Maar nee.",
  ],

  outro: [
    {
      speaker: "sinterklaas",
      text: "Zeven spullen, en geen kaaswiel! Indrukwekkend, Minou. Zelfs Amerigo is onder de indruk.",
    },
    {
      speaker: "sinterklaas",
      text: "Je tas is dicht en de eerste deur staat open. Op naar Oosterhout, daar wachten wat, eh, bekenden op je. Ho ho ho!",
    },
  ] satisfies DialogueLine[],
};
