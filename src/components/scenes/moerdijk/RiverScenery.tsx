import { memo, type CSSProperties } from "react";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };

/**
 * Decor van het Hollands Diep: lucht, wolken, water, beide oevers en de
 * (kapotte) bestaande brugdelen. Bevat bewust GEEN silhouetten van de zoekende
 * onderdelen, en houdt het gebied rond de openingen (midden van de brug) vrij,
 * zodat de oplossing niet verraden wordt. Statisch (memo).
 */

const CLOUD = (cx: number, cy: number, s: number) =>
  `M${cx - 90 * s} ${cy} q${-10 * s} ${-34 * s} ${30 * s} ${-36 * s} q${14 * s} ${-30 * s} ${54 * s} ${-18 * s} q${30 * s} ${-20 * s} ${58 * s} ${8 * s} q${36 * s} ${-2 * s} ${38 * s} ${46 * s}Z`;

function Cloud({ cx, cy, s, cls, o = 1 }: { cx: number; cy: number; s: number; cls: string; o?: number }) {
  return (
    <g className={`cloud ${cls}`} opacity={o}>
      <path d={CLOUD(cx, cy + 6 * s, s)} fill="#cfe6f7" />
      <path d={CLOUD(cx, cy, s)} fill="#fff" />
    </g>
  );
}

