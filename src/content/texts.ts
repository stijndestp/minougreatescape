/**
 * PERSOONLIJKE CONTENT — teksten.
 * Pas hier alle losse teksten van de interface aan. Geen spellogica in dit bestand.
 */
export const texts = {
  gameTitle: "Minou's Great Escape",
  tagline: "Sinterklaasavond. Tilburg → Delft. Eén geliefde, vier hindernissen.",
  sinterklaasIntro:
    "Ho ho ho, Minou! Alle wegen zijn vandaag een escape room. Succes met je reis naar Job!",

  menu: {
    newGame: "Nieuw spel",
    continueGame: "Verder spelen",
    noSave: "Geen opgeslagen spel gevonden",
    confirmNewTitle: "Opnieuw beginnen?",
    confirmNewText:
      "Je hebt al een opgeslagen spel. Een nieuw spel wist je voortgang.",
    confirmNewYes: "Ja, nieuw spel",
    confirmNewNo: "Nee, terug",
  },

  map: {
    title: "De route naar Delft",
    backToMenu: "Terug naar menu",
    nextUp: "Volgende stop",
    lockedHint: "Nog vergrendeld",
    lockedMessage: "Voltooi eerst de vorige uitdaging.",
    alreadyDoneMessage: "Deze uitdaging heb je al voltooid.",
    doneLabel: "Voltooid",
    minimapLabel: "Nederland",
  },
} as const;
