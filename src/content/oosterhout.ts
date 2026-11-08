/**
 * PERSOONLIJKE CONTENT — Oosterhout: "Overleef de schoonfamilie!".
 *
 * Aan tafel zit de echte schoonfamilie: Ingeborgh, Ivo, Stijn, Nadia, Eline en Wouter.
 * Iedereen is getekend naar een foto (een foto zelf staat niet in het spel). De vragen zijn de definitieve, persoonlijke vragen (ik-vorm: het familielid vraagt het zelf aan Minou).
 *
 *  - `familyMembers`: wie aan tafel zit (naam, rol, plek, foto of getekend uiterlijk).
 *  - `quiz`: de vijf vragen in volgorde; `askedBy` verwijst naar een familielid
 *    (één familielid mag meerdere vragen stellen).
 * De spellogica (src/game/dinner.ts) verandert daarbij niet.
 * Er zijn zes vragen, één per persoon aan tafel. Er zijn altijd drie antwoorden per vraag; `correctIndex` is 0, 1 of 2.
 */
import type { DialogueLine } from "./dialogue";

export type Mood = "neutral" | "talking" | "happy" | "shocked" | "disapproving";
export type HairStyle = "short" | "bun" | "curly" | "bald" | "long" | "spiky" | "receding";

/** Foto van een persoon: het hoofd wordt uit `crop` (in pixels van het bronbestand) geknipt. */
export interface PersonPhoto {
  src: string;
  /** Afmetingen van het bronbestand in pixels. */
  size: { w: number; h: number };
  /** Vierkante uitsnede rond het hoofd, in pixels van het bronbestand. */
  crop: { x: number; y: number; w: number; h: number };
}

export interface PersonLook {
  skin: string;
  hair: string;
  hairStyle: HairStyle;
  shirt: string;
  glasses?: boolean;
  moustache?: boolean;
  beard?: boolean;
  earrings?: boolean;
  /** Lichte baardstoppels. */
  stubble?: boolean;
  /** Brede lach met tanden (in rust). */
  teeth?: boolean;
  /** Kleur van de bril (standaard donker); `glassesThin` = dun montuur. */
  glassesColor?: string;
  glassesThin?: boolean;
  /** Oogkleur (standaard donker). */
  eyeColor?: string;
  /** Scheiding in het midden bij lang haar. */
  parting?: boolean;
  /** Tweede kledinglaag: kleur van het shirt dat onder jas/overhemd zichtbaar is. */
  undershirt?: string;
  /** Overhemd met open kraag. */
  openCollar?: boolean;
  /** Echte foto: vervangt het getekende hoofd (de romp blijft cartoon). */
  photo?: PersonPhoto;
}

export interface FamilyMember {
  id: string;
  name: string;
  /** Rol t.o.v. Minou, getoond in het dialoogvenster. */
  role: string;
  /** Plek aan tafel in kamercoördinaten (1600 × 900): midden van het lijf, bij de tafelrand. */
  seat: { x: number; y: number; scale?: number };
  look: PersonLook;
}

export interface QuizQuestion {
  id: string;
  /** Id van het familielid dat de vraag stelt. */
  askedBy: string;
  /** Naam van de gang die bij deze vraag hoort. */
  course: string;
  text: string;
  /** Altijd precies drie antwoorden. */
  answers: readonly [string, string, string];
  correctIndex: 0 | 1 | 2;
  /** Reactie bij een goed antwoord. */
  onCorrect: string;
  /** Reacties bij een fout antwoord (wisselen bij herhaling). */
  onWrong: readonly string[];
  /** Gezichtsuitdrukking (badge bij foto's) bij een fout antwoord. */
  wrongMood: Extract<Mood, "shocked" | "disapproving">;
}

