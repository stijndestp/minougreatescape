/**
 * Minou — HET referentieontwerp voor de hele game (vastgesteld in Rotterdam).
 * Voeten op 0,0, ongeveer 146 hoog. Gebruik deze component in elke scène,
 * zodat Minou overal exact hetzelfde personage is; varieer alleen via props:
 *  - `mood`   gezichtsuitdrukking
 *  - `arms`   pose van de armen (standaard: langs het lichaam)
 *  - `seated` zittend aan tafel: benen en schaduw weg (onderlijf achter de tafel)
 *  - `line`   lijndikte-factor; bij grote schaal (bijv. 2.3×) ongeveer 1/schaal × 1.3
 *             zodat het lijnwerk even dik oogt als in Rotterdam
 * Zonder props tekent hij exact de goedgekeurde Rotterdam-versie.
 * De klassen `.minou-sprite`, `.minou-leg-a/-b` en `.minou-body` blijven gelijk,
 * zodat de bestaande loop- en knuffelanimaties werken.
 */

export type HeroMood = "neutral" | "happy" | "worried" | "surprised" | "love";
export type HeroArms = "down" | "wave" | "cheer";

const INK = "#2b1b3d";
const SKIN = "#ffd9b8";
const SKIN_SHADE = "#f2b994";
const HAIR = "#d6401f";
const HAIR_DARK = "#a52f15";
const HAIR_LIGHT = "#ff7a3d";
const DRESS = "#7b2cbf";
const DRESS_LIGHT = "#9d4edd";

const HEART = "M0 3 C-5 -1 -4 -5 -1.5 -5 C-.5 -5 0 -4 0 -3.4 C0 -4 .5 -5 1.5 -5 C4 -5 5 -1 0 3Z";

/** Hoek per arm (graden, om de schouder) voor elke pose. */
const ARM_ANGLES: Record<HeroArms, [number, number]> = {
  down: [10, -10],
  wave: [10, -128],
  cheer: [124, -124],
};

function Eyes({ mood, l }: { mood: HeroMood; l: number }) {
  if (mood === "love") {
    return (
      <g>
        {[-8, 8].map((x) => (
          <g key={x} transform={`translate(${x} -94) scale(1.25)`}>
            <g className="hero-love-eye">
              <path d={HEART} fill="#e8174f" stroke={INK} strokeWidth={0.8 * l} />
            </g>
          </g>
        ))}
      </g>
    );
  }
  if (mood === "happy") {
    // lachende ooggleuven
    return <path d="M-12 -93 Q-8 -98 -4 -93 M4 -93 Q8 -98 12 -93" fill="none" stroke={INK} strokeWidth={2.4 * l} strokeLinecap="round" />;
  }
  const big = mood === "surprised";
  return (
    <g className="hero-eyes">
      {[-8, 8].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={-94} rx={big ? 4.8 : 4.2} ry={big ? 5.8 : 5} fill="#fff" stroke={INK} strokeWidth={1.4 * l} />
          <circle cx={x + (mood === "worried" ? -0.6 : 0.4)} cy={-93.4} r={big ? 2.6 : 3} fill="#3c8c5a" />
          <circle cx={x + (mood === "worried" ? -0.6 : 0.4)} cy={-93.4} r={1.5} fill={INK} />
          <circle cx={x + 1.4} cy={-95.4} r={1.1} fill="#fff" />
          {/* wimpers */}
          <path d={`M${x - 4.4} ${-96.6} q-1.6 -1 -2.4 -2.4`} stroke={INK} strokeWidth={1.4 * l} strokeLinecap="round" fill="none" transform={x > 0 ? `translate(${2 * x} 0) scale(-1 1)` : undefined} />
        </g>
      ))}
    </g>
  );
}

