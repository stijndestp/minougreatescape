import { memo } from "react";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

type Gable = "step" | "bell" | "point" | "flat";
/** [x, breedte, hoogte, kleur, topgevel] — gevels langs de gracht, voeten op y = 560. */
const LEFT: [number, number, number, string, Gable][] = [
  [0, 120, 330, "#d9825a", "step"], [118, 104, 270, "#e6c06a", "bell"], [220, 126, 350, "#b86d8a", "point"],
  [344, 100, 290, "#8fb4d9", "step"], [442, 118, 250, "#e6a064", "bell"],
];
const RIGHT: [number, number, number, string, Gable][] = [
  [1040, 118, 260, "#e6a064", "bell"], [1156, 100, 300, "#c4694a", "step"], [1254, 126, 350, "#8fb4d9", "point"],
  [1378, 104, 280, "#e6c06a", "bell"], [1480, 120, 330, "#b86d8a", "step"],
];

function Facade({ x, w, h, c, g }: { x: number; w: number; h: number; c: string; g: Gable }) {
  const top = 560 - h;
  const cols = w > 110 ? 3 : 2;
  const rows = Math.floor((h - 70) / 62);
  const roof =
    g === "step" ? `M${x} ${top} h${w * 0.2} v-22 h${w * 0.15} v-22 h${w * 0.3} v22 h${w * 0.15} v22 h${w * 0.2} Z`
    : g === "bell" ? `M${x} ${top} Q${x + w * 0.1} ${top - 34} ${x + w * 0.5} ${top - 44} Q${x + w * 0.9} ${top - 34} ${x + w} ${top} Z`
    : g === "point" ? `M${x - 4} ${top} L${x + w / 2} ${top - 62} L${x + w + 4} ${top} Z`
    : `M${x} ${top} h${w} v-12 h-${w} Z`;
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={c} {...O} strokeWidth={2.5} />
      <path d={roof} fill={g === "point" ? "#6a3d3a" : c} {...O} strokeWidth={2.5} />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, cc) => {
          const wx = x + 12 + cc * ((w - 24) / cols) + 2;
          const wy = top + 24 + r * 62;
          const ww = (w - 24) / cols - 10;
          return (
            <g key={`${r}-${cc}`}>
              <rect className="win-glow" style={{ animationDelay: `${((r * 3 + cc + x) % 7) * 0.4}s` }} x={wx} y={wy} width={ww} height={38} rx={3} fill="#ffd76a" {...O} strokeWidth={2} />
              <path d={`M${wx + ww / 2} ${wy} V${wy + 38} M${wx} ${wy + 19} H${wx + ww}`} stroke="#2b1b3d" strokeWidth={1.8} />
              <rect x={wx - 6} y={wy} width={5} height={38} fill="#2f6f5c" />
              <rect x={wx + ww + 1} y={wy} width={5} height={38} fill="#2f6f5c" />
            </g>
          );
        }),
      )}
      <rect x={x + w / 2 - 12} y={560 - 44} width={24} height={44} rx={3} fill="#4a2c17" {...O} strokeWidth={2} />
    </g>
  );
}

function Lantern({ x }: { x: number }) {
  return (
    <g>
      <circle cx={x} cy={560} r={70} fill="#ffd76a" opacity={0.12} className="win-glow" />
      <rect x={x - 4} y={560} width={8} height={150} fill="#2b1b3d" />
      <rect x={x - 12} y={540} width={24} height={26} rx={6} fill="#ffd76a" {...O} strokeWidth={2.5} className="win-glow" />
      <path d={`M${x - 14} 540 L${x} 524 L${x + 14} 540Z`} fill="#d62f2f" stroke="#ffc400" strokeWidth={2.5} strokeLinejoin="round" />
    </g>
  );
}