export const familyMembers: readonly FamilyMember[] = [
  {
    id: "ingeborgh", name: "Ingeborgh", role: "schoonmoeder",
    seat: { x: 220, y: 482, scale: 0.95 },
    look: {
      // Getekend naar de foto: halflang golvend blond haar, lichte lach, oranje jurk met patroon.
      skin: "#ffd9b8", hair: "#e6c783", hairStyle: "long", parting: true,
      shirt: "#d98a58", earrings: true, teeth: true,
    },
  },
  {
    id: "ivo", name: "Ivo", role: "schoonvader",
    seat: { x: 430, y: 482, scale: 0.95 },
    look: {
      // Getekend naar de foto: kort grijs haar, ronde donkere bril, brede lach, taupe colbert op wit overhemd.
      skin: "#f2c9a0", hair: "#9a9aa2", hairStyle: "short",
      shirt: "#8a7a66", undershirt: "#ffffff",
      glasses: true, glassesColor: "#2b1b3d", teeth: true,
    },
  },
  {
    id: "stijn", name: "Stijn", role: "broer van Job",
    seat: { x: 640, y: 482, scale: 0.95 },
    look: {
      // Getekend naar de foto: kort donkerbruin haar, ronde donkere bril, brede lach, lichtgrijs colbert op wit overhemd.
      skin: "#ffd9b8", hair: "#3a2a1c", hairStyle: "short",
      shirt: "#b9c9cf", undershirt: "#ffffff",
      glasses: true, glassesColor: "#3a3340", teeth: true,
    },
  },
  {
    id: "nadia", name: "Nadia", role: "vrouw van Stijn",
    seat: { x: 850, y: 482, scale: 0.95 },
    // Getekend naar de foto: lang steil donkerblond haar met middenscheiding, dunne ronde bril,
    // lichte ogen, brede lach, roze corduroy jasje over een donker shirt.
    look: {
      skin: "#f7cfb5", hair: "#b98a58", hairStyle: "long", parting: true,
      shirt: "#f0a7b8", undershirt: "#3a3a46",
      glasses: true, glassesThin: true, glassesColor: "#c98a7a", eyeColor: "#7fb3d6", teeth: true,
    },
  },  {
    id: "eline", name: "Eline", role: "zus van Job",
    seat: { x: 1060, y: 482, scale: 0.95 },
    look: {
      // Getekend naar de foto: lang golvend lichtbruin haar, gouden oorringen, brede lach, bordeaux colbert op wit shirt.
      skin: "#ffd9b8", hair: "#c49a62", hairStyle: "long", parting: true,
      shirt: "#7a1f3d", undershirt: "#ffffff", earrings: true, teeth: true,
    },
  },
  {
    id: "wouter", name: "Wouter", role: "vriend van Eline",
    seat: { x: 1270, y: 482, scale: 0.95 },
    // Getekend naar de foto: kortgekruld donkerbruin haar met hoge haarlijn, ronde donkere bril,
    // lichte baardstoppels, brede lach, beige linnen overhemd met open kraag.
    look: {
      skin: "#f6d0b4", hair: "#4a3526", hairStyle: "receding",
      shirt: "#d8cdb9", openCollar: true,
      glasses: true, glassesColor: "#3a2a20", stubble: true, teeth: true,
    },
  },];

