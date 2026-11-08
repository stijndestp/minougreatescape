"use client";

import { memo, type CSSProperties } from "react";
import MinouSprite from "@/components/MinouSprite";
import { texts as t, trains as allTrains } from "@/content/rotterdam";
import type { TrainDef } from "@/game/rotterdam";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

/** Plek van elk perron in de scène (x linksboven, y = bovenkant van de trein). */
const TRAIN_W = 440;
const TRAIN_Y = 420;
const TRAIN_XS = [60, 580, 1100];
/** Wijst een trein naar links of rechts (Dordrecht-kant naar links). */
const faceLeft = (tr: TrainDef) => tr.heading === "dordrecht";

const MINOU = { x: 170, y: 610, scale: 1.3 };

interface Props {
  /** Trein die oplicht (het juiste perron). */
  litTrainId: string | null;
  /** Trein die net verkeerd gekozen is (korte afkeuringsanimatie). */
  flash: { trainId: string; key: number } | null;
  /** Trein waarin Minou stapt en die vertrekt. */
  boardTrainId: string;
  minou: "idle" | "boarding" | "gone";
  departing: boolean;
  /** Gezette omroep: de speaker in het station trilt. */
  announcing: boolean;
}

const TRAVELLERS: { x: number; y: number; hat: "mijter" | "piet" | "muts" | "none"; body: string; bag: boolean; dir: number; delay: number; scale: number }[] = [
  { x: 330, y: 636, hat: "mijter", body: "#d62f2f", bag: true, dir: 1, delay: 0, scale: 0.85 },
  { x: 480, y: 700, hat: "none", body: "#2b6fd6", bag: false, dir: -1, delay: -2, scale: 0.8 },
  { x: 700, y: 644, hat: "piet", body: "#7a5cc2", bag: true, dir: 1, delay: -4, scale: 0.85 },
  { x: 880, y: 708, hat: "muts", body: "#2fb36d", bag: false, dir: -1, delay: -1, scale: 0.8 },
  { x: 1010, y: 632, hat: "none", body: "#ff8a2b", bag: true, dir: 1, delay: -3, scale: 0.85 },
  { x: 1180, y: 704, hat: "mijter", body: "#fff", bag: false, dir: -1, delay: -5, scale: 0.8 },
  { x: 1300, y: 646, hat: "piet", body: "#e54b8a", bag: true, dir: 1, delay: -2.5, scale: 0.85 },
];

function Traveller({ x, y, hat, body, bag, dir, delay, scale }: (typeof TRAVELLERS)[number]) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="walker" style={{ animationDelay: `${delay}s`, "--wd": `${dir * 46}px` } as CSSProperties}>
        <g className="bob" style={{ animationDelay: `${delay}s` }}>
          <ellipse cx={0} cy={0} rx={24} ry={7} fill="rgba(0,0,0,.18)" />
          <rect x={-12} y={-34} width={9} height={34} rx={4} fill="#3a2f55" />
          <rect x={3} y={-34} width={9} height={34} rx={4} fill="#3a2f55" />
          <rect x={-18} y={-86} width={36} height={56} rx={14} fill={body} {...O} strokeWidth={2.5} />
          <circle cx={0} cy={-102} r={15} fill="#ffd9b8" {...O} strokeWidth={2.5} />
          {hat === "mijter" && <path d="M-13 -112 L0 -142 L13 -112 Z" fill="#d62f2f" stroke="#ffc400" strokeWidth={3} strokeLinejoin="round" />}
          {hat === "piet" && (
            <>
              <ellipse cx={0} cy={-114} rx={19} ry={8} fill="#7a5cc2" {...O} strokeWidth={2.5} />
              <path d="M8 -116 Q26 -134 22 -142 Q16 -128 6 -122Z" fill="#ff4d9a" />
            </>
          )}
          {hat === "muts" && (
            <>
              <path d="M-15 -108 Q0 -136 15 -108 Z" fill="#fff" {...O} strokeWidth={2.5} />
              <circle cx={0} cy={-134} r={5} fill="#d62f2f" />
            </>
          )}
          {hat === "none" && <path d="M-15 -104 Q0 -126 15 -104 Q0 -112 -15 -104Z" fill="#4a2c17" />}
          {bag && (
            <>
              <rect x={20} y={-34} width={26} height={30} rx={4} fill="#c98a4b" {...O} strokeWidth={2.5} />
              <path d="M27 -34 V-40 H39 V-34" fill="none" stroke="#2b1b3d" strokeWidth={2.5} />
            </>
          )}
        </g>
      </g>
    </g>
  );
}