function Brows({ mood, l }: { mood: HeroMood; l: number }) {
  const d =
    mood === "worried" ? "M-12 -101.5 L-4.5 -105 M12 -101.5 L4.5 -105"
    : mood === "surprised" ? "M-12.5 -105 Q-8 -109 -3.5 -105.5 M12.5 -105 Q8 -109 3.5 -105.5"
    : mood === "happy" || mood === "love" ? "M-12 -102.5 Q-8 -105.5 -4 -103 M12 -102.5 Q8 -105.5 4 -103"
    : "M-12 -102 Q-8 -104.5 -4 -102.5 M12 -102 Q8 -104.5 4 -102.5";
  return <path d={d} fill="none" stroke="#8a2a12" strokeWidth={2.2 * l} strokeLinecap="round" />;
}

function Mouth({ mood, l }: { mood: HeroMood; l: number }) {
  switch (mood) {
    case "happy":
    case "love":
      return (
        <g>
          <path d="M-8 -85 Q0 -74 8 -85 Z" fill="#8a1538" stroke={INK} strokeWidth={1.4 * l} strokeLinejoin="round" />
          <path d="M-6.5 -84.6 H6.5 L6 -83 H-6Z" fill="#fff" />
          <path d="M-3.5 -79 Q0 -81.5 3.5 -79 Q0 -77 -3.5 -79Z" fill="#ff7a9a" />
        </g>
      );
    case "surprised":
      return <ellipse cx={0} cy={-81.5} rx={3.6} ry={4.6} fill="#8a1538" stroke={INK} strokeWidth={1.4 * l} />;
    case "worried":
      return <path d="M-6 -81.5 Q-3 -84.5 0 -82 Q3 -79.5 6 -82.5" fill="none" stroke="#c2185b" strokeWidth={2.6 * l} strokeLinecap="round" />;
    default:
      return <path d="M-6.5 -84.5 Q0 -79 6.5 -84.5" fill="none" stroke="#c2185b" strokeWidth={2.8 * l} strokeLinecap="round" />;
  }
}

interface HeroProps {
  mood?: HeroMood;
  arms?: HeroArms;
  seated?: boolean;
  line?: number;
}

