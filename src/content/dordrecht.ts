/**
 * PERSOONLIJKE CONTENT — Dordrecht: "Grenscontrole" met Grenswacht-Piet.
 * Teksten, welke voorwerpen op de balie liggen en wat Piet bij elk voorwerp zegt.
 * Regels staan in src/game/border.ts, de tekening in src/components/scenes/dordrecht/.
 */
import type { DialogueLine } from "./dialogue";
import type { BorderRules } from "@/game/border";

export const pietName = "Grenswacht-Piet";

/** Het toegangsbewijs is de studentenpas uit Tilburg; de rest zijn voorwerpen uit dezelfde tas. */
export const borderRules: BorderRules = {
  requiredItemId: "studentenpas",
  offeredItemIds: ["sieraden", "foto-job", "studentenpas", "ov-kaart", "haarshampoo", "boek"],
};

const piet = (text: string, mood: DialogueLine["mood"] = "stern"): DialogueLine => ({
  speaker: "piet",
  name: pietName,
  text,
  mood,
});

export const dordrechtTexts = {
  sceneTitle: "Grenscontrole",
  choosePrompt: "Welk toegangsbewijs laat Minou zien?",
  chooseLabel: "Uit Minou's tas",

  /** Teksten op de borden langs de weg. */
  signLeft: "BRABANT",
  signLeftSub: "Zachte G toegestaan",
  signRight: "HOLLAND",
  signRightSub: "Zachte G? Aanmelden bij de balie",
  boothSign: "DOUANE",
  stamp: "GOEDGEKEURD",

  intro: [
    piet("Halt! Je bevindt je nu officieel boven de rivieren. Heb jij eigenlijk wel een geldig visum om Brabant te verlaten?"),
    { speaker: "minou", text: "Een visum? Ik wil gewoon naar Job in Delft!" },
    piet("Ja, dat zeggen ze allemaal. Heb je dan op zijn minst een geldig toegangsbewijs?"),
  ] satisfies DialogueLine[],

  approved: [
    piet("Een studentenpas? Nou vooruit dan. Maar probeer die zachte G een beetje thuis te laten!", "happy"),
  ] satisfies DialogueLine[],

  /** Pietenreacties per verkeerd voorwerp (wisselen bij herhaling). */
  wrong: {
    sieraden: [
      "Sieraden? Prachtig, maar ik ben douanier en geen juwelier. Dit is geen toegangsbewijs.",
      "Nog meer glimmend spul. Ik laat alleen mensen door, geen oorbellen.",
    ],
    "foto-job": [
      "Een foto van een jongeman? Ontroerend. Maar ik laat niemand door op basis van een knappe kop.",
      "Ik zie het, hij is schattig. Het blijft een foto, geen toegangsbewijs.",
    ],
    "ov-kaart": [
      "Een OV-kaart? Daarmee mag je reizen, maar niet de grens over. Volgende!",
      "Mijn lezer zegt: saldo prima, bewijs onvoldoende.",
    ],
    haarshampoo: [
      "Rode haarshampoo? Ik controleer papieren, geen haarkleur. Al is die kleur indrukwekkend.",
      "Ik ruik aardbei, maar ik ruik geen toegangsbewijs.",
    ],
    boek: [
      "Een boek over communicatie? Nuttig voor een gesprek met mij, maar het is geen geldig bewijs.",
      "Ik lees graag, maar nu even niet. Een bewijs graag, geen boek.",
    ],
    pepernoten: [
      "Pepernoten? Dat zou omkoping kunnen zijn. Ik doe alsof ik het niet zie. Een bewijs graag.",
    ],
  } as Record<string, string[]>,

  genericWrong: ["Dat is geen toegangsbewijs. Probeer het nog eens."],
};
