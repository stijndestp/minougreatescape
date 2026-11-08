"use client";

import type { CSSProperties } from "react";
import type { LineMood } from "@/content/dialogue";
import { dordrechtTexts as t } from "@/content/dordrecht";
import MinouSprite from "@/components/MinouSprite";
import { PietBust } from "@/components/PietSprite";
import { itemArt } from "../tilburg/itemArt";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

export type BorderMinou = "wait" | "walk";

interface Props {
  pietMood: LineMood;
  /** Verandert bij elk verkeerd voorwerp: Piet schudt zijn hoofd. */
  shakeKey: number;
  /** De pas vliegt naar Piet en wordt gecontroleerd. */
  checking: boolean;
  /** Stempel "goedgekeurd" zichtbaar. */
  stamped: boolean;
  barrierOpen: boolean;
  minou: BorderMinou;
}

const HOUSES: [number, number, number, string][] = [
  [60, 90, 150, "#d9825a"], [160, 80, 120, "#e6c06a"], [250, 100, 170, "#c4694a"], [360, 84, 130, "#8fb4d9"],
  [760, 96, 140, "#e6a064"], [866, 84, 164, "#b86d8a"], [960, 100, 124, "#d9825a"], [1330, 90, 146, "#e6c06a"],
  [1430, 86, 170, "#c4694a"], [1526, 80, 120, "#8fb4d9"],
];