function Train({ tr, lit }: { tr: TrainDef; lit: boolean }) {
  const left = faceLeft(tr);
  const mirror = left ? `translate(${TRAIN_W} 0) scale(-1 1)` : undefined;
  const win = lit ? "#fff3a6" : "#2b3f66";
  return (
    <g className={lit ? "train train-lit" : "train"} data-train={tr.id}>
      <g transform={mirror}>
        {/* wielen en rails */}
        <rect x={10} y={146} width={TRAIN_W - 20} height={8} fill="#6b6f86" />
        {[50, 130, 310, 390].map((cx) => (
          <circle key={cx} cx={cx} cy={142} r={11} fill="#2b2b3d" {...O} strokeWidth={2.5} />
        ))}
        {/* romp */}
        <rect x={0} y={0} width={TRAIN_W} height={140} rx={26} fill="#ffc917" {...O} />
        <path d="M0 98 H440 V114 Q440 140 414 140 H26 Q0 140 0 114Z" fill="#0a3d9e" {...O} />
        <rect x={10} y={10} width={TRAIN_W - 20} height={8} rx={4} fill="#fff" opacity={0.45} />
        {/* ramen en deuren */}
        {[30, 100, 240, 310].map((wx) => (
          <rect key={wx} className="t-win" x={wx} y={26} width={52} height={46} rx={7} fill={win} {...O} strokeWidth={2.5} />
        ))}
        {[168, 198].map((dx) => (
          <rect key={dx} x={dx} y={20} width={28} height={86} rx={4} fill={lit ? "#ffe27a" : "#d49a00"} {...O} strokeWidth={2.5} />
        ))}
        <path d="M196 24 V102" stroke="#2b1b3d" strokeWidth={2.5} />
        {/* neus met voorruit en lamp */}
        <path d="M388 22 Q430 26 436 66 V94 H388Z" fill={win} {...O} strokeWidth={2.5} />
        <circle cx={424} cy={112} r={7} fill="#fff7c2" {...O} strokeWidth={2} />
        <circle cx={400} cy={112} r={4} fill="#d62f2f" />
      </g>
      {/* opschrift (niet gespiegeld) */}
      <text x={TRAIN_W / 2} y={120} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff" fontFamily="sans-serif" letterSpacing={4}>
        {t.kindLabel[tr.kind].toUpperCase()}
      </text>
      {/* bestemmingsdisplay op de neus */}
      <rect x={left ? 8 : TRAIN_W - 104} y={4} width={96} height={14} rx={3} fill="#14172b" />
      <text x={left ? 56 : TRAIN_W - 56} y={15} textAnchor="middle" fontSize={11} fontWeight={800} fill="#ffc917" fontFamily="sans-serif">
        {tr.destination.length > 14 ? tr.destination.replace(" Centraal", "") : tr.destination}
      </text>
      <title>{`Perron ${tr.platform}`}</title>
    </g>
  );
}

const BACKDROP_MSGS = t.boardMessages;

