import { memo } from "react";
import MinouHero, { MinouEmote, type HeroArms, type HeroMood } from "@/components/MinouHero";

/** Plek van Minou in de kamer: op het vloerkleed, tussen bed en kaptafel, zonder voorwerpen te bedekken. */
const SPOT = { x: 560, y: 792, scale: 2 };
/** Lijndikte zodat Minou hier precies zo oogt als in Rotterdam (2 × 0.65 ≈ 1.3, de Rotterdam-schaal). */
const LINE = 0.65;

interface Props {
  mood: HeroMood;
  arms: HeroArms;
  emote: "?" | "!" | "♥" | null;
}

/** Minou staat in haar eigen kamer en reageert op wat de speler doet (alleen weergave, niet klikbaar). */
export default function RoomMinou({ mood, arms, emote }: Props) {
  return (
    <svg className="room-minou" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
      <g transform={`translate(${SPOT.x} ${SPOT.y}) scale(${SPOT.scale})`}>
        <g className={arms === "cheer" ? "hero-hop" : "hero-sway"}>
          <MinouHero mood={mood} arms={arms} line={LINE} />
        </g>
        {emote && (
          <g transform="translate(30 -150)">
            <MinouEmote key={emote} glyph={emote} />
          </g>
        )}
      </g>
    </svg>
  );
}

/** Lichtlaag over de hele kamer: warme lampgloed, koel maanlicht en een zacht vignet. */
export const RoomLight = memo(function RoomLight() {
  return (
    <svg className="room-light" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
      <defs>
        <radialGradient id="tb-vignette" cx=".5" cy=".45" r=".75">
          <stop offset=".55" stopColor="#3a1040" stopOpacity="0" />
          <stop offset="1" stopColor="#3a1040" stopOpacity=".5" />
        </radialGradient>
        <radialGradient id="tb-warm" cx=".38" cy=".48" r=".5">
          <stop offset="0" stopColor="#ffcf7a" stopOpacity=".22" />
          <stop offset="1" stopColor="#ffcf7a" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width={1600} height={900} fill="url(#tb-warm)" />
      <rect width={1600} height={900} fill="url(#tb-vignette)" />
    </svg>
  );
});
