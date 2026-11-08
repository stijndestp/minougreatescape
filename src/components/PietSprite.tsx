import type { LineMood } from "@/content/dialogue";

export type PietVariant = "douane" | "psycholoog";

const INK = "#2b1b3d";

/**
 * Tijdelijke tekening van een Piet (borststuk in een vak van 150 × 150).
 * Eén tekening voor beide Pieten: Grenswacht-Piet (pet, uniform) en
 * Relatiepsycholoog-Piet (baret, bril, vest). De gezichtsuitdrukking volgt `mood`.
 */
export function PietBust({ variant, mood = "neutral" }: { variant: PietVariant; mood?: LineMood }) {
  const douane = variant === "douane";
  const jacket = douane ? "#243b7a" : "#7a5cc2";

  const brows =
    mood === "stern"
      ? "M58 56 L70 60 M92 56 L80 60"
      : mood === "shocked"
        ? "M58 50 Q64 44 70 50 M92 50 Q86 44 80 50"
        : "M58 55 Q64 51 70 55 M92 55 Q86 51 80 55";
  const mouth =
    mood === "shocked"
      ? null
      : mood === "stern"
        ? "M65 86 Q75 80 85 86"
        : mood === "happy"
          ? "M62 82 Q75 96 88 82"
          : "M66 84 H84";

  return (
    <g>
      {/* lichaam */}
      <path d="M12 150 Q16 104 75 100 Q134 104 138 150Z" fill={jacket} stroke={INK} strokeWidth={3} strokeLinejoin="round" />
      {douane ? (
        <>
          <rect x={22} y={108} width={22} height={9} rx={3} fill="#ffc400" stroke={INK} strokeWidth={2} transform="rotate(-18 33 112)" />
          <rect x={106} y={108} width={22} height={9} rx={3} fill="#ffc400" stroke={INK} strokeWidth={2} transform="rotate(18 117 112)" />
          <path d="M75 106 V150" stroke="#ffc400" strokeWidth={4} />
          <circle cx={75} cy={128} r={4} fill="#ffc400" stroke={INK} strokeWidth={1.5} />
        </>
      ) : (
        <path d="M75 106 L58 150 M75 106 L92 150" stroke="#b9a4ee" strokeWidth={5} fill="none" />
      )}
      {/* kraag */}
      <path d="M44 104 q-6 9 2 13 q5 -8 10 -4 q3 8 10 5 q6 -6 9 0 q7 3 10 -5 q5 -4 10 4 q8 -4 2 -13 q-14 9 -28 9 q-14 0 -25 -9z" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />

      {/* krullen achter het hoofd */}
      {[[44, 66], [106, 66], [48, 84], [102, 84], [75, 38]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={11} fill="#4a2c17" stroke={INK} strokeWidth={2} />
      ))}
      {/* hoofd met roetvegen */}
      <circle cx={75} cy={68} r={30} fill="#ffd9b8" stroke={INK} strokeWidth={3} />
      <ellipse cx={55} cy={78} rx={7} ry={4} fill="#3a2a2a" opacity={0.28} />
      <ellipse cx={95} cy={78} rx={7} ry={4} fill="#3a2a2a" opacity={0.28} />
      <ellipse cx={75} cy={50} rx={9} ry={3} fill="#3a2a2a" opacity={0.18} />

      {/* ogen, wenkbrauwen, mond */}
      <circle cx={64} cy={66} r={3.4} fill="#3a2a2a" />
      <circle cx={86} cy={66} r={3.4} fill="#3a2a2a" />
      <path d={brows} stroke="#3a2a2a" strokeWidth={3.2} strokeLinecap="round" fill="none" />
      {mouth ? (
        <path d={mouth} stroke="#c2185b" strokeWidth={3.4} strokeLinecap="round" fill="none" />
      ) : (
        <ellipse cx={75} cy={86} rx={6} ry={7.5} fill="#8a1c3a" stroke={INK} strokeWidth={2} />
      )}
      <ellipse cx={75} cy={75} rx={4} ry={3} fill="#f2a08a" />

      {douane ? (
        <>
          {/* snor */}
          <path d="M60 79 Q75 70 90 79 Q75 84 60 79Z" fill="#4a2c17" />
          {/* douanepet */}
          <path d="M40 46 Q75 8 110 46 L114 54 L36 54Z" fill="#243b7a" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
          <path d="M34 54 Q75 66 116 54 L116 60 Q75 72 34 60Z" fill="#14172b" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <circle cx={75} cy={36} r={7} fill="#ffc400" stroke={INK} strokeWidth={2} />
        </>
      ) : (
        <>
          {/* ronde bril */}
          <circle cx={63} cy={66} r={11} fill="rgba(255,255,255,.35)" stroke="#1c1c2b" strokeWidth={3} />
          <circle cx={87} cy={66} r={11} fill="rgba(255,255,255,.35)" stroke="#1c1c2b" strokeWidth={3} />
          <path d="M74 66 H76" stroke="#1c1c2b" strokeWidth={3} />
          {/* baret met veer */}
          <ellipse cx={72} cy={40} rx={40} ry={15} fill="#7a5cc2" stroke={INK} strokeWidth={3} />
          <path d="M96 34 Q130 6 120 -4 Q112 14 90 28Z" fill="#ff4d9a" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        </>
      )}
    </g>
  );
}

export default function PietPortrait({
  size = 150,
  variant,
  mood = "neutral",
}: {
  size?: number;
  variant: PietVariant;
  mood?: LineMood;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 150 150" role="img" aria-label="Piet">
      <PietBust variant={variant} mood={mood} />
    </svg>
  );
}