/** Het stationsdecor zonder bewegende delen die van de spelstatus afhangen. */
const Backdrop = memo(function Backdrop() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="st-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#dbe8f4" />
          <stop offset="1" stopColor="#f5f9fd" />
        </linearGradient>
        <linearGradient id="st-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5b6fc7" />
          <stop offset="1" stopColor="#f6b89a" />
        </linearGradient>
        <clipPath id="st-glass"><rect x={0} y={130} width={1600} height={250} /></clipPath>
      </defs>

      {/* achterwand met glazen gevel en avondlucht */}
      <rect width={1600} height={600} fill="url(#st-wall)" />
      <rect x={0} y={130} width={1600} height={250} fill="url(#st-dusk)" />
      <g clipPath="url(#st-glass)">
        {[[60, 170], [260, 130], [470, 200], [1000, 150], [1250, 180], [1480, 140]].map(([x, h], i) => (
          <rect key={i} x={x} y={380 - h} width={90 + (i % 3) * 20} height={h} fill="#3b4a7a" opacity={0.85} />
        ))}
        {/* rijdende trein op de achtergrond */}
        <g className="bg-train">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`translate(${i * 150} 318)`}>
              <rect width={140} height={44} rx={10} fill="#ffc917" stroke="#2b1b3d" strokeWidth={2.5} />
              <rect y={28} width={140} height={12} fill="#0a3d9e" />
              {[14, 54, 94].map((wx) => <rect key={wx} x={wx} y={8} width={30} height={16} rx={3} fill="#fff3a6" />)}
            </g>
          ))}
        </g>
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} d={`M${i * 200} 130 V380`} stroke="#2b3f66" strokeWidth={8} />
        ))}
        <path d="M0 250 H1600" stroke="#2b3f66" strokeWidth={6} />
      </g>
      <rect x={0} y={374} width={1600} height={220} fill="#e8d5b8" />
      <path d="M0 400 H1600 M0 450 H1600 M0 500 H1600" stroke="#cdb892" strokeWidth={3} />

      {/* plafond met stalen spanten */}
      <rect width={1600} height={130} fill="#1f3a73" />
      <path d="M0 130 L400 0 M400 130 L800 0 M800 130 L1200 0 M1200 130 L1600 0 M0 0 L400 130 M400 0 L800 130 M800 0 L1200 130 M1200 0 L1600 130" stroke="#3a5fa8" strokeWidth={10} />
      <rect y={122} width={1600} height={14} fill="#142b57" />

      {/* feestverlichting en vlaggetjes (Sinterklaas) */}
      {Array.from({ length: 40 }, (_, i) => (
        <circle key={i} className="twinkle" style={{ animationDelay: `${(i % 8) * 0.25}s` }} cx={20 + i * 40} cy={146 + Math.sin(i * 0.8) * 7} r={6} fill={["#ffd45e", "#ff5d8f", "#5cc4ee", "#7be87a"][i % 4]} />
      ))}
      <path d="M0 150 Q400 210 800 150 T1600 150" fill="none" stroke="#2b1b3d" strokeWidth={3} opacity={0.5} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 50 + i * 100;
        const y = 160 + Math.sin((i / 16) * Math.PI * 4) * 22 + 10;
        return <path key={i} d={`M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 34}Z`} fill={["#d62f2f", "#fff", "#ffc400"][i % 3]} stroke="#2b1b3d" strokeWidth={2} />;
      })}

      {/* stationsnaam en wegwijzers */}
      <g>
        <rect x={1100} y={36} width={460} height={64} rx={8} fill="#0a3d9e" {...O} />
        <text x={1330} y={80} textAnchor="middle" fontSize={30} fontWeight={800} fill="#fff" fontFamily="sans-serif" letterSpacing={1}>{t.stationName.toUpperCase()}</text>
      </g>
      <g>
        <path d="M1420 188 V240" stroke="#2b1b3d" strokeWidth={4} />
        <path d="M1380 240 H1540 L1566 262 L1540 284 H1380Z" fill="#ffc917" {...O} />
        <text x={1450} y={270} textAnchor="middle" fontSize={22} fontWeight={800} fill="#2b1b3d" fontFamily="sans-serif">{t.signs.exit}</text>
      </g>
      <g>
        <path d="M340 190 V228 M440 190 V228" stroke="#2b1b3d" strokeWidth={4} />
        <rect x={290} y={228} width={200} height={42} rx={8} fill="#0a3d9e" {...O} />
        <text x={390} y={257} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily="sans-serif">{t.signs.platforms}</text>
      </g>

      {/* hangend vertrekbord met wisselende meldingen (decor) */}
      <g className="decor-board">
        <path d="M600 130 V150 M1000 130 V150" stroke="#2b1b3d" strokeWidth={5} />
        <rect x={520} y={44} width={560} height={150} rx={10} fill="#10183a" {...O} />
        <text x={540} y={78} fontSize={24} fontWeight={800} fill="#ffd54a" fontFamily="sans-serif">{t.boardTitle.toUpperCase()}</text>
        {allTrains.map((tr, i) => (
          <text key={tr.id} x={540} y={108 + i * 24} fontSize={19} fontWeight={700} fill="#fff" fontFamily="sans-serif">
            {`${tr.time}   ${tr.platform}   ${t.kindLabel[tr.kind]}   ${tr.destination}`}
          </text>
        ))}
        {BACKDROP_MSGS.map((m, i) => (
          <text key={m} className="board-msg" style={{ animationDelay: `${i * 4}s` }} x={540} y={184} fontSize={17} fontWeight={800} fill="#ffd54a" fontFamily="sans-serif">
            {m}
          </text>
        ))}
      </g>
      <g>
        <path d="M580 196 L600 168 L620 196 L640 168 L660 196 L680 168 L700 196" fill="none" stroke="none" />
        <rect x={610} y={204} width={380} height={34} rx={17} fill="#d62f2f" {...O} />
        <text x={800} y={228} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff" fontFamily="sans-serif">{t.signs.welcome}</text>
      </g>

      {/* stationsklok met mijter */}
      <g>
        <path d="M190 130 V190" stroke="#2b1b3d" strokeWidth={6} />
        <path d="M156 200 L190 138 L224 200 Z" fill="#d62f2f" stroke="#ffc400" strokeWidth={4} strokeLinejoin="round" />
        <rect x={150} y={196} width={80} height={10} rx={5} fill="#ffc400" {...O} strokeWidth={2.5} />
        <circle cx={190} cy={256} r={52} fill="#fff" {...O} strokeWidth={5} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M190 212 V222" stroke="#2b1b3d" strokeWidth={i % 3 === 0 ? 5 : 3} transform={`rotate(${i * 30} 190 256)`} />
        ))}
        <path className="clock-hand" style={{ "--a0": "231deg", animationDuration: "43200s", transformOrigin: "190px 256px" } as CSSProperties} d="M190 256 V232" stroke="#2b1b3d" strokeWidth={6} strokeLinecap="round" />
        <path className="clock-hand" style={{ "--a0": "252deg", animationDuration: "3600s", transformOrigin: "190px 256px" } as CSSProperties} d="M190 256 V218" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round" />
        <path className="clock-hand clock-second" style={{ "--a0": "0deg", animationDuration: "60s", transformOrigin: "190px 256px" } as CSSProperties} d="M190 266 V216" stroke="#e53935" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={190} cy={256} r={5} fill="#e53935" />
      </g>

      {/* perronvloer */}
      <rect x={0} y={576} width={1600} height={324} fill="#b9c3d6" />
      <rect x={0} y={576} width={1600} height={10} fill="#8a96b0" />
      <rect x={0} y={598} width={1600} height={8} fill="#ffc917" />
      <path d="M0 660 H1600 M0 740 H1600 M0 820 H1600" stroke="#a5b0c8" strokeWidth={3} />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 70} 606 L${i * 70 - 90} 900`} stroke="#a5b0c8" strokeWidth={2} />)}

      {/* pepernotenkraam en cadeautjes */}
      <g>
        <rect x={1380} y={630} width={190} height={130} fill="#f4e2c0" {...O} />
        <path d="M1370 630 L1380 590 H1570 L1580 630 Z" fill="url(#st-awning)" {...O} />
        <defs>
          <pattern id="st-awning" width="38" height="40" patternUnits="userSpaceOnUse"><rect width="19" height="40" fill="#d62f2f" /><rect x="19" width="19" height="40" fill="#fff" /></pattern>
        </defs>
        <text x={1475} y={668} textAnchor="middle" fontSize={15} fontWeight={800} fill="#2b1b3d" fontFamily="sans-serif">{t.signs.pepernoten}</text>
        {[1410, 1450, 1490, 1530].map((x, i) => <circle key={x} cx={x} cy={712 + (i % 2) * 4} r={11} fill="#b9772f" {...O} strokeWidth={2} />)}
        <rect x={1376} y={756} width={198} height={10} fill="#8a5a2b" {...O} strokeWidth={2.5} />
      </g>
      <g>
        <rect x={1240} y={720} width={56} height={44} fill="#2b6fd6" {...O} />
        <path d="M1268 720 V764 M1240 742 H1296" stroke="#ffc400" strokeWidth={5} />
        <rect x={1252} y={684} width={40} height={36} fill="#d62f2f" {...O} />
        <path d="M1272 684 V720" stroke="#fff" strokeWidth={5} />
      </g>
    </g>
  );
});

/** Rotterdam Centraal: perrons, treinen, reizigers en klok (vaste viewBox 1600 × 900). */
export default function StationScene({ litTrainId, flash, boardTrainId, minou, departing, announcing }: Props) {
  const boardIdx = allTrains.findIndex((x) => x.id === boardTrainId);
  const boardX = TRAIN_XS[boardIdx] ?? 0;
  // Deur van de instaptrein, relatief aan Minou's startplek.
  const doorX = boardX + 182;
  const bx = (doorX - MINOU.x) / MINOU.scale;
  const by = (TRAIN_Y + 170 - MINOU.y) / MINOU.scale;

  return (
    <svg className="station-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Rotterdam Centraal">
      <Backdrop />

      {/* omroepluidspreker */}
      <g transform="translate(1000 270)" className={announcing ? "speaker on" : "speaker"} aria-hidden>
        <path d="M0 0 H18 L40 -14 V40 L18 26 H0Z" fill="#2b1b3d" />
        <path className="wave w1" d="M52 4 Q66 12 52 22" fill="none" stroke="#ffc917" strokeWidth={4} strokeLinecap="round" />
        <path className="wave w2" d="M62 -6 Q86 12 62 32" fill="none" stroke="#ffc917" strokeWidth={4} strokeLinecap="round" />
        <path className="wave w3" d="M72 -16 Q106 12 72 42" fill="none" stroke="#ffc917" strokeWidth={4} strokeLinecap="round" />
      </g>

      {allTrains.map((tr, i) => {
        const x = TRAIN_XS[i];
        const lit = litTrainId === tr.id;
        const isBoard = tr.id === boardTrainId;
        const f = flash !== null && flash.trainId === tr.id;
        return (
          <g key={tr.id}>
            {/* perronbord */}
            <path d={`M${x + 70} 130 V330 M${x + 370} 130 V330`} stroke="#2b1b3d" strokeWidth={5} />
            <rect x={x + 150} y={330} width={140} height={78} rx={10} fill={lit ? "#2fb36d" : "#0a3d9e"} {...O} />
            <text x={x + 220} y={354} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff" fontFamily="sans-serif">PERRON</text>
            <text x={x + 220} y={398} textAnchor="middle" fontSize={44} fontWeight={800} fill="#fff" fontFamily="sans-serif">{tr.platform}</text>
            {lit && <path className="found-arrow" d={`M${x + 220} 300 l-16 -22 h10 v-22 h12 v22 h10z`} fill="#ffd45e" stroke="#2b1b3d" strokeWidth={2.5} strokeLinejoin="round" />}

            <g transform={`translate(${x} ${TRAIN_Y})`}>
              <g
                key={f ? `f${flash.key}` : "n"}
                className={[f ? "train-flash" : "", isBoard && departing ? "train-depart" : ""].join(" ")}
                style={isBoard && departing ? ({ "--depart": `${1800 - x}px` } as CSSProperties) : undefined}
              >
                <Train tr={tr} lit={lit} />
              </g>
            </g>
          </g>
        );
      })}

      {/* reizigers (bewegen subtiel) */}
      {TRAVELLERS.map((p) => <Traveller key={p.x} {...p} />)}

      {/* Minou loopt op de trein af en stapt in */}
      {minou !== "gone" && (
        <g transform={`translate(${MINOU.x} ${MINOU.y}) scale(${MINOU.scale})`}>
          <g
            className={minou === "boarding" ? "minou-marker minou-board" : "minou-marker"}
            data-walking={minou === "boarding" ? "true" : "false"}
            data-facing="right"
            style={{ "--bx": `${bx}px`, "--by": `${by}px` } as CSSProperties}
          >
            <MinouSprite />
          </g>
        </g>
      )}
    </svg>
  );
}
