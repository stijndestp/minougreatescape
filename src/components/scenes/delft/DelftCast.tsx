import MinouSprite from "@/components/MinouSprite";
import SinterklaasSprite from "@/components/SinterklaasSprite";

/**
 * De tekeningen van de hoofdpersonen in de finale. Alle animaties in de scène
 * werken op de omringende groepen; vervang hier dus gerust een tekening door een
 * definitieve illustratie (voeten op (0, 0), groeit omhoog, ongeveer 130 hoog).
 */

/** Minou (rood haar, grote ringoorbellen): hergebruikt de bestaande tekening. */
export function MinouArt() {
  return <MinouSprite />;
}

export type JobPose = "wave" | "open" | "hug";

const INK = "#2b1b3d";

/** Job: tijdelijke cartoon. `pose` bepaalt de armen: zwaaien, wijd open, of omarmen. */
export function JobArt({ pose = "wave" }: { pose?: JobPose }) {
  const arm = (side: -1 | 1) => {
    const base = side === -1 ? { x: -17, y: -78 } : { x: 17, y: -78 };
    let rot = 0;
    if (pose === "open") rot = side * -62;
    if (pose === "hug") rot = side === -1 ? 100 : 72; // beide armen naar links, om Minou heen
    if (pose === "wave") rot = side === 1 ? -150 : 8;
    return (
      <g transform={`translate(${base.x} ${base.y}) rotate(${rot})`}>
        <g className={pose === "wave" && side === 1 ? "job-wave-arm-inner" : undefined}>
          <rect x={-4.5} y={0} width={9} height={32} rx={4.5} fill="#2b8fb3" stroke={INK} strokeWidth={2} />
          <circle cx={0} cy={34} r={6} fill="#f2c9a0" stroke={INK} strokeWidth={2} />
        </g>
      </g>
    );
  };
  return (
    <g className="job-art">
      <ellipse cx={0} cy={0} rx={26} ry={8} fill="rgba(0,0,0,.25)" />
      <g className="job-body">
        <rect x={-13} y={-40} width={11} height={38} rx={5} fill="#2f3d6b" stroke={INK} strokeWidth={2} />
        <rect x={2} y={-40} width={11} height={38} rx={5} fill="#2f3d6b" stroke={INK} strokeWidth={2} />
        <ellipse cx={-8} cy={-2} rx={10} ry={5} fill="#fff" stroke={INK} strokeWidth={2} />
        <ellipse cx={9} cy={-2} rx={10} ry={5} fill="#fff" stroke={INK} strokeWidth={2} />
        {arm(-1)}
        {arm(1)}
        <rect x={-21} y={-88} width={42} height={56} rx={14} fill="#2b8fb3" stroke={INK} strokeWidth={2.5} />
        <path d="M-9 -88 L0 -76 L9 -88" fill="#fff" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={0} cy={-106} r={21} fill="#f2c9a0" stroke={INK} strokeWidth={2.5} />
        <path d="M-22 -108 Q-22 -132 0 -132 Q22 -132 22 -108 Q12 -120 0 -118 Q-12 -118 -22 -108Z" fill="#4a2c17" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <circle cx={-8} cy={-105} r={2.8} fill="#3a2a2a" />
        <circle cx={8} cy={-105} r={2.8} fill="#3a2a2a" />
        <circle cx={-14} cy={-98} r={4} fill="#ff8aa0" opacity={0.55} />
        <circle cx={14} cy={-98} r={4} fill="#ff8aa0" opacity={0.55} />
        <path d="M-8 -96 Q0 -88 8 -96" stroke="#c2185b" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
}

/** Sinterklaas van top tot teen: de bestaande portrettekening op een mantel met staf. */
export function SinterklaasArt() {
  return (
    <g className="sint-art">
      <ellipse cx={0} cy={0} rx={34} ry={9} fill="rgba(0,0,0,.25)" />
      <path d="M-36 0 L-27 -88 Q0 -102 27 -88 L36 0 Z" fill="#d62f2f" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M-36 0 H36" stroke="#ffc400" strokeWidth={6} />
      <path d="M0 -92 V0" stroke="#ffc400" strokeWidth={4} />
      <rect x={-27} y={-52} width={54} height={7} fill="#2b1b3d" opacity={0.7} />
      <g transform="translate(-48 -178)">
        <SinterklaasSprite size={96} />
      </g>
      <path d="M48 0 V-150 Q48 -172 66 -168" fill="none" stroke="#ffc400" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}
