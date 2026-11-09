"use client";

import type { CSSProperties } from "react";
import type { LineMood } from "@/content/dialogue";
import { dordrechtTexts as t } from "@/content/dordrecht";
import type { HeroMood } from "@/components/MinouHero";
import MinouSprite from "@/components/MinouSprite";
import { PietBust } from "@/components/PietSprite";
import { itemArt } from "../tilburg/itemArt";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };

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
  /** Gezichtsuitdrukking van Minou (alleen weergave). */
  minouMood?: HeroMood;
}

/** Minou staat op 1.45× schaal; zo is haar lijnwerk even dik als in Rotterdam (1.3 / 1.45). */
const MINOU_SCALE = 1.45;
const MINOU_LINE = 1.3 / MINOU_SCALE;

type Gable = "step" | "bell" | "point";
const HOUSES: [number, number, number, string, Gable][] = [
  [60, 90, 150, "#d9825a", "step"], [160, 80, 120, "#e6c06a", "bell"], [250, 100, 170, "#c4694a", "point"], [360, 84, 130, "#8fb4d9", "step"],
  [760, 96, 140, "#e6a064", "bell"], [866, 84, 164, "#b86d8a", "step"], [960, 100, 124, "#d9825a", "point"], [1330, 90, 146, "#e6c06a", "bell"],
  [1430, 86, 170, "#c4694a", "step"], [1526, 80, 120, "#8fb4d9", "point"],
];

function roof(x: number, w: number, top: number, g: Gable) {
  if (g === "step") return `M${x} ${top} h${w * 0.2} v-14 h${w * 0.15} v-14 h${w * 0.3} v14 h${w * 0.15} v14 h${w * 0.2}Z`;
  if (g === "bell") return `M${x} ${top} Q${x + w * 0.08} ${top - 16} ${x + w * 0.22} ${top - 18} Q${x + w * 0.26} ${top - 36} ${x + w * 0.5} ${top - 40} Q${x + w * 0.74} ${top - 36} ${x + w * 0.78} ${top - 18} Q${x + w * 0.92} ${top - 16} ${x + w} ${top}Z`;
  return `M${x - 4} ${top} L${x + w / 2} ${top - 30} L${x + w + 4} ${top}Z`;
}