/** Korte, geïllustreerde grenspost bij Dordrecht (vaste viewBox 1600 × 900). */
export default function BorderPost({ pietMood, shakeKey, checking, stamped, barrierOpen, minou }: Props) {
  const pass = itemArt.studentenpas;
  return (
    <svg
      className="border-svg"
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="De grenspost bij Dordrecht"
    >
      <defs>
        <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4a96" />
          <stop offset="0.6" stopColor="#d68db0" />
          <stop offset="1" stopColor="#ffc08a" />
        </linearGradient>
        <linearGradient id="dusk-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a7fc2" />
          <stop offset="1" stopColor="#35508f" />
        </linearGradient>
        <pattern id="barrier-stripes" width="64" height="26" patternUnits="userSpaceOnUse">
          <rect width="32" height="26" fill="#e53935" />
          <rect x="32" width="32" height="26" fill="#fff" />
        </pattern>
        <pattern id="booth-stripes" width="44" height="10" patternUnits="userSpaceOnUse">
          <rect width="22" height="10" fill="#ff8a2b" />
          <rect x="22" width="22" height="10" fill="#fff6e6" />
        </pattern>
        <clipPath id="booth-window">
          <rect x={1085} y={574} width={130} height={72} rx={6} />
        </clipPath>
      </defs>

      {/* avondlucht */}
      <rect width={1600} height={560} fill="url(#dusk)" />
      {[[120, 70], [300, 140], [520, 60], [760, 110], [1000, 50], [1200, 120], [1460, 70], [1540, 170]].map(([x, y], i) => (
        <circle key={i} className="star" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y} r={3} fill="#fff" />
      ))}
      <circle cx={1360} cy={130} r={44} fill="#fff4c9" />
      <circle cx={1378} cy={120} r={40} fill="#d9a3c8" opacity={0.9} />
      <g className="cloud cloud-a" opacity={0.6}><ellipse cx={300} cy={190} rx={90} ry={26} fill="#ffe0f0" /><ellipse cx={360} cy={174} rx={54} ry={24} fill="#ffe0f0" /></g>
      <g className="cloud cloud-c" opacity={0.5}><ellipse cx={1000} cy={230} rx={100} ry={26} fill="#ffe0f0" /></g>

      {/* alles hieronder staat 130 hoger zodat het boven de dialoog blijft */}
      <g transform="translate(0 -130)">
      {/* skyline van Dordrecht */}
      <rect x={0} y={420} width={1600} height={110} fill="#6b5a86" />
      {HOUSES.map(([x, w, h, c], i) => (
        <g key={i}>
          <path d={`M${x} ${540 - h} H${x + w} V540 H${x} Z`} fill={c} {...O} strokeWidth={2.5} />
          <path d={`M${x - 4} ${540 - h} L${x + w / 2} ${540 - h - 26} L${x + w + 4} ${540 - h} Z`} fill="#6a3d3a" {...O} strokeWidth={2.5} />
          {[0, 1, 2].map((r) => [0, 1].map((cc) => (
            <rect key={`${r}${cc}`} className="win-glow" style={{ animationDelay: `${(i + r + cc) * 0.5}s` }}
              x={x + 14 + cc * (w / 2 - 6)} y={540 - h + 18 + r * 36} width={w / 2 - 22} height={22} fill="#ffd76a" {...O} strokeWidth={2} />
          )))}
        </g>
      ))}
      {/* Grote Kerk met onvoltooide toren */}
      <path d="M520 540 V300 H620 V540 Z" fill="#b97d5e" {...O} />
      <path d="M514 300 H626 V324 H514 Z" fill="#a0664b" {...O} />
      <path d="M520 300 V270 H620 V300" fill="#c4906f" {...O} />
      <path d="M520 270 L570 214 L620 270 Z" fill="#5b4a6a" {...O} />
      <rect x={554} y={340} width={32} height={60} rx={16} fill="#2b1b3d" />
      <rect x={440} y={410} width={80} height={130} fill="#a0664b" {...O} />
      <rect x={620} y={410} width={90} height={130} fill="#a0664b" {...O} />
      <rect className="win-glow" x={558} y={346} width={24} height={48} rx={12} fill="#ffd76a" />

      {/* de rivier met lichtjes en een bootje */}
      <rect y={530} width={1600} height={110} fill="url(#dusk-river)" />
      <g className="waves waves-a" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.35}>
        {[[100, 566], [420, 590], [800, 570], [1180, 596], [1460, 572]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 16 -10 32 0 t 32 0 t 32 0`} />
        ))}
      </g>
      <g className="river-boat">
        <path d="M0 0 H110 L96 24 H14 Z" fill="#fff" {...O} />
        <rect x={34} y={-26} width={44} height={26} fill="#ff4d6d" {...O} />
        <rect x={50} y={-52} width={6} height={28} fill="#2b1b3d" />
        <path d="M56 -52 L88 -40 L56 -28Z" fill="#ffc400" {...O} strokeWidth={2} />
      </g>

      {/* gras en weg */}
      <path d="M0 626 Q400 610 800 624 T1600 616 V1100 H0Z" fill="#6cb85a" {...O} />
      <rect x={0} y={650} width={1600} height={108} fill="#5c5f73" />
      <rect x={0} y={644} width={1600} height={8} fill="#8a8da3" />
      <rect x={0} y={756} width={1600} height={8} fill="#8a8da3" />
      <path d="M20 704 H1580" stroke="#fff" strokeWidth={6} strokeDasharray="46 36" opacity={0.85} />

      {/* borden langs de weg */}
      <g>
        <rect x={166} y={500} width={10} height={150} fill="#7d8aa6" />
        <rect x={64} y={440} width={214} height={74} rx={10} fill="#fff" {...O} />
        <rect x={64} y={440} width={214} height={30} rx={10} fill="#e53935" {...O} />
        <text x={171} y={463} textAnchor="middle" fontSize={24} fontWeight={800} fill="#fff" fontFamily="sans-serif">{t.signLeft}</text>
        <text x={171} y={494} textAnchor="middle" fontSize={15} fontWeight={700} fill="#2b1b3d" fontFamily="sans-serif">{t.signLeftSub}</text>
      </g>
      <g>
        <rect x={1424} y={540} width={10} height={110} fill="#7d8aa6" />
        <rect x={1330} y={470} width={200} height={80} rx={10} fill="#fff" {...O} />
        <rect x={1330} y={470} width={200} height={30} rx={10} fill="#2b4fd1" {...O} />
        <text x={1430} y={493} textAnchor="middle" fontSize={24} fontWeight={800} fill="#fff" fontFamily="sans-serif">{t.signRight}</text>
        <text x={1430} y={525} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2b1b3d" fontFamily="sans-serif">{t.signRightSub}</text>
      </g>

      {/* douanehokje */}
      <g>
        <ellipse cx={1150} cy={662} rx={150} ry={14} fill="rgba(0,0,0,.25)" />
        <rect x={1040} y={536} width={220} height={126} fill="url(#booth-stripes)" {...O} />
        <path d="M1020 536 L1150 468 L1280 536 Z" fill="#c44a3a" {...O} />
        <path d="M1020 536 H1280" stroke="#2b1b3d" strokeWidth={4} />
        <rect x={1096} y={500} width={108} height={30} rx={6} fill="#243b7a" {...O} />
        <text x={1150} y={522} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily="sans-serif" letterSpacing={2}>{t.boothSign}</text>
        {/* vlag bovenop */}
        <rect x={1148} y={420} width={5} height={52} fill="#2b1b3d" />
        <g className="flag-wave">
          <rect x={1153} y={420} width={40} height={9} fill="#e53935" />
          <rect x={1153} y={429} width={40} height={9} fill="#fff" />
          <rect x={1153} y={438} width={40} height={9} fill="#2b4fd1" />
        </g>
        {/* raam met Piet */}
        <rect x={1085} y={574} width={130} height={72} rx={6} fill="#3a2a50" />
        <g clipPath="url(#booth-window)">
          <g key={shakeKey} className={shakeKey > 0 ? "piet-shake" : undefined} transform="translate(1096 570) scale(.72)">
            <PietBust variant="douane" mood={pietMood} />
          </g>
        </g>
        <rect x={1075} y={644} width={150} height={16} rx={4} fill="#c98a4b" {...O} />
        <rect x={1075} y={644} width={150} height={5} fill="#e3a768" />
        <path d="M1075 574 H1225" stroke="#2b1b3d" strokeWidth={4} />
        {/* lantaarn */}
        <circle cx={1060} cy={560} r={9} fill="#ffd76a" className="win-glow" {...O} strokeWidth={2} />
      </g>

      {/* slagboom: paal rechts, arm over de weg */}
      <g>
        <rect x={966} y={560} width={38} height={110} rx={6} fill="#e8eef7" {...O} />
        <rect x={966} y={560} width={38} height={26} rx={6} fill="#e53935" {...O} />
        <g className={barrierOpen ? "barrier-arm barrier-open" : "barrier-arm"}>
          <rect x={720} y={573} width={262} height={22} rx={5} fill="url(#barrier-stripes)" {...O} />
          <rect x={982} y={573} width={36} height={22} rx={5} fill="#2b1b3d" />
        </g>
        <circle cx={985} cy={584} r={9} fill="#ffc400" {...O} strokeWidth={2} />
      </g>

      {/* de studentenpas vliegt naar Piet en wordt gecontroleerd */}
      {checking && (
        <g transform="translate(470 610)">
          <g className="pass-fly" style={{ "--fx": "640px", "--fy": "36px" } as CSSProperties}>
            <g transform="scale(1.4)">{pass.render()}</g>
          </g>
        </g>
      )}
      {stamped && (
        <g className="stamp-pop" transform="translate(1150 420) rotate(-8)">
          <rect x={-108} y={-30} width={216} height={60} rx={8} fill="rgba(255,255,255,.92)" stroke="#2fb36d" strokeWidth={5} />
          <text textAnchor="middle" y={9} fontSize={30} fontWeight={800} fill="#1f8f55" fontFamily="sans-serif" letterSpacing={2}>{t.stamp}</text>
        </g>
      )}

      {/* Minou: wacht voor de slagboom en loopt na het openen door */}
      <g transform="translate(400 722) scale(1.45)">
        <g
          className={minou === "walk" ? "minou-marker minou-through" : "minou-marker"}
          data-walking={minou === "walk" ? "true" : "false"}
          data-facing="right"
          style={{ "--walk": "1000px" } as CSSProperties}
        >
          <MinouSprite />
        </g>
      </g>
      </g>
    </svg>
  );
}
