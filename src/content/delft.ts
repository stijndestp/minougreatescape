/**
 * PERSOONLIJKE CONTENT — Delft: de grote finale.
 *
 * Alles wat je later wilt aanpassen staat hier: dialogen, foutmeldingen van het codeslot,
 * slotteksten, animatieduur, posities en geluiden. Regels: src/game/finale.ts.
 * Tekeningen van Minou, Job en Sinterklaas: src/components/scenes/delft/DelftCast.tsx
 * (vervang daar de tekeningen; de animaties blijven werken).
 * Achtergrond: src/components/scenes/delft/DelftScenery.tsx.
 *
 * DE JUISTE CODE STAAT HIER BEWUST ALLEEN ALS HASH. De aanwijzing zit alleen in het
 * fysieke rijm. Een andere code instellen:
 *   node -e "let s='1234',h=0x811c9dc5;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,0x01000193)>>>0}console.log(h>>>0)"
 * en het getal hieronder vervangen (de test in src/game/finale.test.ts noemt de verwachte code).
 */
import type { DialogueLine } from "./dialogue";

export const codeHash = 3480073191;

const sint = (text: string): DialogueLine => ({ speaker: "sinterklaas", text });

/** Duur van de vaste tijdlijn van de hereniging, in milliseconden (totaal ongeveer 24 seconden). */
export const timeline = {
  gate: 4200,
  run: 4800,
  hug: 6000,
  escalate: 8800,
};

/** Posities in de scène (1600 × 900): Minou/Job/Sinterklaas staan met hun voeten op (x, y). */
export const stage = {
  minouStart: { x: 300, y: 650 },
  minouRun: { x: 1000, y: 650 },
  minouHug: { x: 1048, y: 650 },
  job: { x: 1180, y: 626 },
  jobHug: { x: 1150, y: 650 },
  sint: { x: 560, y: 628 },
  scale: 1.5,
};

/** Aantal effecten per fase. Vast en eindig: er ontstaan nooit extra hartjes buiten deze aantallen. */
export const effects = { gateHearts: 18, hugHearts: 14, escalateHearts: 46, sparkles: 18, cupids: 4, endHearts: 22 };

/** Geluiden per moment: naam van het geluid, of null om het uit te zetten. */
export const sounds = {
  unlock: "magic" as string | null,
  wrong: "wrong" as string | null,
  kiss: "kiss" as string | null,
  sparkle: "sparkle" as string | null,
  finale: "fanfare" as string | null,
  /** Romantische achtergrondmuziek tijdens de hereniging. */
  music: true,
};

/** Momenten (ms vanaf het begin van de fase) waarop een kusgeluidje klinkt. */
export const kissTimes = { hug: [900, 2300, 3700, 5100], escalate: [600, 2200, 3600, 5200, 6800] };
/** Momenten (ms vanaf het begin van de fase 'escalate') voor fonkelgeluidjes. */
export const sparkleTimes = [300, 1500, 2700, 4200, 5600, 7000];

export const delftTexts = {
  sceneTitle: "De grote finale",
  lockTitle: "De poort van de liefde",
  lockButton: "Ontgrendel de poort",
  lockFieldLabel: (n: number) => `Cijfer ${n}`,
  keypadDelete: "Wis het laatste cijfer",
  muteOn: "Geluid aan",
  muteOff: "Geluid uit",
  gateLabel: "De gesloten poort in Delft",

  intro: [
    sint("Zo Minou! Je hebt het dan toch gered. Van Tilburg tot Delft, wat heb jij allemaal moeten doorstaan!"),
    sint("Je hebt de schoonfamilie overleefd, een complete brug gerepareerd en zelfs de juiste trein weten te vinden. Dat laatste kan helaas niet iedereen in de familie zeggen..."),
    sint("Maar voordat jij eindelijk met Job kunt knuffelen, heeft de Sint nog iets bijzonders voor jou."),
    sint("Speciaal voor jou heb ik een prachtig rijm geschreven. En geloof me, daar heb ik behoorlijk mijn best op gedaan!"),
    sint("Dat rijm krijg je nu persoonlijk overhandigd. Lees het maar eens goed, want ergens in die woorden zit het geheim waarmee je deze poort kunt openen."),
    sint("Vier cijfers scheiden jou nog van de liefde van je leven. Succes, Minou!"),
  ] satisfies DialogueLine[],

  /** Bij een foute code (wisselt). Geven nooit een aanwijzing over de cijfers. */
  wrong: [
    "Ho, ho, ho! Dat is hem niet, Minou. Volgens mij moet je dat prachtige rijm van mij nog eens goed lezen!",
    "Hmm, de poort blijft dicht. Lees het rijm nog maar eens rustig door, Minou. Ik heb er niet voor niets uren aan gewerkt!",
    "Nee hoor, het slot vindt er niets van. Even diep ademhalen en het rijm nog eens lezen!",
  ],

  /** Sinterklaas reageert (niet-blokkerend bubbeltje) zodra de poort opengaat. */
  unlockedBubble: "Hoera! De poort is open! Ho ho ho!",

  /** Scène D: de grote romantische tekst. */
  foreverText: "MINOU + JOB = FOREVER",
  slowMotion: "slow motion…",

  /** Scène E: Sinterklaas grijpt in (verplichte dialoog). */
  outro: [
    sint("Nou, nou, nou! Het is inmiddels wel duidelijk dat jullie elkaar gemist hebben!"),
    sint("Bewaar ook nog een paar kusjes voor de rest van het jaar, hè? Zelfs ik word hier een beetje verlegen van!"),
  ] satisfies DialogueLine[],

  /** Eindscherm. */
  end: {
    title: "MINOU'S GREAT ESCAPE",
    subtitle: "MISSIE VOLTOOID!",
    tagline: "Liefde overwint alles. Zelfs de NS en de schoonfamilie.",
    backToMenu: "Terug naar hoofdmenu",
  },
};