/** Korte, geïllustreerde grenspost bij Dordrecht (vaste viewBox 1600 × 900). */
export default function BorderPost({ pietMood, shakeKey, checking, stamped, barrierOpen, minou, minouMood = "neutral" }: Props) {
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
          <stop offset="0" stopColor="#2e3a8a" />
          <stop offset="0.6" stopColor="#c97fac" />
          <stop offset="1" stopColor="#ffc08a" />
        </linearGradient>
        <linearGradient id="dusk-river" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a7fc2" />
          <stop offset="1" stopColor="#2c4482" />
        </linearGradient>
        <linearGradient id="dd-road" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6a6d84" />
          <stop offset="1" stopColor="#4a4c60" />
        </linearGradient>
        <radialGradient id="dd-glow">
          <stop offset="0" stopColor="#ffd76a" stopOpacity=".6" />
          <stop offset="1" stopColor="#ffd76a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dd-vignette" cx=".5" cy=".45" r=".75">
          <stop offset=".6" stopColor="#1a1040" stopOpacity="0" />
          <stop offset="1" stopColor="#1a1040" stopOpacity=".45" />
        </radialGradient>
        <pattern id="barrier-stripes" width="64" height="26" patternUnits="userSpaceOnUse">
          <rect width="32" height="26" fill="#e53935" />
          <rect x="32" width="32" height="26" fill="#fff" />
        </pattern>
        <pattern id="booth-stripes" width="44" height="10" patternUnits="userSpaceOnUse">
          <rect width="22" height="10" fill="#ff8a2b" />
          <rect x="22" width="22" height="10" fill="#fff6e6" />
        </pattern>
        <pattern id="dd-tiles" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 12 Q6 4 12 12 Q18 4 24 12" fill="none" stroke="#8a2f22" strokeWidth={2} />
        </pattern>
        <clipPath id="booth-window">
          <rect x={1085} y={574} width={130} height={72} rx={6} />
        </clipPath>
      </defs>

      {/* avondlucht met maan en roze wolken */}
      <rect width={1600} height={560} fill="url(#dusk)" />
      {[[120, 70], [300, 140], [520, 60], [760, 110], [1000, 50], [1200, 120], [1460, 70], [1540, 170], [880, 160], [60, 200]].map(([x, y], i) => (
        <circle key={i} className="star" style={{ animationDelay: `${i * 0.4}s` }} cx={x} cy={y} r={2.6} fill="#fff" />
      ))}
      <circle cx={1360} cy={130} r={90} fill="url(#dd-glow)" opacity={0.6} />
      <circle cx={1360} cy={130} r={44} fill="#fff4c9" />
      <circle cx={1378} cy={120} r={40} fill="#d9a3c8" opacity={0.9} />
      <g className="cloud cloud-a" opacity={0.6}><ellipse cx={300} cy={190} rx={90} ry={26} fill="#ffe0f0" /><ellipse cx={360} cy={174} rx={54} ry={24} fill="#ffe0f0" /></g>
      <g className="cloud cloud-c" opacity={0.5}><ellipse cx={1000} cy={230} rx={100} ry={26} fill="#ffe0f0" /></g>

      {/* alles hieronder staat 130 hoger zodat het boven de dialoog blijft */}
      <g transform="translate(0 -130)">
      {/* skyline van Dordrecht: gevels met topgevels, luiken en verlichte ramen */}
      <rect x={0} y={420} width={1600} height={110} fill="#5d4f7c" />
      {HOUSES.map(([x, w, h, c, g], i) => {
        const top = 540 - h;
        return (
          <g key={i}>
            <path d={`M${x} ${top} H${x + w} V540 H${x} Z`} fill={c} {...O} strokeWidth={2.5} />
            <path d={roof(x, w, top, g)} fill={g === "point" ? "#6a3d3a" : c} {...O} strokeWidth={2.5} />
            <rect x={x - 2} y={top - 3} width={w + 4} height={6} fill="#f4ead8" stroke={INK} strokeWidth={1.5} />
            <rect x={x + w - 10} y={top} width={10} height={h} fill="rgba(20,0,40,.18)" />
            {[0, 1, 2].map((r) => [0, 1].map((cc) => {
              const wx = x + 14 + cc * (w / 2 - 6);
              const wy = top + 18 + r * 36;
              const ww = w / 2 - 22;
              return wy + 22 < 532 ? (
                <g key={`${r}${cc}`}>
                  <rect className="win-glow" style={{ animationDelay: `${(i + r + cc) * 0.5}s` }} x={wx} y={wy} width={ww} height={22} fill="#ffd76a" {...O} strokeWidth={2} />
                  <path d={`M${wx + ww / 2} ${wy} V${wy + 22}`} stroke={INK} strokeWidth={1.2} opacity={0.6} />
                  <rect x={wx - 5} y={wy} width={4} height={22} fill={i % 2 ? "#2f6f5c" : "#a8323a"} />
                </g>
              ) : null;
            }))}
          </g>
        );
      })}
      {/* Grote Kerk met de onvoltooide, plat afgesloten toren */}
      <rect x={440} y={410} width={80} height={130} fill="#a0664b" {...O} />
      <rect x={620} y={410} width={90} height={130} fill="#a0664b" {...O} />
      <path d="M440 410 L480 380 L520 410Z M620 410 L665 378 L710 410Z" fill="#6a3d3a" {...O} strokeWidth={2.5} />
      {[456, 488, 640, 676].map((x) => <path key={x} d={`M${x} 520 V450 Q${x + 9} 436 ${x + 18} 450 V520Z`} fill="#ffd76a" opacity={0.7} className="win-glow" />)}
      <path d="M520 540 V300 H620 V540 Z" fill="#b97d5e" {...O} />
      <path d="M514 300 H626 V324 H514 Z" fill="#a0664b" {...O} />
      <path d="M520 300 V262 H620 V300" fill="#c4906f" {...O} />
      <path d="M514 262 H626 V272 H514Z" fill="#8a5a42" {...O} strokeWidth={2} />
      {[514, 546, 578, 610].map((x) => <rect key={x} x={x} y={250} width={12} height={14} fill="#8a5a42" stroke={INK} strokeWidth={2} />)}
      <circle cx={570} cy={286} r={11} fill="#fff6d8" stroke={INK} strokeWidth={2} />
      <path d="M570 286 V279 M570 286 L575 289" stroke={INK} strokeWidth={2} strokeLinecap="round" />
      <rect x={554} y={340} width={32} height={60} rx={16} fill={INK} />
      <rect className="win-glow" x={558} y={346} width={24} height={48} rx={12} fill="#ffd76a" />
      <rect x={604} y={300} width={16} height={240} fill="rgba(20,0,40,.16)" />

      {/* de rivier met weerspiegelingen, lichtjes en een bootje */}
      <rect y={530} width={1600} height={110} fill="url(#dusk-river)" />
      {[[100, 70], [300, 60], [560, 60], [880, 60], [1380, 70], [1480, 60]].map(([x, w], i) => (
        <path key={i} className="reflect-shimmer" style={{ animationDelay: `${i * 0.6}s` }} d={`M${x} ${548 + (i % 3) * 14} h${w}`} stroke="#ffd76a" strokeWidth={4} strokeLinecap="round" opacity={0.4} />
      ))}
      <g className="waves waves-a" fill="none" stroke="#fff" strokeWidth={3} strokeLinecap="round" opacity={0.35}>
        {[[100, 566], [420, 590], [800, 570], [1180, 596], [1460, 572]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 16 -10 32 0 t 32 0 t 32 0`} />
        ))}
      </g>
      <g className="river-boat">
        <path d="M0 0 H110 L96 24 H14 Z" fill="#fff" {...O} />
        <path d="M8 8 H104" stroke="#2b4fd1" strokeWidth={3} />
        <rect x={34} y={-26} width={44} height={26} fill="#ff4d6d" {...O} />
        <rect x={42} y={-20} width={10} height={9} fill="#ffd76a" />
        <rect x={50} y={-52} width={6} height={28} fill={INK} />
        <path d="M56 -52 L88 -40 L56 -28Z" fill="#ffc400" {...O} strokeWidth={2} />
      </g>

      {/* gras, stoeprand en weg met perspectief */}
      <path d="M0 626 Q400 610 800 624 T1600 616 V1100 H0Z" fill="#6cb85a" {...O} />
      <path d="M0 636 Q400 622 800 634 T1600 626" fill="none" stroke="#9adf7f" strokeWidth={6} opacity={0.6} />
      <rect x={0} y={650} width={1600} height={108} fill="url(#dd-road)" />
      <rect x={0} y={644} width={1600} height={8} fill="#a5a8bc" />
      <rect x={0} y={652} width={1600} height={4} fill="#3a3c50" opacity={0.5} />
      <rect x={0} y={756} width={1600} height={8} fill="#a5a8bc" />
      <path d="M20 704 H1580" stroke="#fff" strokeWidth={6} strokeDasharray="46 36" opacity={0.85} />
      {[[80, 790], [520, 800], [1240, 796], [1500, 786]].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l6 -16 l4 14 l6 -20 l4 20 l6 -12 l2 14`} fill="#4fa83f" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      ))}

      {/* voorgrond: tulpenbed langs de weg (wiegt zacht) */}
      <path d="M0 846 Q800 828 1600 846 V880 H0Z" fill="#4f9a45" />
      {Array.from({ length: 27 }, (_, i) => {
        const x = 30 + i * 60;
        const y = 850 + (i % 2) * 6;
        const c = ["#e53935", "#ffc400", "#ff6fa8", "#ff8a2b"][i % 4];
        return (
          <g key={i} className="reed" style={{ animationDelay: `${(i % 5) * -0.7}s`, transformOrigin: `${x}px ${y}px` } as CSSProperties}>
            <path d={`M${x} ${y} V${y - 34}`} stroke="#2f7a3a" strokeWidth={3} />
            <path d={`M${x} ${y - 8} q-12 -4 -14 -18 q10 4 14 14`} fill="#3f9a5a" stroke={INK} strokeWidth={1.2} />
            <path d={`M${x - 9} ${y - 44} q0 14 9 14 q9 0 9 -14 l-4.5 5 l-4.5 -7 l-4.5 7z`} fill={c} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          </g>
        );
      })}

      {/* straatlantaarns met warme gloed */}
      {[700, 1320].map((x) => (
        <g key={x}>
          <circle className="lamp-glow" cx={x} cy={566} r={70} fill="url(#dd-glow)" />
          <ellipse cx={x} cy={646} rx={70} ry={10} fill="url(#dd-glow)" />
          <rect x={x - 3} y={570} width={6} height={76} fill={INK} />
          <path d={`M${x - 12} 552 L${x - 9} 572 H${x + 9} L${x + 12} 552Z`} fill="#ffd76a" {...O} strokeWidth={2} className="win-glow" />
          <path d={`M${x - 15} 552 L${x} 540 L${x + 15} 552Z`} fill={INK} />
        </g>
      ))}

      {/* borden langs de weg */}
      <g>
        <rect x={166} y={500} width={10} height={150} fill="#7d8aa6" stroke={INK} strokeWidth={1.5} />
        <rect x={64} y={440} width={214} height={74} rx={10} fill="#fff" {...O} />
        <rect x={64} y={440} width={214} height={30} rx={10} fill="#e53935" {...O} />
        <text x={171} y={463} textAnchor="middle" fontSize={24} fontWeight={800} fill="#fff" fontFamily="sans-serif">{t.signLeft}</text>
        <text x={171} y={494} textAnchor="middle" fontSize={15} fontWeight={700} fill={INK} fontFamily="sans-serif">{t.signLeftSub}</text>
      </g>
      <g>
        <rect x={1424} y={540} width={10} height={110} fill="#7d8aa6" stroke={INK} strokeWidth={1.5} />
        <rect x={1330} y={470} width={200} height={80} rx={10} fill="#fff" {...O} />
        <rect x={1330} y={470} width={200} height={30} rx={10} fill="#2b4fd1" {...O} />
        <text x={1430} y={493} textAnchor="middle" fontSize={24} fontWeight={800} fill="#fff" fontFamily="sans-serif">{t.signRight}</text>
        <text x={1430} y={525} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} fontFamily="sans-serif">{t.signRightSub}</text>
      </g>

      {/* douanehokje met pannendak, lamp en Piet achter het raam */}
      <g>
        <ellipse cx={1150} cy={662} rx={150} ry={14} fill="rgba(0,0,0,.25)" />
        <rect x={1040} y={536} width={220} height={126} fill="url(#booth-stripes)" {...O} />
        <rect x={1240} y={538} width={18} height={122} fill="rgba(20,0,40,.18)" />
        <path d="M1020 536 L1150 468 L1280 536 Z" fill="#c44a3a" {...O} />
        <path d="M1034 528 L1150 476 L1266 528Z" fill="url(#dd-tiles)" opacity={0.7} />
        <path d="M1020 536 H1280" stroke={INK} strokeWidth={4} />
        <rect x={1096} y={500} width={108} height={30} rx={6} fill="#243b7a" {...O} />
        <text x={1150} y={522} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily="sans-serif" letterSpacing={2}>{t.boothSign}</text>
        {/* vlag bovenop */}
        <rect x={1148} y={420} width={5} height={52} fill={INK} />
        <circle cx={1150} cy={418} r={4} fill="#ffc400" stroke={INK} strokeWidth={1.5} />
        <g className="flag-wave">
          <rect x={1153} y={420} width={40} height={9} fill="#e53935" />
          <rect x={1153} y={429} width={40} height={9} fill="#fff" />
          <rect x={1153} y={438} width={40} height={9} fill="#2b4fd1" />
        </g>
        {/* raam met Piet in warm lamplicht */}
        <rect x={1085} y={574} width={130} height={72} rx={6} fill="#4a3460" />
        <g clipPath="url(#booth-window)">
          <circle className="lamp-glow" cx={1150} cy={590} r={70} fill="url(#dd-glow)" />
          <g key={shakeKey} className={shakeKey > 0 ? "piet-shake" : undefined} transform="translate(1096 570) scale(.72)">
            <PietBust variant="douane" mood={pietMood} />
          </g>
          <path d="M1092 580 L1110 580 L1092 610Z" fill="#fff" opacity={0.15} />
        </g>
        <rect x={1085} y={574} width={130} height={72} rx={6} fill="none" stroke="#fff6e6" strokeWidth={4} />
        <rect x={1075} y={644} width={150} height={16} rx={4} fill="#c98a4b" {...O} />
        <rect x={1075} y={644} width={150} height={5} fill="#e3a768" />
        <path d="M1075 574 H1225" stroke={INK} strokeWidth={4} />
        {/* lantaarn aan het hokje */}
        <circle cx={1060} cy={560} r={30} fill="url(#dd-glow)" className="lamp-glow" />
        <circle cx={1060} cy={560} r={9} fill="#ffd76a" className="win-glow" {...O} strokeWidth={2} />
      </g>

      {/* slagboom: paal rechts, arm over de weg, knipperende waarschuwingslampjes */}
      <g>
        <ellipse cx={985} cy={672} rx={30} ry={6} fill="rgba(0,0,0,.25)" />
        <rect x={966} y={560} width={38} height={110} rx={6} fill="#e8eef7" {...O} />
        <rect x={966} y={560} width={38} height={26} rx={6} fill="#e53935" {...O} />
        <rect x={994} y={588} width={8} height={80} fill="rgba(20,0,40,.15)" />
        <g className={barrierOpen ? "barrier-arm barrier-open" : "barrier-arm"}>
          <rect x={720} y={573} width={262} height={22} rx={5} fill="url(#barrier-stripes)" {...O} />
          <rect x={724} y={576} width={254} height={4} rx={2} fill="#fff" opacity={0.4} />
          <rect x={982} y={573} width={36} height={22} rx={5} fill={INK} />
          {[740, 860].map((x, i) => (
            <circle key={x} className="dd-blink" style={{ animationDelay: `${i * 0.5}s` }} cx={x} cy={570} r={6} fill="#ff5a5a" stroke={INK} strokeWidth={1.6} />
          ))}
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
          <rect x={-100} y={-22} width={200} height={44} rx={5} fill="none" stroke="#2fb36d" strokeWidth={2} />
          <text textAnchor="middle" y={9} fontSize={30} fontWeight={800} fill="#1f8f55" fontFamily="sans-serif" letterSpacing={2}>{t.stamp}</text>
        </g>
      )}

      {/* Minou (zelfde personage als overal): wacht voor de slagboom en loopt na het openen door */}
      <g transform={`translate(400 722) scale(${MINOU_SCALE})`}>
        <g
          className={minou === "walk" ? "minou-marker minou-through" : "minou-marker"}
          data-walking={minou === "walk" ? "true" : "false"}
          data-facing="right"
          style={{ "--walk": "1000px" } as CSSProperties}
        >
          <MinouSprite mood={minouMood} line={MINOU_LINE} />
        </g>
      </g>
      </g>

      <rect width={1600} height={900} fill="url(#dd-vignette)" pointerEvents="none" aria-hidden />
    </svg>
  );
}
