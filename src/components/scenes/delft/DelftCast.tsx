import MinouHero, { type HeroMood } from "@/components/MinouHero";
import SinterklaasSprite from "@/components/SinterklaasSprite";

/**
 * De tekeningen van de hoofdpersonen in de finale. Alle animaties in de scène
 * werken op de omringende groepen; vervang hier dus gerust een tekening door een
 * definitieve illustratie (voeten op (0, 0), groeit omhoog, ongeveer 130 hoog).
 */

/** Minou (rood haar, grote ringoorbellen) met gezichtsuitdrukking. */
export function MinouArt({ mood = "neutral" }: { mood?: HeroMood }) {
  return <MinouHero mood={mood} />;
}

export type JobPose = "wave" | "open" | "hug";
export type JobMood = "smile" | "surprised" | "love";

const INK = "#2b1b3d";
const SKIN = "#f2c9a0";
const SWEATER = "#2b8fb3";
const HEART = "M0 3 C-5 -1 -4 -5 -1.5 -5 C-.5 -5 0 -4 0 -3.4 C0 -4 .5 -5 1.5 -5 C4 -5 5 -1 0 3Z";

function JobFace({ mood }: { mood: JobMood }) {
  return (
    <g>
      {mood === "love" ? (
        [-8, 8].map((x) => (
          <g key={x} transform={`translate(${x} -105) scale(1.3)`}>
            <g className="hero-love-eye">
              <path d={HEART} fill="#e8174f" stroke={INK} strokeWidth={0.8} />
            </g>
          </g>
        ))
      ) : (
        <g className="hero-eyes">
          {[-8, 8].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy={-105} rx={mood === "surprised" ? 4.6 : 3.8} ry={mood === "surprised" ? 5.4 : 4.6} fill="#fff" stroke={INK} strokeWidth={1.4} />
              <circle cx={x + 0.6} cy={-104.6} r={2.6} fill="#5a3a22" />
              <circle cx={x + 0.6} cy={-104.6} r={1.3} fill={INK} />
              <circle cx={x + 1.6} cy={-106.4} r={0.9} fill="#fff" />
            </g>
          ))}
        </g>
      )}
      <path
        d={mood === "surprised" ? "M-12 -114 Q-8 -118 -4 -115 M12 -114 Q8 -118 4 -115" : "M-12 -112 Q-8 -115 -4 -113 M12 -112 Q8 -115 4 -113"}
        fill="none" stroke="#3a2414" strokeWidth={2.6} strokeLinecap="round"
      />
      <path d="M0 -101 Q3 -98 1 -96" fill="none" stroke="#c98d62" strokeWidth={1.6} strokeLinecap="round" />
      <ellipse cx={-14} cy={-97} rx={4.6} ry={2.6} fill="#ff8aa0" opacity={mood === "smile" ? 0.5 : 0.85} />
      <ellipse cx={14} cy={-97} rx={4.6} ry={2.6} fill="#ff8aa0" opacity={mood === "smile" ? 0.5 : 0.85} />
      {mood === "surprised" ? (
        <ellipse cx={0} cy={-91.5} rx={4} ry={4.6} fill="#8a1538" stroke={INK} strokeWidth={1.4} />
      ) : mood === "love" ? (
        <g>
          {/* getuite kuslippen */}
          <path d="M-5 -93 Q-2 -97 0 -94 Q2 -97 5 -93 Q2 -88 0 -90 Q-2 -88 -5 -93Z" fill="#e8174f" stroke={INK} strokeWidth={1.4} />
        </g>
      ) : (
        <g>
          <path d="M-8 -95 Q0 -85 8 -95 Z" fill="#8a1538" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
          <path d="M-6.5 -94.6 H6.5 L6 -93 H-6Z" fill="#fff" />
        </g>
      )}
    </g>
  );
}

