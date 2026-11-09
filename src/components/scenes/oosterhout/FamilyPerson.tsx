import { useId } from "react";
import type { Mood, PersonLook } from "@/content/oosterhout";

/**
 * Tijdelijke cartoonfiguur (borstbeeld). Oorsprong (0,0) = onderaan, in het midden;
 * het figuur groeit omhoog (hoofd rond y = -160). Heeft `look.photo` een waarde,
 * dan wordt het hoofd uit die foto geknipt (de romp blijft cartoon). Gezichtsuitdrukking
 * via `mood`; de beweging (spreken, opduiken) gebeurt met CSS op de omliggende groep.
 */
const LINE = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

function Hair({ look }: { look: PersonLook }) {
  const c = look.hair;
  switch (look.hairStyle) {
    case "bun":
      return (
        <g fill={c} {...LINE}>
          <circle cx={0} cy={-232} r={22} />
          <path d="M-54 -160 Q-56 -226 0 -226 Q56 -226 54 -160 Q34 -190 0 -192 Q-34 -190 -54 -160Z" />
        </g>
      );
    case "curly":
      return (
        <g fill={c} {...LINE}>
          {[[-44, -196], [-22, -216], [0, -222], [22, -216], [44, -196], [-54, -168], [54, -168]].map(([x, y]) => (
            <circle key={`${x}`} cx={x} cy={y} r={20} />
          ))}
        </g>
      );
    case "receding":
      return (
        <g fill={c} {...LINE}>
          {[[-46, -184, 15], [-34, -204, 16], [-12, -214, 16], [12, -213, 16], [34, -203, 16], [48, -184, 15], [-54, -166, 11], [54, -166, 11]].map(([x, y, r]) => (
            <circle key={`${x}${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      );
    case "bald":
      return (
        <g fill={c} {...LINE}>
          <path d="M-52 -156 Q-62 -178 -48 -196 Q-44 -176 -50 -160Z" />
          <path d="M52 -156 Q62 -178 48 -196 Q44 -176 50 -160Z" />
        </g>
      );
    case "long":
      return (
        <g fill={c} {...LINE}>
          <path d="M-62 -100 Q-72 -230 0 -232 Q72 -230 62 -100 Q56 -100 52 -132 L52 -176 Q30 -204 0 -200 Q-30 -204 -52 -176 L-52 -132 Q-56 -100 -62 -100Z" />
        </g>
      );
    case "spiky":
      return (
        <g fill={c} {...LINE}>
          <path d="M-54 -162 L-48 -214 L-30 -192 L-18 -228 L0 -198 L18 -230 L30 -192 L48 -216 L54 -162 Q30 -186 0 -184 Q-30 -186 -54 -162Z" />
        </g>
      );
    default:
      return (
        <g fill={c} {...LINE}>
          <path d="M-54 -160 Q-58 -226 0 -228 Q58 -226 54 -160 Q44 -178 30 -188 Q8 -204 -14 -196 Q-40 -188 -54 -160Z" />
        </g>
      );
  }
}

function Face({ mood, look }: { mood: Mood; look: PersonLook }) {
  const eyeY = -160;
  return (
    <g>
      {/* ogen en wenkbrauwen */}
      {mood === "happy" ? (
        <g fill="none" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round">
          <path d="M-28 -156 Q-18 -170 -8 -156" />
          <path d="M8 -156 Q18 -170 28 -156" />
        </g>
      ) : mood === "shocked" ? (
        <g>
          <circle cx={-18} cy={eyeY} r={11} fill="#fff" {...LINE} strokeWidth={2.5} />
          <circle cx={18} cy={eyeY} r={11} fill="#fff" {...LINE} strokeWidth={2.5} />
          <circle cx={-18} cy={eyeY} r={4} fill="#2b1b3d" />
          <circle cx={18} cy={eyeY} r={4} fill="#2b1b3d" />
          <path d="M-32 -182 Q-18 -194 -6 -182 M6 -182 Q18 -194 32 -182" fill="none" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : mood === "disapproving" ? (
        <g>
          <circle cx={-15} cy={eyeY} r={5} fill="#2b1b3d" />
          <circle cx={21} cy={eyeY} r={5} fill="#2b1b3d" />
          <path d="M-32 -176 L-8 -168 M32 -176 L8 -168" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : (
        <g className="fam-blink">
          <circle className="fam-eye" cx={-18} cy={eyeY} r={5.5} fill={look.eyeColor ?? "#2b1b3d"} />
          <circle className="fam-eye" cx={18} cy={eyeY} r={5.5} fill={look.eyeColor ?? "#2b1b3d"} />
          {look.eyeColor && (
            <>
              <circle cx={-18} cy={eyeY} r={2.4} fill="#2b1b3d" />
              <circle cx={18} cy={eyeY} r={2.4} fill="#2b1b3d" />
            </>
          )}
        </g>
      )}
      {look.glasses && (
        <g fill="rgba(255,255,255,.22)" stroke={look.glassesColor ?? "#2b1b3d"} strokeWidth={look.glassesThin ? 2.5 : 4.5}>
          <circle cx={-18} cy={eyeY} r={look.glassesThin ? 20 : 17} />
          <circle cx={18} cy={eyeY} r={look.glassesThin ? 20 : 17} />
          <path d="M-1 -163 H1" />
        </g>
      )}
      {look.stubble && (
        <path d="M-42 -142 Q-38 -102 0 -98 Q38 -102 42 -142 Q26 -122 0 -124 Q-26 -122 -42 -142Z" fill="#6e5a46" opacity={0.32} />
      )}
      {/* neus */}
      <path d="M0 -154 Q-7 -142 0 -140" fill="none" stroke="#c98a5a" strokeWidth={3} strokeLinecap="round" />
      {look.moustache && <path d="M-24 -134 Q-12 -148 0 -138 Q12 -148 24 -134 Q12 -132 0 -134 Q-12 -132 -24 -134Z" fill={look.hair} {...LINE} strokeWidth={2.5} />}
      {/* mond */}
      {mood === "talking" ? (
        <ellipse className="fam-mouth-talk" cx={0} cy={-122} rx={13} ry={10} fill="#8a1c3a" {...LINE} strokeWidth={2.5} />
      ) : mood === "happy" ? (
        <path d="M-18 -128 Q0 -104 18 -128Z" fill="#8a1c3a" {...LINE} strokeWidth={2.5} />
      ) : mood === "shocked" ? (
        <ellipse cx={0} cy={-120} rx={9} ry={13} fill="#8a1c3a" {...LINE} strokeWidth={2.5} />
      ) : mood === "disapproving" ? (
        <path d="M-14 -118 Q0 -126 14 -118" fill="none" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round" />
      ) : look.teeth ? (
        <path d="M-20 -128 Q0 -106 20 -128 Q0 -120 -20 -128Z" fill="#fff" {...LINE} strokeWidth={2.5} />
      ) : (
        <path d="M-14 -124 Q0 -112 14 -124" fill="none" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round" />
      )}
      {look.beard && (
        <path d="M-44 -140 Q-40 -96 0 -92 Q40 -96 44 -140 Q30 -116 0 -118 Q-30 -116 -44 -140Z" fill={look.hair} {...LINE} strokeWidth={2.5} />
      )}
      {/* blosjes */}
      <circle cx={-34} cy={-138} r={7} fill="#ff9aa8" opacity={0.45} />
      <circle cx={34} cy={-138} r={7} fill="#ff9aa8" opacity={0.45} />
    </g>
  );
}

const BADGES: Partial<Record<Mood, { glyph: string; fill: string }>> = {
  shocked: { glyph: "!", fill: "#ff3d68" },
  disapproving: { glyph: "…", fill: "#8d6ad8" },
  happy: { glyph: "♥", fill: "#ffb703" },
};

/** Echte foto op een cartoonromp. De foto zelf verandert niet van uitdrukking; een kleine badge toont de reactie. */
function PhotoPerson({ look, mood, uid }: { look: PersonLook; mood: Mood; uid: string }) {
  const p = look.photo!;
  const R = 70;
  const cy = -172;
  const s = (R * 2) / p.crop.w;
  const badge = BADGES[mood];
  return (
    <g className="fam-body">
      <path d="M-92 0 Q-94 -86 -42 -102 H42 Q94 -86 92 0Z" fill={look.shirt} {...LINE} />
      <path d="M-20 -104 L0 -82 L20 -104Z" fill={look.skin} {...LINE} strokeWidth={2.5} />
      <defs>
        <clipPath id={`head-${uid}`}>
          <circle cx={0} cy={cy} r={R} />
        </clipPath>
      </defs>
      <circle cx={0} cy={cy} r={R + 2} fill="#fff" />
      <g clipPath={`url(#head-${uid})`}>
        <image
          href={p.src}
          x={-R - p.crop.x * s}
          y={cy - R - p.crop.y * s}
          width={p.size.w * s}
          height={p.size.h * s}
          preserveAspectRatio="none"
        />
      </g>
      <circle cx={0} cy={cy} r={R} fill="none" stroke="#2b1b3d" strokeWidth={4} />
      {badge && (
        <g className="fam-badge" transform="translate(58 -226)">
          <circle r={19} fill={badge.fill} {...LINE} strokeWidth={3} />
          <text y={7} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily="sans-serif">
            {badge.glyph}
          </text>
        </g>
      )}
    </g>
  );
}

export default function FamilyPerson({ look, mood = "neutral" }: { look: PersonLook; mood?: Mood }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  if (look.photo) return <PhotoPerson look={look} mood={mood} uid={uid} />;
  return (
    <g className="fam-body">
      {look.hairStyle === "long" && <Hair look={look} />}
      {/* schouders en romp */}
      <path d="M-92 0 Q-94 -86 -42 -102 H42 Q94 -86 92 0Z" fill={look.shirt} {...LINE} />
      {/* schaduwzijde en schouderlicht (licht van de kroonluchter, linksboven) */}
      <path d="M34 -101 Q84 -88 90 -2 H58 Q62 -56 34 -101Z" fill="rgba(30,10,40,.16)" />
      <path d="M-70 -70 Q-60 -92 -40 -98" fill="none" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.18} />
      {look.undershirt && <path d="M-34 -100 L0 -76 L34 -100 L30 0 H-30Z" fill={look.undershirt} {...LINE} strokeWidth={2.5} />}
      <path d={look.undershirt || look.openCollar ? "M-26 -102 L0 -64 L26 -102Z" : "M-18 -102 L0 -84 L18 -102Z"} fill={look.undershirt ? look.undershirt : look.skin} {...LINE} strokeWidth={2.5} />
      {look.openCollar && (
        <g fill="#ece4d2" {...LINE} strokeWidth={2.5}>
          <path d="M-26 -104 L-6 -96 L-30 -70Z" />
          <path d="M26 -104 L6 -96 L30 -70Z" />
        </g>
      )}
      <rect x={-15} y={-118} width={30} height={22} fill={look.skin} />
      {look.parting && (
        <g fill={look.hair} {...LINE} strokeWidth={2.5}>
          <path d="M-56 -112 Q-76 -70 -66 -22 L-46 -28 Q-52 -72 -40 -108Z" />
          <path d="M56 -112 Q76 -70 66 -22 L46 -28 Q52 -72 40 -108Z" />
        </g>
      )}
      {/* oren, hoofd */}
      <circle cx={-53} cy={-156} r={10} fill={look.skin} {...LINE} strokeWidth={2.5} />
      <circle cx={53} cy={-156} r={10} fill={look.skin} {...LINE} strokeWidth={2.5} />
      {look.earrings && (
        <g fill="none" stroke="#ffc400" strokeWidth={4.5}>
          <circle cx={-56} cy={-132} r={13} />
          <circle cx={56} cy={-132} r={13} />
        </g>
      )}
      <circle cx={0} cy={-160} r={54} fill={look.skin} {...LINE} />
      <path d="M-46 -132 Q0 -94 46 -132 Q30 -110 0 -108 Q-30 -110 -46 -132Z" fill="rgba(140,70,30,.12)" />
      <rect x={-15} y={-106} width={30} height={7} fill="rgba(140,70,30,.18)" />
      {look.hairStyle !== "long" && <Hair look={look} />}
      {look.hairStyle === "long" && !look.parting && (
        <path d="M-54 -166 Q-30 -204 0 -200 Q30 -204 54 -166 Q36 -184 0 -182 Q-36 -184 -54 -166Z" fill={look.hair} {...LINE} strokeWidth={2.5} />
      )}
      {look.hairStyle === "long" && look.parting && (
        <g fill={look.hair} {...LINE} strokeWidth={2.5}>
          <path d="M-1 -212 Q-58 -208 -60 -148 L-58 -104 Q-50 -148 -36 -166 Q-14 -186 -1 -196Z" />
          <path d="M1 -212 Q58 -208 60 -148 L58 -104 Q50 -148 36 -166 Q14 -186 1 -196Z" />
        </g>
      )}
      <Face mood={mood} look={look} />
    </g>
  );
}
/** Los portret voor in het dialoogvenster. */
export function FamilyPortrait({ look, mood = "talking", size = 120 }: { look: PersonLook; mood?: Mood; size?: number }) {
  return (
    <svg width={size} height={size * 1.05} viewBox="-110 -246 220 236" aria-hidden>
      <FamilyPerson look={look} mood={mood} />
    </svg>
  );
}
