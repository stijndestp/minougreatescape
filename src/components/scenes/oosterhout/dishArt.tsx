/**
 * SVG-tekeningen van servies en gerechten op de eettafel.
 * Oorsprong (0,0) = onderaan in het midden van het voorwerp. Vervangbaar.
 * Stijl: inktlijn, licht van boven (de kroonluchter), kleine glimlichtjes.
 */
import type { ReactNode } from "react";
import type { DishArt } from "@/content/oosterhout";

const INK = "#2b1b3d";
const S = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const };
const SHINE = { fill: "none", stroke: "#fff", strokeLinecap: "round" as const, opacity: 0.8 };

/** Kom/schaal met schaduwrand. */
const Bowl = ({ fill = "#fff", rim = "#e8f0ff" }: { fill?: string; rim?: string }) => (
  <g>
    <path d="M-34 -22 Q-32 0 0 0 Q32 0 34 -22Z" fill={fill} {...S} />
    <path d="M14 -18 Q22 -12 30 -20 Q28 -6 10 -2Z" fill="rgba(40,20,60,.12)" />
    <path d="M-34 -22 H34" stroke={rim} strokeWidth={3} />
    <path d="M-26 -14 Q-22 -6 -14 -4" {...SHINE} strokeWidth={2.5} />
  </g>
);