const RiverScenery = memo(function RiverScenery() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5fbfff" />
          <stop offset=".7" stopColor="#bfe7ff" />
          <stop offset="1" stopColor="#ffe9c4" />
        </linearGradient>
        <linearGradient id="river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fd6f5" />
          <stop offset=".35" stopColor="#3fb0de" />
          <stop offset="1" stopColor="#1f7fb3" />
        </linearGradient>
        <linearGradient id="deck" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a3b0c6" />
          <stop offset="1" stopColor="#77839c" />
        </linearGradient>
        <linearGradient id="pillar" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9aa6bd" />
          <stop offset=".4" stopColor="#c3cddd" />
          <stop offset="1" stopColor="#6f7b94" />
        </linearGradient>
        <radialGradient id="sun-glow">
          <stop offset=".3" stopColor="#fff2a8" stopOpacity=".6" />
          <stop offset="1" stopColor="#fff2a8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9f0ff" stopOpacity="0" />
          <stop offset="1" stopColor="#d9f0ff" stopOpacity=".55" />
        </linearGradient>
      </defs>

      {/* lucht met zon, stralen en wolken in lagen */}
      <rect width={1600} height={520} fill="url(#sky)" />
      <circle cx={1340} cy={110} r={170} fill="url(#sun-glow)" />
      <g className="sun-rays" style={{ transformOrigin: "1340px 110px" } as CSSProperties}>
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M1340 110 L1332 -10 L1348 -10Z" fill="#fff7c2" opacity={0.35} transform={`rotate(${i * 30} 1340 110)`} />
        ))}
      </g>
      <circle cx={1340} cy={110} r={58} fill="#ffe27a" stroke="#ffc400" strokeWidth={4} />
      <circle cx={1322} cy={92} r={14} fill="#fff6c8" opacity={0.8} />
      <Cloud cx={290} cy={120} s={1.2} cls="cloud-a" />
      <Cloud cx={820} cy={80} s={0.9} cls="cloud-b" o={0.95} />
      <Cloud cx={1150} cy={190} s={1.1} cls="cloud-c" o={0.9} />
      {/* meeuwen */}
      {[[560, 150, 0], [610, 176, -1.5], [660, 140, -3]].map(([x, y, d], i) => (
        <g key={i} className="gull" style={{ animationDelay: `${d}s` }}>
          <path d={`M${x - 14} ${y} q7 -9 14 0 q7 -9 14 0`} fill="none" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        </g>
      ))}

      {/* de overkant: Dordrecht in de verte, nevelig */}
      <rect x={1180} y={376} width={420} height={60} fill="#9fbf7a" />
      {[[1230, 34, 40, "#d9825a"], [1274, 46, 34, "#e6a064"], [1324, 30, 44, "#c4694a"], [1362, 40, 30, "#e6a064"], [1520, 36, 38, "#d9825a"], [1560, 40, 32, "#c4694a"]].map(([x, w, h, c], i) => (
        <g key={i}>
          <rect x={x as number} y={400 - (h as number)} width={w as number} height={h as number} fill={c as string} {...O} strokeWidth={2} />
          <path d={`M${(x as number) - 3} ${400 - (h as number)} L${(x as number) + (w as number) / 2} ${400 - (h as number) - 16} L${(x as number) + (w as number) + 3} ${400 - (h as number)}Z`} fill="#8a4a38" {...O} strokeWidth={2} />
          <rect x={(x as number) + 6} y={406 - (h as number)} width={7} height={8} fill="#fff4c9" opacity={0.8} />
          <rect x={(x as number) + (w as number) - 13} y={406 - (h as number)} width={7} height={8} fill="#fff4c9" opacity={0.8} />
        </g>
      ))}
      {/* Grote Kerk met vierkante toren en klok */}
      <rect x={1416} y={316} width={36} height={84} fill="#c9835f" {...O} strokeWidth={2.5} />
      <rect x={1410} y={300} width={48} height={22} fill="#b86d4a" {...O} strokeWidth={2.5} />
      <path d="M1410 300 L1434 270 L1458 300Z" fill="#6b4a3a" {...O} strokeWidth={2.5} />
      <circle cx={1434} cy={334} r={7} fill="#fff6d8" stroke={INK} strokeWidth={1.6} />
      <path d="M1426 360 V380 Q1434 372 1442 380 V360" fill="#4b3a5c" />
      <rect x={1180} y={300} width={420} height={136} fill="url(#haze)" />

      {/* linkeroever (Brabant) in de verte, met molen en bomen */}
      <path d="M0 400 Q160 380 300 410 L380 470 L0 520Z" fill="#8fd97a" {...O} strokeWidth={2.5} />
      <path d="M10 410 Q160 392 290 418" fill="none" stroke="#b8ee9f" strokeWidth={6} strokeLinecap="round" opacity={0.7} />
      <g>
        <path d="M22 404 L30 330 H54 L62 404Z" fill="#e8d9c0" {...O} strokeWidth={2.5} />
        <path d="M26 330 L42 308 L58 330Z" fill="#8a4a38" {...O} strokeWidth={2.5} />
        <rect x={36} y={376} width={12} height={28} rx={6} fill="#6b4a3a" />
        <g className="mill-sails" style={{ transformOrigin: "42px 326px" } as CSSProperties}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a} 42 326)`}>
              <path d="M42 326 L39 266 H45Z" fill="#6b4a3a" />
              <rect x={44} y={270} width={12} height={50} fill="#fff" stroke={INK} strokeWidth={1.6} />
              <path d="M44 286 h12 M44 302 h12" stroke={INK} strokeWidth={1.2} />
            </g>
          ))}
          <circle cx={42} cy={326} r={5} fill="#ffc400" stroke={INK} strokeWidth={1.6} />
        </g>
      </g>
      {[[70, 410], [150, 400], [215, 412]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 6} y={y - 6} width={12} height={34} fill="#8a5a2b" />
          <circle cx={x} cy={y - 26} r={32} fill="#3fae5a" {...O} strokeWidth={2.5} />
          <circle cx={x - 10} cy={y - 36} r={12} fill="#6fcf7a" opacity={0.7} />
        </g>
      ))}

      {/* water met diepte, golfjes en glinsteringen */}
      <rect y={448} width={1600} height={452} fill="url(#river)" />
      <rect y={448} width={1600} height={10} fill="#fff" opacity={0.25} />
      {/* weerspiegeling van de pijlers en het wegdek */}
      <g opacity={0.22}>
        <rect x={330} y={608} width={34} height={90} fill="#2b3f66" />
        <rect x={1236} y={608} width={34} height={90} fill="#2b3f66" />
      </g>
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
        {[[420, 520], [980, 600], [1260, 560], [640, 640], [1480, 620]].map(([x, y], i) => (
          <path key={i} className="sparkle" style={{ animationDelay: `${i * 0.7}s` }} d={`M${x} ${y - 8} L${x + 2} ${y - 2} L${x + 8} ${y} L${x + 2} ${y + 2} L${x} ${y + 8} L${x - 2} ${y + 2} L${x - 8} ${y} L${x - 2} ${y - 2}Z`} fill="#fff" />
        ))}
      </g>

      {/* rechteroever (Dordrecht-kant) met riet en stenen */}
      <path d="M1230 470 L1290 418 L1600 418 V540 Q1380 520 1230 470Z" fill="#8fd97a" {...O} strokeWidth={2.5} />
      <path d="M1250 470 Q1400 512 1600 528" fill="none" stroke="#5fae4a" strokeWidth={6} opacity={0.6} />
      {[[1300, 478], [1340, 492], [1520, 520], [1560, 524]].map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx={14} ry={8} fill="#a3a9b8" {...O} strokeWidth={2} />
      ))}
      {[1380, 1420, 1460, 1490].map((x, i) => (
        <g key={x} className="reed" style={{ animationDelay: `${i * -0.6}s`, transformOrigin: `${x}px 512px` } as CSSProperties}>
          <path d={`M${x} 512 Q${x - 4} 480 ${x + 2} 456 M${x + 8} 514 Q${x + 10} 484 ${x + 16} 466`} fill="none" stroke="#3f8a3a" strokeWidth={3} strokeLinecap="round" />
          <ellipse cx={x + 2} cy={458} rx={3} ry={9} fill="#8a5a2b" />
        </g>
      ))}
      {/* vrachtschip dat zacht dobbert bij de rechteroever */}
      <g className="barge-bob">
        <path d="M1330 600 H1530 L1510 630 H1350Z" fill="#2b3f66" {...O} />
        <rect x={1350} y={586} width={150} height={16} fill="#e0642a" stroke={INK} strokeWidth={2.5} />
        <rect x={1470} y={560} width={34} height={28} fill="#fff" stroke={INK} strokeWidth={2.5} />
        <rect x={1476} y={566} width={10} height={9} fill="#5cc4ee" />
        <path d="M1500 560 V540" stroke={INK} strokeWidth={3} />
        <path d="M1500 540 h16 v8 h-16" fill="#e53935" stroke={INK} strokeWidth={1.6} />
        <path d="M1340 618 H1520" stroke="#fff" strokeWidth={2} opacity={0.5} />
      </g>

      {/* bestaande brug: pijlers, wegdek met klinknagels, leuning en stalen bogen */}
      {[330, 1236].map((x) => (
        <g key={x}>
          <rect x={x} y={458} width={34} height={150} fill="url(#pillar)" {...O} strokeWidth={2.5} />
          <rect x={x - 6} y={590} width={46} height={18} fill="#6f7b94" {...O} strokeWidth={2.5} />
          <path d={`M${x} 578 H${x + 34}`} stroke="#5aa7c9" strokeWidth={3} opacity={0.6} />
        </g>
      ))}
      {[[110, 685], [915, 1490]].map(([a, b]) => (
        <g key={a}>
          <rect x={a} y={418} width={b - a} height={40} rx={4} fill="url(#deck)" {...O} />
          <rect x={a + 4} y={450} width={b - a - 8} height={6} fill="#5f6a82" />
          {Array.from({ length: Math.floor((b - a) / 40) }, (_, i) => (
            <circle key={i} cx={a + 20 + i * 40} cy={452} r={2.2} fill="#d9e1ee" />
          ))}
        </g>
      ))}
      <path d="M130 428 H675 M935 428 H1470" stroke="#fff" strokeWidth={3} strokeDasharray="22 16" opacity={0.75} />
      {/* leuning met lantaarnpaaltjes */}
      <path d="M120 398 H685 M915 398 H1480" stroke="#e8eef7" strokeWidth={6} strokeLinecap="round" />
      <path d="M120 398 H685 M915 398 H1480" stroke={INK} strokeWidth={1.5} opacity={0.4} transform="translate(0 4)" />
      {Array.from({ length: 12 }, (_, i) => <path key={`l${i}`} d={`M${130 + i * 50} 398 V418`} stroke="#e8eef7" strokeWidth={4} />)}
      {Array.from({ length: 12 }, (_, i) => <path key={`r${i}`} d={`M${935 + i * 46} 398 V418`} stroke="#e8eef7" strokeWidth={4} />)}
      {[150, 650, 950, 1450].map((x) => (
        <g key={x}>
          <path d={`M${x} 398 V362`} stroke={INK} strokeWidth={4} />
          <circle cx={x} cy={358} r={7} fill="#fff4c9" stroke={INK} strokeWidth={2} />
        </g>
      ))}
      {/* stalen draagbogen met inktrand en lichtrand */}
      <path d="M345 418 Q500 300 690 258" fill="none" stroke={INK} strokeWidth={19} strokeLinecap="round" />
      <path d="M1255 418 Q1100 300 910 258" fill="none" stroke={INK} strokeWidth={19} strokeLinecap="round" />
      <path d="M345 418 Q500 300 690 258" fill="none" stroke="#f2793f" strokeWidth={14} strokeLinecap="round" />
      <path d="M1255 418 Q1100 300 910 258" fill="none" stroke="#f2793f" strokeWidth={14} strokeLinecap="round" />
      <path d="M350 410 Q500 298 686 256" fill="none" stroke="#ffb07a" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      <path d="M1250 410 Q1100 298 914 256" fill="none" stroke="#ffb07a" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
    </g>
  );
});

export default RiverScenery;