/** Job: cartoon met trui en kuif. `pose` bepaalt de armen: zwaaien, wijd open, of omarmen. */
export function JobArt({ pose = "wave", mood = "smile" }: { pose?: JobPose; mood?: JobMood }) {
  const arm = (side: -1 | 1) => {
    const base = side === -1 ? { x: -17, y: -80 } : { x: 17, y: -80 };
    let rot = 0;
    if (pose === "open") rot = side * -62;
    if (pose === "hug") rot = side === -1 ? 100 : 72; // beide armen naar links, om Minou heen
    if (pose === "wave") rot = side === 1 ? -150 : 8;
    return (
      <g transform={`translate(${base.x} ${base.y}) rotate(${rot})`}>
        <g className={pose === "wave" && side === 1 ? "job-wave-arm-inner" : undefined}>
          <rect x={-5} y={0} width={10} height={33} rx={5} fill={SWEATER} stroke={INK} strokeWidth={2} />
          <rect x={-5} y={26} width={10} height={6} rx={2} fill="#1f6f8f" stroke={INK} strokeWidth={1.4} />
          <circle cx={0} cy={36} r={6} fill={SKIN} stroke={INK} strokeWidth={2} />
        </g>
      </g>
    );
  };
  return (
    <g className="job-art">
      <ellipse cx={0} cy={0} rx={27} ry={7.5} fill="rgba(20,10,40,.3)" />
      <g className="job-body">
        {/* spijkerbroek en sneakers */}
        <rect x={-13} y={-42} width={12} height={40} rx={5} fill="#34508a" stroke={INK} strokeWidth={2} />
        <rect x={1} y={-42} width={12} height={40} rx={5} fill="#34508a" stroke={INK} strokeWidth={2} />
        <path d="M-7 -40 V-8 M7 -40 V-8" stroke="#5a78b8" strokeWidth={1.4} />
        <path d="M-18 -6 Q-18 -10 -12 -10 H-1 V0 H-16 Q-19 0 -18 -6Z" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M18 -6 Q18 -10 12 -10 H1 V0 H16 Q19 0 18 -6Z" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M-17 -3 H-2 M17 -3 H2" stroke="#e8174f" strokeWidth={2} />
        {arm(-1)}
        {arm(1)}
        {/* trui met kraag en schaduwzijde */}
        <g className="hero-breathe">
          <path d="M-21 -78 Q-21 -90 -9 -90 H9 Q21 -90 21 -78 V-42 Q0 -36 -21 -42Z" fill={SWEATER} stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
          <path d="M8 -90 Q21 -90 21 -78 V-42 Q14 -40 10 -40Z" fill="rgba(10,20,60,.2)" />
          <path d="M-21 -46 Q0 -40 21 -46" fill="none" stroke="#1f6f8f" strokeWidth={3} />
          <path d="M-9 -90 L0 -78 L9 -90" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-6 -66 l3 -3 l3 3 l3 -3 l3 3" fill="none" stroke="#fff" strokeWidth={2} opacity={0.6} />
          {/* hoofd */}
          <path d="M-5 -90 V-84 H5 V-90Z" fill="#d9a87e" />
          <circle cx={0} cy={-106} r={21} fill={SKIN} stroke={INK} strokeWidth={2.5} />
          <ellipse cx={-21} cy={-104} rx={3.6} ry={5} fill={SKIN} stroke={INK} strokeWidth={1.8} />
          <ellipse cx={21} cy={-104} rx={3.6} ry={5} fill={SKIN} stroke={INK} strokeWidth={1.8} />
          <JobFace mood={mood} />
          {/* haar met kuif */}
          <path d="M-22 -108 Q-24 -132 -2 -134 Q10 -144 20 -132 Q26 -122 22 -108 Q16 -122 4 -120 Q-8 -126 -22 -108Z" fill="#4a2c17" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
          <path d="M-10 -128 Q0 -134 10 -132" fill="none" stroke="#7a4a28" strokeWidth={2.4} strokeLinecap="round" />
        </g>
      </g>
    </g>
  );
}

/** Sinterklaas van top tot teen: de bestaande portrettekening op een mantel met staf. */
export function SinterklaasArt() {
  return (
    <g className="sint-art">
      <ellipse cx={0} cy={0} rx={36} ry={9} fill="rgba(20,10,40,.3)" />
      {/* witte albe onder de mantel */}
      <path d="M-24 0 L-20 -80 H20 L24 0Z" fill="#f6f3ff" stroke={INK} strokeWidth={2.2} />
      {/* rode mantel met gouden rand en schaduwzijde */}
      <path d="M-38 0 L-28 -88 Q0 -104 28 -88 L38 0 L14 0 L8 -70 H-8 L-14 0Z" fill="#d62f2f" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M14 0 L8 -70 L28 -88 L38 0Z" fill="rgba(60,0,20,.22)" />
      <path d="M-38 0 H-14 M14 0 H38" stroke={"#ffc400"} strokeWidth={6} />
      <path d="M-14 0 L-8 -70 M14 0 L8 -70" stroke="#ffc400" strokeWidth={4} />
      {[-62, -46, -30, -14].map((y) => (
        <g key={y}>
          <path d={`M${-13 + (y + 70) * 0.08} ${y} l3 -3 l3 3 l-3 3z`} fill="#ffc400" />
          <path d={`M${7 - (y + 70) * 0.08} ${y} l3 -3 l3 3 l-3 3z`} fill="#ffc400" />
        </g>
      ))}
      {/* gouden kruis en handschoenen */}
      <path d="M0 -60 V-36 M-8 -50 H8" stroke="#ffc400" strokeWidth={4} strokeLinecap="round" />
      <circle cx={44} cy={-80} r={7} fill="#fff" stroke={INK} strokeWidth={2} />
      <g transform="translate(-48 -178)">
        <SinterklaasSprite size={96} />
      </g>
      {/* staf met krul */}
      <path d="M48 0 V-150" stroke="#c99200" strokeWidth={7} strokeLinecap="round" />
      <path d="M48 0 V-150" stroke="#ffd54a" strokeWidth={3} strokeLinecap="round" />
      <path d="M48 -150 Q48 -176 68 -174 Q84 -170 78 -154 Q72 -144 64 -152" fill="none" stroke="#c99200" strokeWidth={7} strokeLinecap="round" />
      <path d="M48 -150 Q48 -176 68 -174 Q84 -170 78 -154 Q72 -144 64 -152" fill="none" stroke="#ffd54a" strokeWidth={3} strokeLinecap="round" />
    </g>
  );
}
