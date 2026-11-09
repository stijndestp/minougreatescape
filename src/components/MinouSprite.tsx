import MinouHero, { type HeroArms, type HeroMood } from "./MinouHero";

/**
 * Minou als speelstuk (kaart, Moerdijk, Dordrecht): exact het referentieontwerp
 * uit MinouHero (Rotterdam), optioneel met de zwevende hartjes-pin van de kaart.
 * Voeten op 0,0. De klassen `.minou-sprite`, `.minou-leg-a/-b`, `.minou-body` en
 * `.minou-pin` blijven gelijk, zodat de loop- en markeringsanimaties werken.
 * Teken Minou hier nooit opnieuw; pas alleen MinouHero aan als het ontwerp verandert.
 */
export default function MinouSprite({
  mood = "neutral",
  arms = "down",
  line = 1,
  pin = false,
}: {
  mood?: HeroMood;
  arms?: HeroArms;
  /** Lijndikte-factor (≈ 1.3 / schaal) zodat het lijnwerk overal gelijk oogt. */
  line?: number;
  /** Markeringspin boven het hoofd (alleen op de kaart). */
  pin?: boolean;
}) {
  return (
    <>
      <MinouHero mood={mood} arms={arms} line={line} />
      {pin && (
        <g className="minou-pin" aria-hidden>
          <path d="M0 -140 C-14 -150 -14 -166 -6 -168 C-2 -169 0 -166 0 -163 C0 -166 2 -169 6 -168 C14 -166 14 -150 0 -140Z" fill="#ff3d68" stroke="#fff" strokeWidth={3} strokeLinejoin="round" />
          <path d="M-7 -160 Q-8 -155 -5 -151" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        </g>
      )}
    </>
  );
}
