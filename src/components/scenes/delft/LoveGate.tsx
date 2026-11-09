import type { CSSProperties } from "react";
import { delftTexts } from "@/content/delft";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
const IRON = "#3a2a50";
const GOLD = "#ffc400";

const HEART = "M0 14 C-22 -2 -18 -22 -6 -22 C-1 -22 0 -16 0 -14 C0 -16 1 -22 6 -22 C18 -22 22 -2 0 14Z";

interface Props {
  /** Slot licht op en springt open. */
  unlocked: boolean;
  /** Poort zwaait open. */
  open: boolean;
  /** Verandert bij elke foute code: slot schudt. */
  shakeKey: number;
  /** Duur van de poortanimatie in ms. */
  gateMs: number;
}

/** Roos van cirkels en een spiraaltje (klimt langs de boog). */
function Rose({ x, y, s = 1, c = "#e8174f" }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-12 4 q-6 -10 4 -12 M12 4 q6 -10 -4 -12" fill="#3f9a5a" stroke={INK} strokeWidth={1.6} />
      <circle r={10} fill={c} stroke={INK} strokeWidth={2} />
      <path d="M-4 -1 q4 -6 8 0 q-2 5 -6 3 q-2 -3 1 -4" fill="none" stroke="#7a0a2a" strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

/** Delfts blauwe tegelpilaar met hartlantaarn. */
function Pillar({ x }: { x: number }) {
  return (
    <g>
      <rect x={x} y={340} width={52} height={310} fill="url(#gate-tile)" {...O} />
      <rect x={x + 40} y={340} width={12} height={310} fill="rgba(20,30,90,.18)" />
      <rect x={x - 8} y={326} width={68} height={20} rx={4} fill="#f6f3ff" {...O} />
      <path d={`M${x - 8} 336 H${x + 60}`} stroke="#1f4fa8" strokeWidth={3} />
      <rect x={x - 8} y={628} width={68} height={22} rx={4} fill="#f6f3ff" {...O} />
      <path d={`M${x - 4} 640 H${x + 56}`} stroke="#1f4fa8" strokeWidth={3} />
      {/* hartlantaarn */}
      <circle cx={x + 26} cy={300} r={52} fill="url(#gate-glow)" className="lamp-glow" />
      <path d={`M${x + 26} 326 V316`} stroke={INK} strokeWidth={4} />
      <g transform={`translate(${x + 26} 300) scale(1.1)`}>
        <path d={HEART} fill="#ffd76a" {...O} strokeWidth={2.6} className="win-glow" />
        <path d="M-8 -14 Q-12 -8 -8 -2" fill="none" stroke="#fff" strokeWidth={2.5} strokeLinecap="round" opacity={0.8} />
      </g>
    </g>
  );
}

/** De romantische poort met hartvormig slot. De animatie loopt via CSS-klassen. */
export default function LoveGate({ unlocked, open, shakeKey, gateMs }: Props) {
  const style = { "--gate-ms": `${gateMs}ms` } as CSSProperties;
  return (
    <g className={open ? "love-gate gate-open" : "love-gate"} style={style} role="img" aria-label={delftTexts.gateLabel}>
      <defs>
        <pattern id="gate-tile" width="26" height="26" patternUnits="userSpaceOnUse">
          <rect width="26" height="26" fill="#f6f3ff" />
          <rect x=".5" y=".5" width="25" height="25" fill="none" stroke="#b9c6ea" strokeWidth="1" />
          <path d="M0 5 A5 5 0 0 0 5 0 M21 0 A5 5 0 0 0 26 5 M26 21 A5 5 0 0 0 21 26 M5 26 A5 5 0 0 0 0 21" fill="none" stroke="#1f4fa8" strokeWidth="1.6" />
          <path d="M13 7 q-3 6 0 12 q3 -6 0 -12 M7 13 q6 -3 12 0 q-6 3 -12 0" fill="#1f4fa8" />
          <circle cx="13" cy="13" r="1.6" fill="#f6f3ff" />
        </pattern>
        <radialGradient id="gate-glow">
          <stop offset="0" stopColor="#ffd76a" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffd76a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="gate-light" cx=".5" cy=".7" r=".6">
          <stop offset="0" stopColor="#fff2c4" stopOpacity=".95" />
          <stop offset=".5" stopColor="#ff9ec4" stopOpacity=".6" />
          <stop offset="1" stopColor="#ff6fa8" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* licht dat door de geopende poort stroomt */}
      <rect className="gate-light" x={664} y={376} width={272} height={274} fill="url(#gate-light)" />

      <Pillar x={612} />
      <Pillar x={936} />

      {/* smeedijzeren boog met krullen, rozen en hartjes */}
      <path d="M664 372 Q800 236 936 372" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <path d="M664 372 Q800 236 936 372" fill="none" stroke={IRON} strokeWidth={8} strokeLinecap="round" />
      <path d="M676 372 Q800 262 924 372" fill="none" stroke={IRON} strokeWidth={4} />
      {[[700, 330], [740, 300], [860, 300], [900, 330]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} q${i < 2 ? 10 : -10} 14 0 22 q${i < 2 ? -8 : 8} -4 -2 -10`} fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />
      ))}
      <path d="M664 372 Q800 236 936 372" fill="none" stroke="#3f9a5a" strokeWidth={3} strokeDasharray="10 14" opacity={0.9} />
      {[[672, 356, 0.9], [696, 326, 1], [726, 300, 0.85], [764, 284, 1], [836, 284, 1], [874, 300, 0.85], [904, 326, 1], [928, 356, 0.9], [668, 400, 0.8], [932, 400, 0.8], [666, 436, 0.7], [934, 436, 0.7]].map(([x, y, s], i) => (
        <Rose key={i} x={x} y={y} s={s} c={i % 3 === 1 ? "#ff6b8f" : "#e8174f"} />
      ))}
      {/* medaillon met de initialen */}
      <g transform="translate(800 268)">
        <circle r={34} fill="url(#gate-glow)" className="lamp-glow" />
        <g transform="scale(1.6)">
          <path d={HEART} fill="#e8174f" {...O} strokeWidth={2} />
          <path d="M-10 -15 Q-15 -9 -11 -2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.7} />
        </g>
        <text y={2} textAnchor="middle" fontSize={15} fontWeight={900} fill="#fff" fontFamily="sans-serif">{delftTexts.gateInitials}</text>
      </g>

      {/* de twee poortvleugels (zwaaien naar buiten) */}
      {([["left", 664, 800], ["right", 800, 936]] as const).map(([side, x0, x1]) => {
        const inner = x1 - x0 - 4;
        return (
          <g key={side} className={`gate-leaf gate-${side}`} style={{ transformOrigin: `${side === "left" ? x0 : x1}px 500px` }}>
            <rect x={x0 + 2} y={376} width={inner} height={274} fill="rgba(255, 200, 220, .14)" />
            <rect x={x0 + 2} y={376} width={inner} height={274} fill="none" stroke={INK} strokeWidth={9} />
            <rect x={x0 + 2} y={376} width={inner} height={274} fill="none" stroke={IRON} strokeWidth={5} />
            {Array.from({ length: 8 }, (_, i) => {
              const bx = x0 + 2 + (i + 1) * (inner / 9);
              return (
                <g key={i}>
                  <path d={`M${bx} 380 V646`} stroke={IRON} strokeWidth={5} />
                  <path d={`M${bx - 4} 384 L${bx} 370 L${bx + 4} 384Z`} fill={GOLD} stroke={INK} strokeWidth={1.2} />
                </g>
              );
            })}
            <path d={`M${x0 + 2} 470 H${x1 - 2} M${x0 + 2} 590 H${x1 - 2}`} stroke={IRON} strokeWidth={6} />
            {/* sierkrullen onderin */}
            {Array.from({ length: 4 }, (_, i) => {
              const cx = x0 + 2 + (i + 0.5) * (inner / 4);
              return <path key={i} d={`M${cx - 14} 620 q0 -18 14 -18 q14 0 14 18 q0 -10 -8 -10`} fill="none" stroke={GOLD} strokeWidth={2.5} strokeLinecap="round" />;
            })}
            <g transform={`translate(${side === "left" ? x0 + 66 : x1 - 66} 424) scale(1.4)`}>
              <path d={HEART} fill="none" stroke={INK} strokeWidth={6} />
              <path d={HEART} fill="rgba(255,77,109,.85)" stroke={GOLD} strokeWidth={2.6} />
            </g>
          </g>
        );
      })}

      {/* hartvormig slot */}
      <g className="lock-wrap" transform="translate(800 520)">
        <circle className={unlocked ? "lock-glow lock-glow-on" : "lock-glow"} cx={0} cy={0} r={58} fill="#fff6a8" opacity={0} />
        <g key={shakeKey} className={shakeKey > 0 ? "lock-wobble" : undefined}>
          <g className={unlocked ? "lock-shackle shackle-open" : "lock-shackle"}>
            <path d="M-14 -18 V-44 Q-14 -66 0 -66 Q14 -66 14 -44 V-18" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
            <path d="M-14 -18 V-44 Q-14 -66 0 -66 Q14 -66 14 -44 V-18" fill="none" stroke={GOLD} strokeWidth={7} strokeLinecap="round" />
            <path d="M-10 -40 Q-10 -58 -2 -60" fill="none" stroke="#fff6c2" strokeWidth={2.4} strokeLinecap="round" />
          </g>
          <g className={unlocked ? "lock-body lock-body-on" : "lock-body"}>
            <g transform="scale(2.6) translate(0 -4)">
              <path d={HEART} fill="#e8174f" {...O} strokeWidth={2.4} />
              <path d="M-9 -16 Q-15 -10 -12 -2" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" opacity={0.75} />
              <path d={HEART} fill="none" stroke={GOLD} strokeWidth={1} transform="scale(.82) translate(0 -1)" opacity={0.9} />
            </g>
            <circle cx={0} cy={-6} r={9} fill={GOLD} stroke={INK} strokeWidth={3} />
            <path d="M0 -2 V18" stroke={GOLD} strokeWidth={8} strokeLinecap="round" />
            <path d="M0 -2 V18" stroke={INK} strokeWidth={3} strokeLinecap="round" />
            <circle className="keyhole-glow" cx={0} cy={-6} r={4} fill="#fff6a8" />
          </g>
          {unlocked && (
            <g className="lock-sparkles">
              {[0, 72, 144, 216, 288].map((a) => (
                <path key={a} transform={`rotate(${a}) translate(0 -78)`} d="M0 -9 L2.5 -2.5 L9 0 L2.5 2.5 L0 9 L-2.5 2.5 L-9 0 L-2.5 -2.5Z" fill="#fff6a8" stroke={GOLD} strokeWidth={1.2} />
              ))}
            </g>
          )}
        </g>
      </g>
    </g>
  );
}
