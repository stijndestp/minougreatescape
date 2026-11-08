/**
 * Tijdelijke SVG-tekeningen van servies en gerechten op de eettafel.
 * Oorsprong (0,0) = onderaan in het midden van het voorwerp. Vervangbaar.
 */
import type { ReactNode } from "react";
import type { DishArt } from "@/content/oosterhout";

const S = { stroke: "#2b1b3d", strokeWidth: 2.5, strokeLinejoin: "round" as const };

export const dishArt: Record<DishArt, () => ReactNode> = {
  plate: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={46} ry={13} fill="#fff" {...S} />
      <ellipse cx={0} cy={-8} rx={30} ry={8} fill="#e8f0ff" />
    </g>
  ),
  glass: () => (
    <g>
      <path d="M-9 -34 H9 L7 -4 H-7Z" fill="rgba(190,230,255,.75)" {...S} strokeWidth={2} />
      <path d="M-7.5 -20 H7.5 L7 -4 H-7Z" fill="#7fd0f5" />
      <rect x={-8} y={-4} width={16} height={4} rx={2} fill="#fff" {...S} strokeWidth={2} />
    </g>
  ),
  bread: () => (
    <g>
      <ellipse cx={0} cy={-10} rx={40} ry={11} fill="#c98a4b" {...S} />
      <ellipse cx={-14} cy={-22} rx={15} ry={9} fill="#f0b45e" {...S} />
      <ellipse cx={10} cy={-24} rx={16} ry={10} fill="#e8a64a" {...S} />
      <ellipse cx={24} cy={-17} rx={12} ry={8} fill="#f0b45e" {...S} />
    </g>
  ),
  candles: () => (
    <g>
      {[-18, 18].map((x) => (
        <g key={x}>
          <rect x={x - 12} y={-8} width={24} height={8} rx={3} fill="#ffc400" {...S} strokeWidth={2} />
          <rect x={x - 5} y={-52} width={10} height={44} fill="#fff" {...S} strokeWidth={2} />
          <path className="flame" d={`M${x} -76 Q${x + 9} -62 ${x} -54 Q${x - 9} -62 ${x} -76Z`} fill="#ffb703" />
        </g>
      ))}
    </g>
  ),
  vase: () => (
    <g>
      <path d="M-14 -44 Q-24 -22 -14 0 H14 Q24 -22 14 -44Z" fill="#5cc4ee" {...S} />
      {[[-12, -64, "#ff3d68"], [8, -72, "#ffc400"], [0, -58, "#fff"], [18, -56, "#ff3d68"]].map(([x, y, c]) => (
        <g key={`${x}`}>
          <path d={`M${(x as number) * 0.4} -44 L${x} ${y}`} stroke="#2fb36d" strokeWidth={3} />
          <circle cx={x as number} cy={y as number} r={9} fill={c as string} {...S} strokeWidth={2} />
        </g>
      ))}
    </g>
  ),
  soup: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={34} ry={9} fill="#c93358" {...S} />
      <path d="M-32 -8 Q-34 -44 0 -48 Q34 -44 32 -8Z" fill="#e0476b" {...S} />
      <ellipse cx={0} cy={-48} rx={10} ry={4} fill="#c93358" {...S} strokeWidth={2} />
      <circle cx={0} cy={-56} r={4} fill="#ffc400" {...S} strokeWidth={2} />
      <path className="steam" d="M-8 -64 Q-14 -76 -6 -88 M6 -64 Q12 -78 4 -92" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    </g>
  ),
  salad: () => (
    <g>
      <path d="M-34 -22 Q-32 0 0 0 Q32 0 34 -22Z" fill="#fff" {...S} />
      {[[-18, -26, "#2fb36d"], [0, -32, "#5fd37a"], [16, -27, "#2fb36d"], [-6, -22, "#ff6b6b"], [9, -34, "#ffd45e"]].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r={11} fill={c as string} {...S} strokeWidth={2} />
      ))}
    </g>
  ),
  jug: () => (
    <g>
      <path d="M-14 -50 Q-20 -22 -14 0 H14 Q20 -22 14 -50Z" fill="rgba(190,230,255,.85)" {...S} />
      <path d="M-17 -30 Q-17 -4 0 -2 Q17 -4 17 -30Z" fill="#7fd0f5" opacity={0.7} />
      <path d="M14 -42 Q30 -40 28 -22 Q26 -10 14 -10" fill="none" stroke="#2b1b3d" strokeWidth={3} />
    </g>
  ),
  stamppot: () => (
    <g>
      <path d="M-40 -34 Q-42 0 0 0 Q42 0 40 -34Z" fill="#4a4a55" {...S} />
      <ellipse cx={0} cy={-34} rx={40} ry={11} fill="#f4e3a8" {...S} />
      <ellipse cx={-10} cy={-40} rx={18} ry={8} fill="#7fcf6a" opacity={0.8} />
      <rect x={-52} y={-30} width={14} height={6} rx={3} fill="#2b1b3d" />
      <rect x={38} y={-30} width={14} height={6} rx={3} fill="#2b1b3d" />
    </g>
  ),
  sausage: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={46} ry={11} fill="#fff" {...S} />
      <path d="M-34 -14 Q-6 -34 34 -16 Q18 -2 -18 -4Z" fill="#b04a2a" {...S} />
      <path d="M-22 -16 Q-6 -26 18 -17" fill="none" stroke="#d98a6a" strokeWidth={3} strokeLinecap="round" />
    </g>
  ),
  potatoes: () => (
    <g>
      <path d="M-34 -22 Q-32 0 0 0 Q32 0 34 -22Z" fill="#fff" {...S} />
      {[[-20, -26], [0, -30], [20, -26], [-8, -38], [10, -38]].map(([x, y]) => (
        <ellipse key={`${x}${y}`} cx={x} cy={y} rx={13} ry={10} fill="#f2c96a" {...S} strokeWidth={2} />
      ))}
    </g>
  ),
  sauce: () => (
    <g>
      <path d="M-24 -20 Q-20 0 4 0 Q22 0 26 -20Z" fill="#fff" {...S} />
      <path d="M-24 -20 L-36 -30 L-20 -26Z" fill="#fff" {...S} />
      <ellipse cx={1} cy={-20} rx={25} ry={5} fill="#6b3a1a" />
      <rect x={-12} y={-4} width={26} height={4} fill="#fff" />
    </g>
  ),
  veg: () => (
    <g>
      <path d="M-34 -20 Q-30 0 0 0 Q30 0 34 -20Z" fill="#fff" {...S} />
      {[[-18, -24, "#ff8a3d"], [-2, -28, "#2fb36d"], [14, -24, "#ff8a3d"], [4, -20, "#5fd37a"], [24, -22, "#2fb36d"]].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r={9} fill={c as string} {...S} strokeWidth={2} />
      ))}
    </g>
  ),
  cake: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={50} ry={11} fill="#fff" {...S} />
      <path d="M-38 -10 V-34 Q0 -26 38 -34 V-10 Q0 0 -38 -10Z" fill="#ff8fb3" {...S} />
      <path d="M-30 -36 V-58 Q0 -50 30 -58 V-36 Q0 -28 -30 -36Z" fill="#ffd1e3" {...S} />
      <path d="M-30 -58 Q-22 -46 -14 -58 Q-6 -46 2 -58 Q10 -46 18 -58 Q24 -50 30 -58" fill="#fff" {...S} strokeWidth={2} />
      {[-14, 0, 14].map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y={-80} width={5} height={22} fill="#5cc4ee" {...S} strokeWidth={1.5} />
          <path className="flame" d={`M${x} -92 Q${x + 5} -85 ${x} -81 Q${x - 5} -85 ${x} -92Z`} fill="#ffb703" />
        </g>
      ))}
      <circle cx={-30} cy={-22} r={5} fill="#e0301e" /><circle cx={30} cy={-22} r={5} fill="#e0301e" /><circle cx={0} cy={-18} r={5} fill="#e0301e" />
    </g>
  ),
  fruit: () => (
    <g>
      <path d="M-34 -18 Q-30 0 0 0 Q30 0 34 -18Z" fill="#8d6ad8" {...S} />
      {[[-16, -24, "#e0301e"], [2, -30, "#ffb703"], [18, -24, "#2fb36d"], [-4, -22, "#ff8a3d"]].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r={11} fill={c as string} {...S} strokeWidth={2} />
      ))}
    </g>
  ),
  pepernoten: () => (
    <g>
      <path d="M-34 -22 Q-30 0 0 0 Q30 0 34 -22Z" fill="#ff6b9a" {...S} />
      {[[-20, -26], [-2, -30], [18, -26], [-10, -40], [8, -40], [26, -34]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r={9} fill="#b8742e" {...S} strokeWidth={2} />
          <circle cx={x - 3} cy={y - 3} r={2.2} fill="#d9a066" />
        </g>
      ))}
    </g>
  ),
  cheese: () => (
    <g>
      <rect x={-48} y={-12} width={96} height={12} rx={4} fill="#c98a4b" {...S} />
      <path d="M-34 -12 L-34 -30 L8 -30 L8 -12Z" fill="#ffc933" {...S} />
      <circle cx={-22} cy={-22} r={3} fill="#e6a800" /><circle cx={-6} cy={-20} r={2.5} fill="#e6a800" />
      <path d="M14 -12 L40 -12 L40 -20 Q28 -34 14 -24Z" fill="#ffe066" {...S} />
    </g>
  ),
  roast: () => (
    <g>
      <ellipse cx={0} cy={-6} rx={50} ry={12} fill="#fff" {...S} />
      <path d="M-34 -12 Q-30 -46 0 -48 Q32 -46 34 -12 Q0 0 -34 -12Z" fill="#b8642a" {...S} />
      <path d="M-18 -30 Q0 -40 18 -30" fill="none" stroke="#e8a064" strokeWidth={4} strokeLinecap="round" />
      <circle cx={38} cy={-22} r={8} fill="#fff" {...S} strokeWidth={2} />
    </g>
  ),
};