const Steam = ({ y = -64 }: { y?: number }) => (
  <path className="steam" d={`M-8 ${y} Q-14 ${y - 12} -6 ${y - 24} M6 ${y} Q12 ${y - 14} 4 ${y - 28}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
);

export const dishArt: Record<DishArt, () => ReactNode> = {
  plate: () => (
    <g>
      {/* vork en mes naast het bord */}
      <path d="M-56 -4 L-52 -14 M-60 -5 L-56 -15 M-52 -3 L-48 -13" stroke="#9aa0aa" strokeWidth={2} strokeLinecap="round" />
      <path d="M-56 -4 L-60 4" stroke="#9aa0aa" strokeWidth={3} strokeLinecap="round" />
      <path d="M52 2 L58 -14" stroke="#9aa0aa" strokeWidth={3.5} strokeLinecap="round" />
      <ellipse cx={0} cy={-6} rx={46} ry={13} fill="#fff" {...S} />
      <ellipse cx={0} cy={-7} rx={38} ry={10} fill="none" stroke="#e8b23a" strokeWidth={1.6} />
      <ellipse cx={0} cy={-8} rx={28} ry={7} fill="#eef4ff" />
      <path d="M-32 -12 Q-20 -17 -6 -17" {...SHINE} strokeWidth={2} />
    </g>
  ),
  glass: () => (
    <g>
      <path d="M-9 -34 H9 L7 -4 H-7Z" fill="rgba(190,230,255,.75)" {...S} strokeWidth={2} />
      <path d="M-7.5 -20 H7.5 L7 -4 H-7Z" fill="#c0392b" opacity={0.85} />
      <path d="M-7.5 -20 H7.5" stroke="#e2604f" strokeWidth={1.5} />
      <rect x={-8} y={-4} width={16} height={4} rx={2} fill="#fff" {...S} strokeWidth={2} />
      <path d="M-5 -30 V-8" {...SHINE} strokeWidth={2} />
    </g>
  ),
  bread: () => (
    <g>
      <ellipse cx={0} cy={-10} rx={40} ry={11} fill="#c98a4b" {...S} />
      <path d="M-36 -12 Q0 -2 36 -12" fill="none" stroke="#a66a35" strokeWidth={2} />
      <ellipse cx={-14} cy={-22} rx={15} ry={9} fill="#f0b45e" {...S} />
      <ellipse cx={10} cy={-24} rx={16} ry={10} fill="#e8a64a" {...S} />
      <ellipse cx={24} cy={-17} rx={12} ry={8} fill="#f0b45e" {...S} />
      <path d="M4 -28 L16 -22 M-20 -26 L-10 -20" stroke="#c98a4b" strokeWidth={2} strokeLinecap="round" />
      <path d="M-22 -27 Q-16 -30 -10 -28 M4 -31 Q10 -33 16 -31" {...SHINE} strokeWidth={2} opacity={0.6} />
    </g>
  ),
  candles: () => (
    <g>
      {[-18, 18].map((x) => (
        <g key={x}>
          <circle className="lamp-glow" cx={x} cy={-66} r={26} fill="#ffd76a" opacity={0.28} />
          <rect x={x - 12} y={-8} width={24} height={8} rx={3} fill="#e8b23a" {...S} strokeWidth={2} />
          <rect x={x - 5} y={-52} width={10} height={44} fill="#fff" {...S} strokeWidth={2} />
          <path d={`M${x - 3} -48 V-14`} {...SHINE} stroke="#ffe9c8" strokeWidth={2} />
          <path d={`M${x + 3} -52 q2 6 0 10`} fill="#fff" stroke={INK} strokeWidth={1.2} />
          <path className="flame" d={`M${x} -76 Q${x + 9} -62 ${x} -54 Q${x - 9} -62 ${x} -76Z`} fill="#ffb703" />
          <path className="flame" d={`M${x} -70 Q${x + 4} -62 ${x} -57 Q${x - 4} -62 ${x} -70Z`} fill="#fff2a8" />
        </g>
      ))}
      <path d="M-30 -4 Q0 6 30 -4" fill="none" stroke="#2fb36d" strokeWidth={5} strokeLinecap="round" />
      <circle cx={-6} cy={-2} r={3.5} fill="#e0301e" />
      <circle cx={6} cy={0} r={3.5} fill="#e0301e" />
    </g>
  ),
  vase: () => (
    <g>
      {[[-12, -64, "#ff3d68"], [8, -72, "#ffc400"], [0, -58, "#fff"], [18, -56, "#ff3d68"], [-20, -52, "#ff8a3d"]].map(([x, y, c]) => (
        <g key={`${x}`}>
          <path d={`M${(x as number) * 0.4} -44 L${x} ${y}`} stroke="#2fb36d" strokeWidth={3} />
          <circle cx={x as number} cy={y as number} r={9} fill={c as string} {...S} strokeWidth={2} />
          <circle cx={x as number} cy={y as number} r={3} fill="#ffd45e" />
        </g>
      ))}
      <path d="M-14 -44 Q-24 -22 -14 0 H14 Q24 -22 14 -44Z" fill="#2b6fd6" {...S} />
      <path d="M-18 -26 H18 M-16 -12 H16" stroke="#fff" strokeWidth={2.5} />
      <path d="M0 -36 q-4 4 0 8 q4 -4 0 -8" fill="#fff" />
      <path d="M-12 -38 Q-18 -22 -12 -6" {...SHINE} strokeWidth={2.5} opacity={0.5} />
    </g>
  ),
  soup: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={34} ry={9} fill="#c93358" {...S} />
      <path d="M-32 -8 Q-34 -44 0 -48 Q34 -44 32 -8Z" fill="#e0476b" {...S} />
      <path d="M14 -42 Q30 -30 28 -10 Q20 -6 12 -8Z" fill="#b8284c" opacity={0.6} />
      <path d="M-28 -24 Q0 -18 28 -24" fill="none" stroke="#fff" strokeWidth={3} opacity={0.7} />
      <ellipse cx={0} cy={-48} rx={10} ry={4} fill="#c93358" {...S} strokeWidth={2} />
      <circle cx={0} cy={-56} r={4} fill="#ffc400" {...S} strokeWidth={2} />
      <path d="M-34 -24 q-12 0 -10 -8 M34 -24 q12 0 10 -8" fill="none" stroke={INK} strokeWidth={3} />
      <path d="M-20 -38 Q-12 -44 -2 -44" {...SHINE} strokeWidth={3} />
      <Steam y={-64} />
    </g>
  ),
  salad: () => (
    <g>
      {[[-18, -26, "#2fb36d"], [0, -32, "#5fd37a"], [16, -27, "#2fb36d"], [-6, -22, "#ff6b6b"], [9, -34, "#ffd45e"], [24, -24, "#ff6b6b"]].map(([x, y, c]) => (
        <g key={`${x}${y}`}>
          <circle cx={x as number} cy={y as number} r={11} fill={c as string} {...S} strokeWidth={2} />
          <path d={`M${(x as number) - 4} ${(y as number) - 2} q4 -4 8 0`} fill="none" stroke="#fff" strokeWidth={1.4} opacity={0.6} />
        </g>
      ))}
      <Bowl />
    </g>
  ),
  jug: () => (
    <g>
      <path d="M-14 -50 Q-20 -22 -14 0 H14 Q20 -22 14 -50Z" fill="rgba(190,230,255,.85)" {...S} />
      <path d="M-17 -30 Q-17 -4 0 -2 Q17 -4 17 -30Z" fill="#7fd0f5" opacity={0.7} />
      <path d="M-14 -50 L-20 -56" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
      <path d="M14 -42 Q30 -40 28 -22 Q26 -10 14 -10" fill="none" stroke={INK} strokeWidth={3} />
      <circle cx={-4} cy={-20} r={4} fill="#fff59a" stroke={INK} strokeWidth={1.2} />
      <path d="M-9 -44 Q-13 -24 -9 -8" {...SHINE} strokeWidth={2.5} />
    </g>
  ),
  stamppot: () => (
    <g>
      <path d="M-40 -34 Q-42 0 0 0 Q42 0 40 -34Z" fill="#4a4a55" {...S} />
      <path d="M18 -30 Q38 -26 36 -10 Q20 -2 10 -4Z" fill="#33333f" />
      <ellipse cx={0} cy={-34} rx={40} ry={11} fill="#f4e3a8" {...S} />
      <ellipse cx={-10} cy={-38} rx={18} ry={6} fill="#7fcf6a" opacity={0.85} />
      {[[-18, -36], [6, -40], [18, -34], [-4, -32]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={2.2} fill="#3f9a5a" />)}
      <ellipse cx={8} cy={-36} rx={6} ry={3} fill="#c98a4b" stroke={INK} strokeWidth={1.4} />
      <path d="M8 -36 l-2 -2" stroke="#ffd45e" strokeWidth={2} />
      <rect x={-52} y={-30} width={14} height={6} rx={3} fill={INK} />
      <rect x={38} y={-30} width={14} height={6} rx={3} fill={INK} />
      <Steam y={-50} />
    </g>
  ),
  sausage: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={46} ry={11} fill="#fff" {...S} />
      <ellipse cx={0} cy={-7} rx={38} ry={8} fill="none" stroke="#e8b23a" strokeWidth={1.4} />
      <path d="M-34 -14 Q-6 -34 34 -16 Q18 -2 -18 -4Z" fill="#b04a2a" {...S} />
      <path d="M-22 -16 Q-6 -26 18 -17" fill="none" stroke="#d98a6a" strokeWidth={3} strokeLinecap="round" />
      <path d="M-26 -10 l4 -8 M-12 -12 l4 -10 M4 -12 l4 -10 M18 -12 l3 -8" stroke="#8a3418" strokeWidth={1.6} />
      <circle cx={-30} cy={-6} r={4} fill="#ffd45e" stroke={INK} strokeWidth={1.2} />
    </g>
  ),
  potatoes: () => (
    <g>
      {[[-20, -26], [0, -30], [20, -26], [-8, -38], [10, -38]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <ellipse cx={x} cy={y} rx={13} ry={10} fill="#f2c96a" {...S} strokeWidth={2} />
          <path d={`M${x - 6} ${y - 4} q4 -3 8 -1`} fill="none" stroke="#fff6cf" strokeWidth={2} strokeLinecap="round" />
        </g>
      ))}
      <path d="M-6 -42 l2 -4 M8 -42 l-1 -4" stroke="#3f9a5a" strokeWidth={2.5} strokeLinecap="round" />
      <Bowl />
      <Steam y={-50} />
    </g>
  ),
  sauce: () => (
    <g>
      <path d="M-24 -20 Q-20 0 4 0 Q22 0 26 -20Z" fill="#fff" {...S} />
      <path d="M-24 -20 L-36 -30 L-20 -26Z" fill="#fff" {...S} />
      <ellipse cx={1} cy={-20} rx={25} ry={5} fill="#6b3a1a" />
      <path d="M-8 -21 Q2 -23 12 -21" stroke="#a0603a" strokeWidth={2} fill="none" />
      <path d="M26 -16 Q38 -14 34 -4 Q30 2 20 -2" fill="none" stroke={INK} strokeWidth={2.5} />
      <rect x={-12} y={-4} width={26} height={4} fill="#fff" />
      <path d="M-18 -14 Q-14 -6 -6 -4" {...SHINE} strokeWidth={2} />
    </g>
  ),
  veg: () => (
    <g>
      {[[-18, -24, "#ff8a3d"], [-2, -28, "#2fb36d"], [14, -24, "#ff8a3d"], [4, -20, "#5fd37a"], [24, -22, "#2fb36d"]].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r={9} fill={c as string} {...S} strokeWidth={2} />
      ))}
      <path d="M-18 -30 l-3 -6 M14 -30 l3 -6" stroke="#2fb36d" strokeWidth={2.5} strokeLinecap="round" />
      <Bowl />
    </g>
  ),
  cake: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={50} ry={11} fill="#fff" {...S} />
      <ellipse cx={0} cy={-7} rx={42} ry={8} fill="none" stroke="#e8b23a" strokeWidth={1.4} />
      <path d="M-38 -10 V-34 Q0 -26 38 -34 V-10 Q0 0 -38 -10Z" fill="#ff8fb3" {...S} />
      <path d="M20 -30 Q38 -34 38 -34 V-10 Q30 -6 20 -6Z" fill="#e8608e" opacity={0.6} />
      <path d="M-30 -36 V-58 Q0 -50 30 -58 V-36 Q0 -28 -30 -36Z" fill="#ffd1e3" {...S} />
      <path d="M-30 -58 Q-22 -46 -14 -58 Q-6 -46 2 -58 Q10 -46 18 -58 Q24 -50 30 -58" fill="#fff" {...S} strokeWidth={2} />
      {[-14, 0, 14].map((x) => (
        <g key={x}>
          <circle className="lamp-glow" cx={x} cy={-86} r={9} fill="#ffd76a" opacity={0.4} />
          <rect x={x - 2.5} y={-80} width={5} height={22} fill="#5cc4ee" {...S} strokeWidth={1.5} />
          <path d={`M${x - 2.5} -74 l5 -3 M${x - 2.5} -66 l5 -3`} stroke="#fff" strokeWidth={1.2} />
          <path className="flame" d={`M${x} -92 Q${x + 5} -85 ${x} -81 Q${x - 5} -85 ${x} -92Z`} fill="#ffb703" />
        </g>
      ))}
      <circle cx={-30} cy={-22} r={5} fill="#e0301e" /><circle cx={30} cy={-22} r={5} fill="#e0301e" /><circle cx={0} cy={-18} r={5} fill="#e0301e" />
      <path d="M-34 -30 Q-30 -18 -26 -14" {...SHINE} strokeWidth={2.5} opacity={0.6} />
    </g>
  ),
  fruit: () => (
    <g>
      {[[-16, -24, "#e0301e"], [2, -30, "#ffb703"], [18, -24, "#2fb36d"], [-4, -22, "#ff8a3d"]].map(([x, y, c]) => (
        <g key={`${x}`}>
          <circle cx={x as number} cy={y as number} r={11} fill={c as string} {...S} strokeWidth={2} />
          <circle cx={(x as number) - 4} cy={(y as number) - 4} r={2.6} fill="#fff" opacity={0.6} />
        </g>
      ))}
      <path d="M2 -40 q2 -6 6 -6" fill="none" stroke="#6b3a1a" strokeWidth={2} />
      <Bowl fill="#8d6ad8" rim="#b39af0" />
    </g>
  ),
  pepernoten: () => (
    <g>
      {[[-20, -26], [-2, -30], [18, -26], [-10, -40], [8, -40], [26, -34]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={9} fill="#b8742e" {...S} strokeWidth={2} />
          <circle cx={x - 3} cy={y - 3} r={2.2} fill="#d9a066" />
        </g>
      ))}
      <Bowl fill="#ff6b9a" rim="#ffb3c6" />
    </g>
  ),
  cheese: () => (
    <g>
      <rect x={-48} y={-12} width={96} height={12} rx={4} fill="#c98a4b" {...S} />
      <path d="M-44 -9 H44" stroke="#e0a868" strokeWidth={2} />
      <path d="M-34 -12 L-34 -30 L8 -30 L8 -12Z" fill="#ffc933" {...S} />
      <path d="M-34 -30 L-26 -36 L14 -36 L8 -30Z" fill="#ffe066" {...S} strokeWidth={2} />
      <circle cx={-22} cy={-22} r={3} fill="#e6a800" /><circle cx={-6} cy={-20} r={2.5} fill="#e6a800" />
      <path d="M14 -12 L40 -12 L40 -20 Q28 -34 14 -24Z" fill="#ffe066" {...S} />
      <path d="M30 -16 l8 -12" stroke="#9aa0aa" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  roast: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={50} ry={12} fill="#fff" {...S} />
      <path d="M-34 -12 Q-30 -46 0 -48 Q32 -46 34 -12 Q0 0 -34 -12Z" fill="#b8642a" {...S} />
      <path d="M10 -44 Q32 -40 32 -14 Q20 -8 12 -10Z" fill="#8f4a1a" opacity={0.6} />
      <path d="M-18 -30 Q0 -40 18 -30" fill="none" stroke="#e8a064" strokeWidth={4} strokeLinecap="round" />
      <path d="M-24 -24 Q-14 -40 0 -42" {...SHINE} strokeWidth={2.5} opacity={0.6} />
      <circle cx={38} cy={-22} r={8} fill="#fff" {...S} strokeWidth={2} />
      <path d="M-40 -10 l-6 -4 M-34 -8 l-4 -6" stroke="#2fb36d" strokeWidth={3} strokeLinecap="round" />
      <Steam y={-56} />
    </g>
  ),
};