/** Statisch decor: het historische centrum van Delft aan een gracht, in avondlicht. */
const DelftScenery = memo(function DelftScenery() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="dl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e3a8a" />
          <stop offset="0.55" stopColor="#c76fa8" />
          <stop offset="1" stopColor="#ffb27a" />
        </linearGradient>
        <linearGradient id="dl-canal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#4d6fb8" />
          <stop offset="1" stopColor="#2c4b8a" />
        </linearGradient>
        <linearGradient id="dl-plaza" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9a2c4" />
          <stop offset="1" stopColor="#7d7699" />
        </linearGradient>
      </defs>

      <rect width={1600} height={600} fill="url(#dl-sky)" />
      {[[100, 60], [260, 150], [440, 50], [620, 110], [980, 70], [1160, 40], [1330, 130], [1500, 60], [1560, 170]].map(([x, y], i) => (
        <circle key={i} className="star" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y} r={3} fill="#fff" />
      ))}
      <circle cx={1180} cy={120} r={42} fill="#fff4c9" />
      <circle cx={1198} cy={110} r={38} fill="#d9a3c8" opacity={0.85} />

      {/* achtergrond: de Nieuwe Kerk met hoge toren */}
      <rect x={480} y={360} width={640} height={200} fill="#8a7aa6" opacity={0.7} />
      <rect x={760} y={210} width={80} height={350} fill="#b9876a" {...O} />
      <rect x={754} y={204} width={92} height={18} fill="#a0664b" {...O} strokeWidth={2.5} />
      <path d="M760 204 L800 66 L840 204Z" fill="#5b6a8f" {...O} />
      <path d="M800 66 V44" stroke="#ffc400" strokeWidth={5} />
      {[772, 828].map((x) => <path key={x} d={`M${x - 6} 214 L${x} 168 L${x + 6} 214Z`} fill="#5b6a8f" {...O} strokeWidth={2} />)}
      {[0, 1].map((i) => <rect key={i} x={778 + i * 26} y={232} width={18} height={52} rx={9} fill="#2b1b3d" />)}
      <circle cx={800} cy={330} r={16} fill="#fff6d8" {...O} strokeWidth={2.5} />
      <path d="M800 330 V320 M800 330 L808 334" stroke="#2b1b3d" strokeWidth={2.5} strokeLinecap="round" />
      <rect x={700} y={420} width={200} height={140} fill="#a0664b" {...O} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={716 + i * 46} y={440} width={22} height={60} rx={11} fill="#ffd76a" className="win-glow" {...O} strokeWidth={2} />)}

      {/* gevels links en rechts */}
      {LEFT.map(([x, w, h, c, g]) => <Facade key={`l${x}`} x={x} w={w} h={h} c={c} g={g} />)}
      {RIGHT.map(([x, w, h, c, g]) => <Facade key={`r${x}`} x={x} w={w} h={h} c={c} g={g} />)}

      {/* vlaggetjes tussen de huizen (Sinterklaas) */}
      <path d="M440 300 Q800 380 1160 300" fill="none" stroke="#2b1b3d" strokeWidth={3} opacity={0.6} />
      {Array.from({ length: 14 }, (_, i) => {
        const t = (i + 0.5) / 14;
        const x = 440 + t * 720;
        const y = 300 + Math.sin(Math.PI * t) * 66 * 0.9 + 4;
        return <path key={i} d={`M${x - 14} ${y} L${x + 14} ${y} L${x} ${y + 32}Z`} fill={["#d62f2f", "#fff", "#ffc400"][i % 3]} stroke="#2b1b3d" strokeWidth={2} />;
      })}

      {/* gracht */}
      <rect y={560} width={1600} height={86} fill="url(#dl-canal)" />
      <rect y={556} width={1600} height={8} fill="#8a7aa6" {...O} strokeWidth={2} />
      <g className="waves waves-a" fill="none" stroke="#ffd76a" strokeWidth={3} strokeLinecap="round" opacity={0.45}>
        {[[90, 590], [380, 616], [660, 592], [960, 618], [1250, 594], [1480, 614]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 14 -8 28 0 t 28 0 t 28 0`} />
        ))}
      </g>

      {/* plein */}
      <rect y={640} width={1600} height={420} fill="url(#dl-plaza)" />
      <rect y={640} width={1600} height={8} fill="#6a6388" />
      {Array.from({ length: 9 }, (_, r) => (
        <path key={r} d={`M0 ${660 + r * 28} H1600`} stroke="#6a6388" strokeWidth={2} opacity={0.5} />
      ))}
      {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 56} 648 L${i * 56 - 80} 900`} stroke="#6a6388" strokeWidth={1.5} opacity={0.35} />)}

      <Lantern x={100} />
      <Lantern x={520} />
      <Lantern x={1080} />
      <Lantern x={1500} />

      {/* cadeautjes en pepernoten op het plein */}
      <g>
        <rect x={400} y={676} width={46} height={36} fill="#2b6fd6" {...O} strokeWidth={2.5} />
        <path d="M423 676 V712 M400 694 H446" stroke="#ffc400" strokeWidth={5} />
        <rect x={430} y={656} width={34} height={30} fill="#d62f2f" {...O} strokeWidth={2.5} />
        <path d="M447 656 V686" stroke="#fff" strokeWidth={4} />
        {[1130, 1150, 1170].map((x, i) => <circle key={x} cx={x} cy={700 + i * 3} r={8} fill="#b9772f" {...O} strokeWidth={2} />)}
      </g>
    </g>
  );
});

export default DelftScenery;
