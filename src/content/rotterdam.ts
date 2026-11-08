/**
 * PERSOONLIJKE CONTENT — Rotterdam Centraal: "De verkeerde trein".
 *
 * Alles wat je later wilt aanpassen staat hier:
 *  - `trains`          de drie treinen (feiten staan vast, het bord toont er maar een deel van)
 *  - `clues`           de drie aanwijzingen (tekst én regel); de test controleert dat er
 *                      precies één trein aan alle aanwijzingen voldoet
 *  - `correctTrainId`  het juiste perron (de test controleert dat dit klopt met de aanwijzingen)
 *  - `texts`           omroep (Eline-grap), Sinterklaas, Relatiepsycholoog-Piet, bordteksten
 *  - `sounds`          geluidseffecten per moment (nog niet gekoppeld: er is nog geen audiosysteem)
 * Regels: src/game/rotterdam.ts. Tekeningen: src/components/scenes/rotterdam/.
 */
import type { DialogueLine } from "./dialogue";
import type { ClueDef, DestinationId, TrainDef } from "@/game/rotterdam";

export const trains: readonly TrainDef[] = [
  {
    id: "perron-3",
    platform: 3,
    kind: "intercity",
    time: "19:48",
    destination: "Den Haag Centraal",
    heading: "den-haag",
    terminus: "Den Haag Centraal",
    stops: ["Den Haag Centraal"],
    stopsAtSmallStations: false,
  },
  {
    id: "perron-6",
    platform: 6,
    kind: "sprinter",
    time: "19:51",
    destination: "Den Haag Centraal",
    heading: "den-haag",
    terminus: "Den Haag Centraal",
    stops: ["Schiedam Centrum", "Delft", "Den Haag HS", "Den Haag Centraal"],
    stopsAtSmallStations: true,
  },
  {
    id: "perron-9",
    platform: 9,
    kind: "sprinter",
    time: "19:54",
    destination: "Dordrecht",
    heading: "dordrecht",
    terminus: "Dordrecht",
    stops: ["Lombardijen", "Barendrecht", "Zwijndrecht", "Dordrecht"],
    stopsAtSmallStations: true,
  },
];

export const correctTrainId = "perron-6";

export interface ClueContent extends ClueDef {
  /** Wat Sinterklaas zegt. */
  say: string;
  /** Korte tekst in het aantekenboekje. */
  note: string;
}

export const clues: readonly ClueContent[] = [
  {
    id: "klein",
    rule: { type: "smallStations" },
    say: "Eerste aanwijzing: Minou moet een trein nemen die ook op de kleinere stations stopt.",
    note: "Hij stopt ook op kleinere stations.",
  },
  {
    id: "richting",
    rule: { type: "notHeading", heading: "dordrecht" },
    say: "Tweede aanwijzing: ze mag niet terug richting Dordrecht. Daar komt ze net vandaan, dat zou wel erg onhandig zijn.",
    note: "Niet terug richting Dordrecht.",
  },
  {
    id: "delft",
    rule: { type: "intermediateStop", station: "Delft" },
    say: "Derde aanwijzing: Delft is een tussenstop en niet het eindstation.",
    note: "Delft is een tussenstop, geen eindstation.",
  },
];

export interface DestinationContent {
  id: DestinationId;
  letter: string;
  name: string;
  subtitle: string;
}

export const destinations: readonly DestinationContent[] = [
  { id: "leiden", letter: "A", name: "Leiden", subtitle: "Naar haar eigen familie." },
  { id: "delft", letter: "B", name: "Delft", subtitle: "Naar Job." },
];

const sint = (text: string): DialogueLine => ({ speaker: "sinterklaas", text });
const piet = (text: string, mood: DialogueLine["mood"]): DialogueLine => ({
  speaker: "piet",
  name: "Relatiepsycholoog-Piet",
  text,
  mood,
});