export const quiz: readonly QuizQuestion[] = [
  {
    id: "q1", askedBy: "ivo", course: "Voorgerecht",
    text: "Minou, stel dat ik één dag volledig onzichtbaar zou zijn. Wat denk jij dat ik dan het allerliefste zou doen?",
    answers: [
      "Stiekem een dag met iedereen uit de familie meelopen.",
      "Zonder kaartje naar een tropisch eiland vliegen.",
      "Onzichtbaar alle vleeskroketten uit de snackbar opeten.",
    ],
    correctIndex: 0,
    onCorrect: "Haha, precies! Ik wil gewoon overal een beetje bij zijn. Hier, het voorgerecht!",
    onWrong: ["Nee Minou, je kent me blijkbaar toch minder goed dan ik dacht!"],
    wrongMood: "disapproving",
  },
  {
    id: "q2", askedBy: "ingeborgh", course: "Soep",
    text: "Minou, ik hou natuurlijk ontzettend veel van Ivo. Maar zelfs ik erger me weleens aan hem. Waar kan ik me nou écht aan irriteren?",
    answers: [
      "Dat hij overal zijn sokken laat slingeren.",
      "Dat hij de auto niet op slot doet.",
      "Dat hij altijd de laatste chips opeet.",
    ],
    correctIndex: 1,
    onCorrect: "Ja, lieverd! Dat ding staat altijd open. Hier, een kop soep om bij te komen.",
    onWrong: ["Nee Minou! Maar als die auto straks verdwenen is, weet ik in ieder geval wie ik de schuld kan geven."],
    wrongMood: "shocked",
  },
  {
    id: "q3", askedBy: "stijn", course: "Tussengerecht",
    text: "Minou, even een belangrijke vraag. Nadia, Eline en Ingeborgh zijn het over één ding helemaal eens: wie de grappigste van deze familie is. Wie denk jij dat ze hebben gekozen?",
    answers: [
      "Ivo, vanwege zijn droge opmerkingen.",
      "Stijn, de onbetwiste familiekomiek.",
      "Eline, vanwege haar fantastische reisverhalen.",
    ],
    correctIndex: 1,
    onCorrect: "Dank je, Minou! Eindelijk iemand die de waarheid durft te zeggen. Het tussengerecht komt eraan!",
    onWrong: ["Pardon?! Minou, drie stemmen vóór mij. Dat is geen mening meer, dat is wetenschappelijk bewezen!"],
    wrongMood: "shocked",
  },
  {
    id: "q4", askedBy: "nadia", course: "Hoofdgerecht",
    text: "Minou, stel dat ik net een compleet zesgangendiner achter de kiezen heb. Voor welke snack maak ik dan alsnog zonder twijfel ruimte?",
    answers: ["Zwarte Doritos.", "Custardcakejes.", "Een goede vleeskroket."],
    correctIndex: 0,
    onCorrect: "Zwarte Doritos, altijd! Je kent me toch best goed. Hier, het hoofdgerecht!",
    onWrong: ["Minou, ik begin me toch echt af te vragen of je mij wel een beetje kent!"],
    wrongMood: "disapproving",
  },
  {
    id: "q5", askedBy: "wouter", course: "Dessert",
    text: "Minou, ik had vroeger een favoriete knuffel. En het bijzondere is: dat dier is nog steeds mijn absolute lievelingsdier. Welk dier is dat?",
    answers: ["Een pinguïn.", "Een hond.", "Een panda."],
    correctIndex: 2,
    onCorrect: "Een panda, ja! Jij kent me beter dan ik dacht. Dan nu het toetje!",
    onWrong: ["Minou, dit valt me tegen. Ik dacht dat jij mijn dierenliefde inmiddels wel kende!"],
    wrongMood: "disapproving",
  },
  {
    id: "q6", askedBy: "eline", course: "Koffie en afsluiting",
    text: "Minou, ik hou natuurlijk heel veel van Wouter, maar er is één ding aan tafel waar ik écht niet tegen kan. Wat doet hij waardoor ik me iedere keer weer zit op te vreten?",
    answers: [
      "De manier waarop hij zijn vork vasthoudt.",
      "Dat hij altijd met zijn mond open kauwt.",
      "Dat hij overal eiwitshakes laat staan.",
    ],
    correctIndex: 0,
    onCorrect: "Die vork, ja! Eindelijk begrijpt iemand mijn lijden. Tijd voor koffie, en de tafel kan nog wel wat meer hebben!",
    onWrong: ["Nee Minou! Let de volgende keer maar eens goed op hoe Wouter eet. Dan snap je me vanzelf!"],
    wrongMood: "shocked",
  },
];/** Minou zelf, aan het hoofd van de tafel (kijkt naar links). */
export const minouSeat = {
  seat: { x: 1475, y: 500 },
  look: { skin: "#ffd9b8", hair: "#d6401f", hairStyle: "long", shirt: "#7b2cbf", earrings: true } satisfies PersonLook,
};