export default function MinouHero({ mood = "neutral", arms = "down", seated = false, line = 1 }: HeroProps) {
  const l = line;
  const [la, ra] = ARM_ANGLES[arms];
  return (
    <g className={`minou-sprite minou-hero mood-${mood} arms-${arms}`}>
      {!seated && <ellipse cx={0} cy={0} rx={27} ry={7.5} fill="rgba(20,10,40,.3)" />}

      {/* benen met laarsjes (zwaaien tijdens het lopen) */}
      {!seated && (
        <>
          <g className="minou-leg minou-leg-a">
            <rect x={-11} y={-37} width={9} height={34} rx={4.5} fill={SKIN} stroke={INK} strokeWidth={1.6 * l} />
            <path d="M-12 -16 H-1 V-2 Q-1 1 -4 1 H-15 Q-17 1 -16 -2 L-12 -6Z" fill="#4a1f6b" stroke={INK} strokeWidth={1.6 * l} strokeLinejoin="round" />
          </g>
          <g className="minou-leg minou-leg-b">
            <rect x={2} y={-37} width={9} height={34} rx={4.5} fill={SKIN} stroke={INK} strokeWidth={1.6 * l} />
            <path d="M1 -16 H12 V-6 L16 -2 Q17 1 15 1 H4 Q1 1 1 -2Z" fill="#4a1f6b" stroke={INK} strokeWidth={1.6 * l} strokeLinejoin="round" />
          </g>
        </>
      )}

      <g className="minou-body">
        <g className="hero-breathe">
          {/* lang golvend haar achter het lichaam */}
          <path d="M-31 -104 Q-42 -78 -33 -58 Q-30 -46 -20 -48 Q-12 -44 -6 -50 L6 -50 Q12 -44 20 -48 Q30 -46 33 -58 Q42 -78 31 -104 Z" fill={HAIR} stroke={INK} strokeWidth={2 * l} strokeLinejoin="round" />
          <path d="M-22 -92 Q-28 -70 -20 -54 L20 -54 Q28 -70 22 -92 Z" fill={HAIR_DARK} />

          {/* armen met mouwtjes */}
          <g transform={`rotate(${la} -15 -74)`}>
            <g className={arms === "down" ? undefined : "hero-arm hero-arm-l"}>
              <rect x={-20} y={-74} width={8} height={27} rx={4} fill={SKIN} stroke={INK} strokeWidth={1.6 * l} />
              <path d="M-21 -76 h10 v9 h-10z" fill={DRESS_LIGHT} stroke={INK} strokeWidth={1.4 * l} />
            </g>
          </g>
          <g transform={`rotate(${ra} 15 -74)`}>
            <g className={arms === "down" ? undefined : "hero-arm hero-arm-r"}>
              <rect x={12} y={-74} width={8} height={27} rx={4} fill={SKIN} stroke={INK} strokeWidth={1.6 * l} />
              <path d="M11 -76 h10 v9 h-10z" fill={DRESS_LIGHT} stroke={INK} strokeWidth={1.4 * l} />
            </g>
          </g>

          {/* zittend: schoot (verdwijnt achter de tafel) */}
          {seated && <path d="M-27 -36 Q-29 -18 -20 -15 H20 Q29 -18 27 -36Z" fill={DRESS} stroke={INK} strokeWidth={2 * l} strokeLinejoin="round" />}
          {/* jurk met taille, rok en schaduwzijde */}
          <path d="M-12 -77 Q-14 -62 -25 -33 Q0 -28 25 -33 Q14 -62 12 -77 Z" fill={DRESS} stroke={INK} strokeWidth={2 * l} strokeLinejoin="round" />
          <path d="M4 -64 Q12 -50 20 -34 Q25 -33 25 -33 Q14 -62 12 -77 L8 -77Z" fill="#5a1f94" />
          <path d="M-22 -38 Q-12 -34 -4 -37 Q4 -33 12 -37 Q18 -34 23 -38" fill="none" stroke={DRESS_LIGHT} strokeWidth={2} strokeLinecap="round" />
          <rect x={-12.5} y={-66} width={25} height={4.5} rx={2} fill="#ffc400" stroke={INK} strokeWidth={1.4 * l} />
          <path d="M-8 -55 l1.5 3 l3 .4 l-2.2 2 l.6 3 l-2.9 -1.5 l-2.9 1.5 l.6 -3 l-2.2 -2 l3 -.4z" fill="#ffd54a" opacity={0.9} />

          {/* sjaal (roze, feestelijk) */}
          <path d="M-13 -80 Q0 -73 13 -80 L13 -73 Q0 -66 -13 -73Z" fill="#ff4d6d" stroke={INK} strokeWidth={1.6 * l} strokeLinejoin="round" />
          <path className="hero-scarf" d="M5 -73 L11 -55 L4 -56 L1 -71Z" fill="#ff4d6d" stroke={INK} strokeWidth={1.6 * l} strokeLinejoin="round" />
          <path d="M-8 -77 V-71 M0 -75 V-69 M8 -77 V-71" stroke="#fff" strokeWidth={1.6} opacity={0.8} />

          {/* hoofd */}
          <g className="hero-head">
            <path d="M-4 -78 V-73 H4 V-78Z" fill={SKIN_SHADE} />
            <circle cx={0} cy={-96} r={22} fill={SKIN} stroke={INK} strokeWidth={2 * l} />
            <path d="M-19 -86 Q0 -70 19 -86 Q10 -78 0 -77 Q-10 -78 -19 -86Z" fill={SKIN_SHADE} opacity={0.6} />
            {/* sproetjes */}
            {[[-5, -88], [-3, -86.5], [4, -88], [6, -86.6], [-1, -87.4]].map(([x, y]) => (
              <circle key={`${x}${y}`} cx={x} cy={y} r={0.7} fill="#c9733f" opacity={0.75} />
            ))}
            <ellipse cx={-13} cy={-86.5} rx={4.6} ry={2.6} fill="#ff7a9a" className="hero-blush" />
            <ellipse cx={13} cy={-86.5} rx={4.6} ry={2.6} fill="#ff7a9a" className="hero-blush" />
            <Eyes mood={mood} l={l} />
            <Brows mood={mood} l={l} />
            <path d="M-1 -89.5 Q1.5 -88 3 -90" fill="none" stroke="#c9733f" strokeWidth={1.4 * l} strokeLinecap="round" />
            <Mouth mood={mood} l={l} />

            {/* haar voor: pony, krullen en glans */}
            <path d="M-26 -98 Q-29 -128 0 -127 Q29 -128 26 -98 Q22 -110 12 -113 Q4 -106 -4 -111 Q-14 -104 -26 -98 Z" fill={HAIR} stroke={INK} strokeWidth={2 * l} strokeLinejoin="round" />
            <path d="M-17 -118 Q-6 -124 6 -121" fill="none" stroke={HAIR_LIGHT} strokeWidth={2.6} strokeLinecap="round" opacity={0.9} />
            <path d="M12 -117 Q18 -114 21 -107" fill="none" stroke={HAIR_LIGHT} strokeWidth={2} strokeLinecap="round" opacity={0.7} />
            <circle cx={-25} cy={-100} r={9} fill={HAIR} stroke={INK} strokeWidth={2 * l} />
            <circle cx={25} cy={-100} r={9} fill={HAIR} stroke={INK} strokeWidth={2 * l} />
            <path d="M-29 -94 Q-34 -84 -28 -76 M29 -94 Q34 -84 28 -76" fill="none" stroke={HAIR} strokeWidth={6} strokeLinecap="round" />

            {/* grote gouden ringoorbellen (zwaaien zacht mee) */}
            {[-23, 23].map((x) => (
              <g key={x} className="hero-hoop">
                <circle cx={x} cy={-83} r={9.5} fill="none" stroke={INK} strokeWidth={3.4 + 2.1 * l} />
                <circle cx={x} cy={-83} r={9.5} fill="none" stroke="#ffc400" strokeWidth={3.4} />
                <path d={`M${x - 6} ${-89} Q${x - 9} ${-85} ${x - 8} ${-80}`} fill="none" stroke="#fff6c2" strokeWidth={1.3} strokeLinecap="round" />
              </g>
            ))}
          </g>
        </g>
      </g>
    </g>
  );
}

/** Portret (hoofd en schouders) van precies dezelfde Minou, voor dialoogvensters. */
export function MinouPortrait({ mood = "neutral", size = 110 }: { mood?: HeroMood; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-46 -138 92 92" role="img" aria-label="Minou">
      <circle cx={0} cy={-92} r={44} fill="#ffe3ee" stroke={INK} strokeWidth={2} />
      <MinouHero mood={mood} seated line={0.8} />
    </svg>
  );
}

/** Klein tekstwolkje boven Minou ("?", "!", "♥"). Plaats het in een groep zonder CSS-animatie. */
export function MinouEmote({ glyph }: { glyph: "?" | "!" | "♥" }) {
  return (
    <g className="emote-pop">
      <path d="M-18 -16 Q-18 -32 0 -32 Q18 -32 18 -16 Q18 0 0 0 L-8 8 L-6 0 Q-18 0 -18 -16Z" fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
      <text x={0} y={-8} textAnchor="middle" fontSize={22} fontWeight={900} fill={glyph === "♥" ? "#e8174f" : glyph === "!" ? "#d62f2f" : "#0a3d9e"} fontFamily="sans-serif">
        {glyph}
      </text>
    </g>
  );
}