export const texts = {
  sceneTitle: "De verkeerde trein",
  stationName: "Rotterdam Centraal",

  /** Wisselende meldingen op het vertrekbord. */
  boardMessages: [
    "Sinterklaasavond: extra Pieten op het perron",
    "Let op: pepernoten op het spoor",
    "Sint en zijn paard Amerigo: vertraging i.v.m. daken",
    "Vragen? Vraag het een Piet",
  ],

  /** Bordteksten */
  boardTitle: "Vertrek",
  boardColumns: { time: "Tijd", platform: "Perron", kind: "Type", to: "Richting" },
  kindLabel: { intercity: "Intercity", sprinter: "Sprinter" } as Record<string, string>,
  boardHint: "Klik op een trein voor meer informatie.",
  detailStops: "Stopt in:",
  detailEnd: "Eindstation:",
  boardAction: (platform: number) => `Instappen op perron ${platform}`,
  notesTitle: "Aanwijzingen van Sinterklaas",

  choiceTitle: "Waar ligt je hart?",
  choiceHint: "Kies je bestemming.",

  adviceButton: "Accepteer het relatieadvies",
  adviceSlip: "Recept: één enkeltje Delft",

  /** Verplichte omroep: staat los van het antwoord op de puzzel. */
  announcement: [
    {
      speaker: "omroep",
      name: "Stationsomroep",
      text: "Dames en heren, let goed op voordat u in de trein stapt. We herinneren u graag aan het incident met Eline, de zus van Job. Zij wilde naar Utrecht, maar stapte in de verkeerde trein en eindigde daardoor in Breda.",
    },
    {
      speaker: "omroep",
      name: "Stationsomroep",
      text: "Controleer daarom altijd uw bestemming. Wij willen voorkomen dat Minou hetzelfde overkomt. Dank voor uw aandacht.",
    },
    sint("Nou Minou, je bent gewaarschuwd. Laten we hopen dat jij iets beter kunt navigeren dan je schoonzus!"),
  ] satisfies DialogueLine[],

  /** Sinterklaas leidt de aanwijzingen in (de aanwijzingen zelf komen uit `clues`). */
  cluesIntro: sint("Welk perron brengt je het dichtst bij Delft? Ik geef je drie aanwijzingen en jij kijkt op het bord."),
  cluesOutro: sint("Klik op de treinen op het bord om te zien waar ze stoppen. Neem de tijd, er is geen haast."),

  /** Grappige reactie per verkeerde trein: verraadt niet welk perron wél goed is. */
  wrong: {
    "perron-3": [
      "Hoor je die Intercity? Die is zó snel dat het station voorbij is voordat je hebt gezwaaid. Hmm, nee.",
      "De Intercity heeft haast. Jij ook, maar niet op zo'n manier.",
    ],
    "perron-9": [
      "Dordrecht? Daar kom je net vandaan! Zelfs Eline zou dit een beetje overdreven vinden.",
      "Die trein rijdt terug de rivieren over. Geen goed plan, Minou.",
    ],
  } as Record<string, string[]>,
  genericWrong: ["Ho ho ho, dat is niet de bedoeling. Kijk nog eens goed naar het bord."],

  /** Juiste trein gevonden; Sinterklaas stelt de grote vraag. */
  found: sint(
    "Zo Minou, je weet nu in ieder geval hoe een trein werkt. Maar laten we eens kijken waar je hart écht ligt. Naar je familie in Leiden, of naar jouw grote liefde in Delft?",
  ),

  delft: [sint("Kijk, daar spreekt de ware liefde! Vooruit dan, op naar Job!")] satisfies DialogueLine[],

  /** Relatiepsycholoog-Piet (alleen bij Leiden), met gezichtsuitdrukking per regel. */
  therapy: [
    piet("Minou... Ga eens rustig zitten. We moeten het toch even over jouw prioriteiten hebben.", "shocked"),
    piet(
      "Je bent helemaal vanuit Tilburg vertrokken om bij Job te komen. Je hebt de schoonfamilie overleefd, een complete brug gerepareerd en bijna de verkeerde trein gepakt.",
      "stern",
    ),
    piet("En nu wil je ineens naar Leiden? Volgens mij hebben we hier te maken met een klassiek geval van acute bindingsangst!", "shocked"),
    piet("Ik schrijf je een enkeltje Delft voor. Drie keer daags knuffelen met Job en vooral niet meer twijfelen!", "neutral"),
  ] satisfies DialogueLine[],
  /** Overdreven notities die per regel verschijnen. */
  therapyNotes: ["Hmm. Hmm. HMM.", "Prioriteiten?!", "Acute bindingsangst!!", "Knuffelrecept: 3x daags"],
  therapyEnter: "Relatiepsycholoog-Piet",

  /** Stationsteksten in de scène (bewegwijzering). */
  signs: { exit: "Uitgang", platforms: "Perron 1 – 12", pepernoten: "Pepernoten & speculaas", welcome: "Gezellige Sinterklaasavond" },
};

/**
 * Geluidseffecten per moment (id's). Er is nog geen audiosysteem; deze lijst
 * is de plek waar de koppeling later komt. Het spel werkt volledig zonder geluid.
 */
export const sounds = {
  announcementChime: null as string | null,
  wrongTrain: null as string | null,
  rightTrain: null as string | null,
  trainDeparts: null as string | null,
};
