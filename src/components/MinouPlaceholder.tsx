import { MinouPortrait } from "./MinouHero";

/**
 * Standaardportret van Minou (startmenu en dialogen zonder eigen portret).
 * Gebruikt exact het referentieontwerp uit MinouHero, zodat Minou overal gelijk is.
 */
export default function MinouPlaceholder({ size = 120 }: { size?: number }) {
  return <MinouPortrait mood="happy" size={size} />;
}