export const oosterhoutTexts = {
  sceneTitle: "Overleef de schoonfamilie!",
  chooseLabel: "Kies je antwoord",
  answerLetters: ["A", "B", "C"] as const,
  progress: (done: number, total: number, course?: string) =>`Gang ${Math.min(done + 1, total)} van ${total}${course ? ` · ${course}` : ""}`,
  successBurst: "✓",
  finale: "Schoonfamilie overleefd!",

  intro: [
    {
      speaker: "sinterklaas",
      text: "Zo, zo, Minou! Je dacht toch niet dat je zomaar langs de schoonfamilie kon glippen? De tafel is al gedekt! Eerst maar eens kijken hoe goed jij deze familie eigenlijk kent.",
    },
    {
      speaker: "minou",
      text: "Maar Sint, ik moet echt verder naar Job in Delft...",
    },
    {
      speaker: "sinterklaas",
      text: "Zes vragen, Minou. Zes goede antwoorden. Daarna mag je vertrekken. Ga maar lekker zitten, de soep wordt koud.",
    },
  ] satisfies DialogueLine[],

  outro: [
    {
      speaker: "sinterklaas",
      text: "Nou, nou, Minou! Je hebt het voor elkaar. Zes gangen, zes familieleden en waarschijnlijk ook zes redenen om voorlopig niet meer bij de schoonfamilie te komen eten!",
    },
    {
      speaker: "sinterklaas",
      text: "Maar vooruit, je hebt bewezen dat je deze familie aankunt. Tijd om je reis naar Job voort te zetten.",
    },
    {
      speaker: "sinterklaas",
      text: "Al zou ik nog maar niet te vroeg juichen. Bij Moerdijk wacht je namelijk een wel héél bijzondere verrassing...",
    },
  ] satisfies DialogueLine[],
};

/**
 * Wat er op tafel staat. `course: 0` = gedekte tafel bij aanvang; `course: n`
 * verschijnt na het n-de goede antwoord. (x, y) = onderaan-midden van het
 * voorwerp op het tafelblad (tafelblad: y 470–585). `art` zie dishArt.tsx.
 */
export type DishArt =
  | "plate" | "glass" | "bread" | "candles" | "vase"
  | "soup" | "salad" | "jug" | "stamppot" | "sausage"
  | "potatoes" | "sauce" | "veg" | "cake" | "fruit" | "pepernoten" | "cheese" | "roast";

export interface TableItem {
  id: string;
  art: DishArt;
  course: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  x: number;
  y: number;
  scale?: number;
}

export const tableItems: readonly TableItem[] = [
  // gedekte tafel
  ...[220, 430, 640, 850, 1060, 1270].map((x, i) => ({ id: `plate-${i}`, art: "plate" as const, course: 0 as const, x, y: 520 })),
  { id: "plate-minou", art: "plate", course: 0, x: 1400, y: 548 },
  ...[282, 492, 702, 912, 1122, 1332].map((x, i) => ({ id: `glass-${i}`, art: "glass" as const, course: 0 as const, x, y: 506 })),
  { id: "glass-minou", art: "glass", course: 0, x: 1455, y: 540 },
  { id: "candles", art: "candles", course: 0, x: 745, y: 508 },
  { id: "vase", art: "vase", course: 0, x: 325, y: 515 },
  { id: "bread", art: "bread", course: 0, x: 665, y: 552 },
  // gang 1: voorgerecht (salade)
  { id: "soup", art: "soup", course: 2, x: 545, y: 560, scale: 1.1 },
  // gang 2: salade en water
  { id: "salad", art: "salad", course: 1, x: 1105, y: 560 },
  { id: "jug", art: "jug", course: 1, x: 748, y: 550 },
  // gang 3: stamppot met rookworst
  { id: "stamppot", art: "stamppot", course: 3, x: 290, y: 566, scale: 1.1 },
  { id: "sausage", art: "sausage", course: 3, x: 990, y: 568 },
  // gang 4: aardappels, groente, jus
  { id: "potatoes", art: "potatoes", course: 4, x: 1260, y: 566 },
  { id: "veg", art: "veg", course: 4, x: 535, y: 512, scale: 0.9 },
  { id: "sauce", art: "sauce", course: 4, x: 1185, y: 552 },
  // gang 5: dessert
  { id: "roast", art: "roast", course: 4, x: 955, y: 516, scale: 0.9 },
  { id: "cheese", art: "cheese", course: 6, x: 1165, y: 512, scale: 0.95 },
  { id: "fruit", art: "fruit", course: 5, x: 410, y: 560 },
  // gang 6: koffie, en de tafel staat overdreven vol
  { id: "cake", art: "cake", course: 5, x: 850, y: 574, scale: 1.5 },
  { id: "pepernoten", art: "pepernoten", course: 5, x: 1330, y: 568 },
  { id: "bread2", art: "bread", course: 6, x: 1050, y: 560 },
  { id: "jug2", art: "jug", course: 6, x: 470, y: 566 },
  { id: "salad2", art: "salad", course: 6, x: 620, y: 566 },];
