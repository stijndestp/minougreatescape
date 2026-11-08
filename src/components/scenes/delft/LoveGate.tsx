import type { CSSProperties } from "react";
import { delftTexts } from "@/content/delft";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

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

/** De romantische poort met hartvormig slot. De animatie loopt via CSS-klassen. */
export default function LoveGate({ unlocked, open, shakeKey, gateMs }: Props) {
  const style = { "--gate-ms": `${gateMs}ms` } as CSSProperties;
  return (
    <g className={open ? "love-gate gate-open" : "love-gate"} style={style} role="img" aria-label={delftTexts.gateLabel}>
      {/* pilaren met lantaarns */}
      {[612, 936].map((x) => (
        <g key={x}>
          <rect x={x} y={340} width={52} height={310} fill="#e0d4be" {...O} />
          <rect x={x - 8} y={330} width={68} height={18} rx={4} fill="#c9b99d" {...O} />
          <rect x={x - 8} y={630} width={68} height={20} rx={4} fill="#c9b99d" {...O} />
          <circle cx={x + 26} cy={310} r={20} fill="#ffd76a" className="win-glow" {...O} strokeWidth={2.5} />
          <path d={`M${x + 16} 310 h20`} stroke="#2b1b3d" strokeWidth={2} />
        </g>
      ))}

      {/* boog met rozen en hartjes */}
      <path d="M664 372 Q800 250 936 372" fill="none" stroke="#2b1b3d" strokeWidth={12} strokeLinecap="round" />
      <path d="M664 372 Q800 250 936 372" fill="none" stroke="#ff4d6d" strokeWidth={6} strokeLinecap="round" />
      {[[690, 336], [730, 304], [770, 286], [830, 286], [870, 304], [910, 336]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${0.55 + (i % 2) * 0.12})`}>
          <path d={HEART} fill={i % 2 ? "#ff9ab3" : "#e8174f"} {...O} strokeWidth={4} />
        </g>
      ))}
      {[[664, 400], [936, 400]].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y})`}>
          {[0, 1, 2].map((r) => <circle key={r} cx={(i ? -1 : 1) * (6 + r * 5)} cy={r * 26} r={9} fill="#ff4d6d" {...O} strokeWidth={2} />)}
        </g>
      ))}

      {/* de twee poortvleugels (zwaaien naar buiten) */}
      {([["left", 664, 800], ["right", 800, 936]] as const).map(([side, x0, x1]) => (
        <g key={side} className={`gate-leaf gate-${side}`} style={{ transformOrigin: `${side === "left" ? x0 : x1}px 500px` }}>
          <rect x={x0 + 2} y={376} width={x1 - x0 - 4} height={274} fill="rgba(255, 200, 220, .18)" />
          <rect x={x0 + 2} y={376} width={x1 - x0 - 4} height={274} fill="none" stroke="#2b1b3d" strokeWidth={8} />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${x0 + 2 + (i + 1) * ((x1 - x0 - 4) / 9)} 380 V646`} stroke="#3a2a50" strokeWidth={6} />
          ))}
          <path d={`M${x0 + 2} 470 H${x1 - 2} M${x0 + 2} 580 H${x1 - 2}`} stroke="#3a2a50" strokeWidth={6} />
          <g transform={`translate(${side === "left" ? x0 + 66 : x1 - 66} 420) scale(1.3)`}>
            <path d={HEART} fill="#ff4d6d" {...O} strokeWidth={3} />
          </g>
        </g>
      ))}

      {/* hartvormig slot */}
      <g className="lock-wrap" transform="translate(800 520)">
        <circle className={unlocked ? "lock-glow lock-glow-on" : "lock-glow"} cx={0} cy={0} r={58} fill="#fff6a8" opacity={0} />
        <g key={shakeKey} className={shakeKey > 0 ? "lock-wobble" : undefined}>
          <g className={unlocked ? "lock-shackle shackle-open" : "lock-shackle"}>
            <path d="M-14 -18 V-44 Q-14 -66 0 -66 Q14 -66 14 -44 V-18" fill="none" stroke="#2b1b3d" strokeWidth={13} strokeLinecap="round" />
            <path d="M-14 -18 V-44 Q-14 -66 0 -66 Q14 -66 14 -44 V-18" fill="none" stroke="#ffc400" strokeWidth={7} strokeLinecap="round" />
          </g>
          <g className={unlocked ? "lock-body lock-body-on" : "lock-body"}>
            <g transform="scale(2.6) translate(0 -4)">
              <path d={HEART} fill="#e8174f" {...O} strokeWidth={2.4} />
            </g>
            <circle cx={0} cy={-6} r={9} fill="#ffc400" stroke="#2b1b3d" strokeWidth={3} />
            <path d="M0 -2 V18" stroke="#ffc400" strokeWidth={8} strokeLinecap="round" />
            <path d="M0 -2 V18" stroke="#2b1b3d" strokeWidth={3} strokeLinecap="round" />
          </g>
        </g>
      </g>
    </g>
  );
}
