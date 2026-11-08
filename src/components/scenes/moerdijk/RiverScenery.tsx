import { memo } from "react";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

/**
 * Decor van het Hollands Diep: lucht, wolken, water, beide oevers en de
 * (kapotte) bestaande brugdelen. Bevat bewust GEEN silhouetten van de zoekende
 * onderdelen, zodat de oplossing niet verraden wordt. Statisch (memo).
 */
const RiverScenery = memo(function RiverScenery() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd0ff" />
          <stop offset="1" stopColor="#d9f2ff" />
        </linearGradient>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6dd0f2" />
          <stop offset="1" stopColor="#2f9fd0" />
        </linearGradient>
      </defs>

      <rect width={1600} height={520} fill="url(#sky)" />
      <circle cx={1340} cy={110} r={58} fill="#ffe27a" opacity={0.95} />
      <circle cx={1340} cy={110} r={92} fill="#ffe27a" opacity={0.22} />

      {/* wolken (drijven langzaam) */}
      <g className="cloud cloud-a"><ellipse cx={260} cy={110} rx={90} ry={32} fill="#fff" /><ellipse cx={330} cy={92} rx={60} ry={30} fill="#fff" /><ellipse cx={200} cy={96} rx={52} ry={26} fill="#fff" /></g>
      <g className="cloud cloud-b"><ellipse cx={780} cy={70} rx={80} ry={26} fill="#fff" opacity={0.9} /><ellipse cx={840} cy={56} rx={50} ry={24} fill="#fff" opacity={0.9} /></g>
      <g className="cloud cloud-c"><ellipse cx={1120} cy={170} rx={100} ry={30} fill="#fff" opacity={0.85} /><ellipse cx={1190} cy={152} rx={58} ry={28} fill="#fff" opacity={0.85} /></g>

      {/* de overkant: Dordrecht in de verte */}
      <rect x={1180} y={376} width={420} height={60} fill="#a9c27a" />
      {[[1230, 34, 40, "#d9825a"], [1274, 46, 34, "#e6a064"], [1324, 30, 44, "#c4694a"], [1362, 40, 30, "#e6a064"], [1520, 36, 38, "#d9825a"], [1560, 40, 32, "#c4694a"]].map(([x, w, h, c], i) => (
        <g key={i}>
          <rect x={x as number} y={400 - (h as number)} width={w as number} height={h as number} fill={c as string} {...O} strokeWidth={2} />
          <path d={`M${(x as number) - 3} ${400 - (h as number)} L${(x as number) + (w as number) / 2} ${400 - (h as number) - 16} L${(x as number) + (w as number) + 3} ${400 - (h as number)}Z`} fill="#8a4a38" {...O} strokeWidth={2} />
        </g>
      ))}
      {/* Grote Kerk-achtige toren */}
      <rect x={1416} y={316} width={36} height={84} fill="#c9835f" {...O} strokeWidth={2.5} />
      <rect x={1410} y={300} width={48} height={22} fill="#b86d4a" {...O} strokeWidth={2.5} />
      <path d="M1410 300 L1434 270 L1458 300Z" fill="#6b4a3a" {...O} strokeWidth={2.5} />

      {/* linkeroever (Brabant) in de verte */}
      <path d="M0 400 Q160 380 300 410 L380 470 L0 520Z" fill="#8fd97a" {...O} strokeWidth={2.5} />
      {[[70, 410], [150, 400], [235, 408]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 6} y={y - 6} width={12} height={34} fill="#8a5a2b" />
          <circle cx={x} cy={y - 26} r={32} fill="#3fae5a" {...O} strokeWidth={2.5} />
        </g>
      ))}

      {/* water */}
      <rect y={448} width={1600} height={452} fill="url(#river)" />
      <g className="waves waves-a" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" opacity={0.55}>
        {[[100, 560], [520, 600], [940, 570], [1340, 610], [300, 660], [760, 690], [1200, 670], [1500, 560]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 20 -14 40 0 t 40 0 t 40 0`} />
        ))}
      </g>
      <g className="waves waves-b" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.4}>
        {[[60, 620], [700, 540], [1080, 640], [1420, 700], [420, 560]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 16 -10 32 0 t 32 0`} />
        ))}
      </g>
      <g className="sparkles">
        {[[420, 520], [980, 600], [1260, 560], [640, 640]].map(([x, y], i) => (
          <path key={i} className="sparkle" style={{ animationDelay: `${i * 0.7}s` }} d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2}Z`} fill="#fff" />
        ))}
      </g>

      {/* rechteroever (Dordrecht-kant) */}
      <path d="M1230 470 L1290 418 L1600 418 V540 Q1380 520 1230 470Z" fill="#8fd97a" {...O} strokeWidth={2.5} />

      {/* bestaande brug: oprit, pijlerstompen, wegdek links en rechts (kapot in het midden) */}
      <rect x={330} y={458} width={34} height={150} fill="#7d8aa6" {...O} strokeWidth={2.5} />
      <rect x={1236} y={458} width={34} height={150} fill="#7d8aa6" {...O} strokeWidth={2.5} />
      <rect x={110} y={418} width={575} height={40} rx={4} fill="#8896ab" {...O} />
      <rect x={915} y={418} width={575} height={40} rx={4} fill="#8896ab" {...O} />
      <path d="M130 428 H675 M935 428 H1470" stroke="#fff" strokeWidth={3} strokeDasharray="22 16" opacity={0.75} />
      {/* leuning */}
      <path d="M120 398 H685 M915 398 H1480" stroke="#e8eef7" strokeWidth={6} strokeLinecap="round" />
      {Array.from({ length: 12 }, (_, i) => <path key={`l${i}`} d={`M${130 + i * 50} 398 V418`} stroke="#e8eef7" strokeWidth={4} />)}
      {Array.from({ length: 12 }, (_, i) => <path key={`r${i}`} d={`M${935 + i * 46} 398 V418`} stroke="#e8eef7" strokeWidth={4} />)}
      {/* dunne stalen draagbogen (zonder de ontbrekende delen) */}
      <path d="M345 418 Q500 300 690 258" fill="none" stroke="#f2793f" strokeWidth={14} strokeLinecap="round" />
      <path d="M1255 418 Q1100 300 910 258" fill="none" stroke="#f2793f" strokeWidth={14} strokeLinecap="round" />
    </g>
  );
});

export default RiverScenery;
