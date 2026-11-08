/** Gedeelde dialoogtypes. De teksten zelf staan per scène in src/content. */
export type Speaker = "sinterklaas" | "minou" | "family" | "piet" | "omroep";

export type LineMood = "neutral" | "stern" | "shocked" | "happy";

export interface DialogueLine {
  speaker: Speaker;
  text: string;
  /** Naam die getoond wordt (standaard de naam van de spreker-soort). */
  name?: string;
  /** Bij `family`: welk familielid spreekt (voor portret en animatie). */
  memberId?: string;
  /** Gezichtsuitdrukking van de spreker (alleen gebruikt bij Piet-portretten). */
  mood?: LineMood;
}

export const speakerNames: Record<Speaker, string> = {
  sinterklaas: "Sinterklaas",
  minou: "Minou",
  family: "Familie",
  piet: "Piet",
  omroep: "Stationsomroep",
};

export const dialogueTexts = {
  next: "Verder",
};
