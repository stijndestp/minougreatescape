"use client";

import { memo, type CSSProperties } from "react";
import MinouHero, { type HeroMood } from "@/components/MinouHero";
import { texts as t, trains as allTrains } from "@/content/rotterdam";
import type { TrainDef } from "@/game/rotterdam";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
const SANS = "sans-serif";

/** Plek van elk perron in de scène (x linksboven, y = bovenkant van de trein). */
const TRAIN_W = 440;
const TRAIN_Y = 420;
const TRAIN_XS = [60, 580, 1100];
/** Wijst een trein naar links of rechts (Dordrecht-kant naar links). */
const faceLeft = (tr: TrainDef) => tr.heading === "dordrecht";

const MINOU = { x: 170, y: 610, scale: 1.3 };

/** Deterministische pseudo-willekeur voor decorpatronen (zelfde beeld bij elke render). */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export type MinouEmote = "?" | "!" | "♥" | null;

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
  /** Gezichtsuitdrukking van Minou (alleen weergave). */
  minouMood?: HeroMood;
  /** Klein wolkje boven Minou's hoofd (alleen weergave). */
  emote?: MinouEmote;
}

/* ------------------------------------------------------------------ reizigers */

type Hat = "mijter" | "piet" | "muts" | "beanie" | "none";
type Prop = "bag" | "phone" | "coffee" | "suitcase" | "none";
interface TravellerDef {
  x: number; y: number; scale: number;
  coat: string; scarf: string; skin: string; hair: string;
  hat: Hat; prop: Prop;
  /** Loopafstand in px (0 = staat stil en wacht). */
  walk: number;
  dur: number; delay: number;
}

const TRAVELLERS: TravellerDef[] = [
  { x: 330, y: 640, scale: 0.86, coat: "#d62f2f", scarf: "#ffc400", skin: "#ffd9b8", hair: "#e8e2d8", hat: "mijter", prop: "bag", walk: 0, dur: 0, delay: 0 },
  { x: 470, y: 704, scale: 0.84, coat: "#2b6fd6", scarf: "#ff8a2b", skin: "#c98d62", hair: "#2b1b1b", hat: "none", prop: "suitcase", walk: 150, dur: 15, delay: -3 },
  { x: 720, y: 646, scale: 0.84, coat: "#7a5cc2", scarf: "#ff4d9a", skin: "#8a5a3b", hair: "#1e1414", hat: "piet", prop: "phone", walk: 0, dur: 0, delay: -1.2 },
  { x: 870, y: 712, scale: 0.84, coat: "#2fb36d", scarf: "#fff", skin: "#ffd9b8", hair: "#c26a2b", hat: "muts", prop: "coffee", walk: -130, dur: 13, delay: -6 },
  { x: 1010, y: 636, scale: 0.84, coat: "#ff8a2b", scarf: "#2b6fd6", skin: "#f2c9a0", hair: "#5a3a22", hat: "beanie", prop: "bag", walk: 0, dur: 0, delay: -2.4 },
  { x: 1170, y: 706, scale: 0.84, coat: "#3a3f5c", scarf: "#d62f2f", skin: "#e7b48f", hair: "#3a2a20", hat: "none", prop: "coffee", walk: -150, dur: 16, delay: -9 },
  { x: 1300, y: 650, scale: 0.84, coat: "#e54b8a", scarf: "#ffd54a", skin: "#ffd9b8", hair: "#f2c46a", hat: "piet", prop: "phone", walk: 0, dur: 0, delay: -0.6 },
];

function Hat({ hat }: { hat: Hat }) {
  switch (hat) {
    case "mijter":
      return (
        <g>
          <path d="M-14 -112 L-10 -136 Q0 -148 10 -136 L14 -112 Z" fill="#d62f2f" stroke="#ffc400" strokeWidth={3} strokeLinejoin="round" />
          <path d="M0 -140 V-116 M-6 -126 H6" stroke="#ffc400" strokeWidth={3} />
        </g>
      );
    case "piet":
      return (
        <g>
          <ellipse cx={0} cy={-114} rx={20} ry={8} fill="#7a5cc2" {...O} strokeWidth={2.5} />
          <path d="M8 -118 Q30 -136 24 -146 Q16 -130 4 -122Z" fill="#ff4d9a" stroke={INK} strokeWidth={1.5} />
        </g>
      );
    case "muts":
      return (
        <g>
          <path d="M-16 -108 Q-4 -140 16 -134 Q10 -122 15 -108 Z" fill="#d62f2f" {...O} strokeWidth={2.5} />
          <rect x={-17} y={-112} width={34} height={8} rx={4} fill="#fff" {...O} strokeWidth={2} />
          <circle cx={16} cy={-134} r={5} fill="#fff" {...O} strokeWidth={2} />
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d="M-15 -106 Q-16 -128 0 -128 Q16 -128 15 -106 Z" fill="#2fb36d" {...O} strokeWidth={2.5} />
          <path d="M-15 -110 H15" stroke="#fff" strokeWidth={3} />
          <circle cx={0} cy={-130} r={4.5} fill="#fff" {...O} strokeWidth={1.8} />
        </g>
      );
    default:
      return null;
  }
}

function TravellerArt(p: TravellerDef) {
  const moving = p.walk !== 0;
  const looking = p.prop === "phone";
  return (
    <g>
      <ellipse cx={0} cy={0} rx={24} ry={6} fill="rgba(20,20,50,.22)" />
      {p.prop === "suitcase" && (
        <g>
          <path d="M-36 -64 V-44" stroke={INK} strokeWidth={3} />
          <rect x={-46} y={-44} width={26} height={40} rx={5} fill="#ff4d6d" {...O} strokeWidth={2.5} />
          <path d="M-40 -44 V-4 M-26 -44 V-4" stroke="#c22e4e" strokeWidth={2} />
          <circle cx={-42} cy={-2} r={3} fill={INK} />
          <circle cx={-24} cy={-2} r={3} fill={INK} />
        </g>
      )}
      <g className={moving ? "tr-leg tr-leg-a" : undefined}>
        <rect x={-12} y={-36} width={9} height={34} rx={4} fill="#2f2a48" />
        <ellipse cx={-8} cy={-2} rx={8} ry={4} fill="#1d1830" />
      </g>
      <g className={moving ? "tr-leg tr-leg-b" : undefined}>
        <rect x={3} y={-36} width={9} height={34} rx={4} fill="#2f2a48" />
        <ellipse cx={8} cy={-2} rx={8} ry={4} fill="#1d1830" />
      </g>
      <g className={moving ? "bob" : "tr-breathe"} style={{ animationDelay: `${p.delay}s` }}>
        {/* jas met schaduwzijde en knopen */}
        <path d="M-17 -84 Q-17 -91 -9 -91 H9 Q17 -91 17 -84 L20 -32 Q0 -27 -20 -32Z" fill={p.coat} {...O} strokeWidth={2.5} />
        <path d="M4 -90 H9 Q17 -91 17 -84 L20 -32 Q12 -30 6 -30Z" fill="rgba(10,0,40,.18)" />
        <path d="M0 -84 V-34" stroke="rgba(0,0,0,.25)" strokeWidth={2} />
        {[-72, -60, -48].map((y) => <circle key={y} cx={-3} cy={y} r={1.8} fill="rgba(0,0,0,.35)" />)}
        {/* armen */}
        <rect x={-23} y={-86} width={8} height={36} rx={4} fill={p.coat} stroke={INK} strokeWidth={2} />
        <g transform={looking ? "rotate(-50 19 -84)" : undefined}>
          <rect x={15} y={-86} width={8} height={36} rx={4} fill={p.coat} stroke={INK} strokeWidth={2} />
          <circle cx={19} cy={-50} r={4.5} fill={p.skin} stroke={INK} strokeWidth={1.5} />
          {p.prop === "phone" && (
            <g>
              <rect x={14} y={-60} width={10} height={16} rx={2} fill="#1d1830" />
              <rect className="phone-glow" x={15.5} y={-58.5} width={7} height={12} rx={1} fill="#bfe6ff" />
            </g>
          )}
          {p.prop === "coffee" && (
            <g>
              <path d="M13 -60 H25 L23 -46 H15Z" fill="#fff" stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
              <rect x={13} y={-55} width={12} height={4} fill="#c98a4b" />
              <path className="steam" d="M17 -64 q-3 -5 0 -9 M21 -64 q3 -5 0 -9" fill="none" stroke="#fff" strokeWidth={1.6} strokeLinecap="round" opacity={0.7} />
            </g>
          )}
        </g>
        <circle cx={-19} cy={-50} r={4.5} fill={p.skin} stroke={INK} strokeWidth={1.5} />
        {p.prop === "bag" && (
          <g>
            <path d="M-12 -88 L-26 -46" stroke="#6b3d1f" strokeWidth={3} />
            <rect x={-38} y={-50} width={22} height={20} rx={4} fill="#c98a4b" {...O} strokeWidth={2.2} />
            <path d="M-38 -42 H-16" stroke="#8a5a2b" strokeWidth={2} />
          </g>
        )}
        {/* sjaal */}
        <path d="M-12 -92 Q0 -86 12 -92 L12 -86 Q0 -80 -12 -86Z" fill={p.scarf} stroke={INK} strokeWidth={1.8} />
        <path d="M5 -87 L9 -72 L3 -72 L1 -85Z" fill={p.scarf} stroke={INK} strokeWidth={1.6} />
        {/* hoofd */}
        <g className={looking ? undefined : "tr-head"} style={{ animationDelay: `${p.delay * 1.7}s` }} transform={looking ? "rotate(8 0 -94) translate(0 2)" : undefined}>
          <circle cx={0} cy={-104} r={15} fill={p.skin} {...O} strokeWidth={2.5} />
          {p.hat !== "mijter" && p.hat !== "beanie" && (
            <path d="M-16 -104 Q-17 -122 0 -122 Q17 -122 16 -104 Q10 -114 0 -113 Q-10 -114 -16 -104Z" fill={p.hair} stroke={INK} strokeWidth={1.8} strokeLinejoin="round" />
          )}
          {p.hat === "mijter" && <path d="M-14 -96 Q0 -76 14 -96 Q10 -88 0 -88 Q-10 -88 -14 -96Z" fill={p.hair} stroke={INK} strokeWidth={1.5} />}
          <circle cx={-5} cy={looking ? -101 : -104} r={1.8} fill={INK} />
          <circle cx={5} cy={looking ? -101 : -104} r={1.8} fill={INK} />
          <circle cx={-9} cy={-98} r={2.6} fill="#ff8aa0" opacity={0.5} />
          <circle cx={9} cy={-98} r={2.6} fill="#ff8aa0" opacity={0.5} />
          <path d={looking ? "M-3 -95 Q0 -93 3 -95" : "M-4 -97 Q0 -94 4 -97"} fill="none" stroke={INK} strokeWidth={1.8} strokeLinecap="round" />
          <Hat hat={p.hat} />
        </g>
      </g>
    </g>
  );
}

function Traveller(p: TravellerDef) {
  const style = p.walk
    ? ({ "--wd": `${p.walk}px`, "--f": p.walk > 0 ? 1 : -1, animationDuration: `${p.dur}s`, animationDelay: `${p.delay}s` } as CSSProperties)
    : undefined;
  return (
    <g transform={`translate(${p.x} ${p.y}) scale(${p.scale})`}>
      <g className={p.walk ? "tr-walk" : undefined} style={style}>
        <TravellerArt {...p} />
      </g>
    </g>
  );
}

/** Duiven die over het perron scharrelen (kleine omgevingsanimatie). */
function Pigeon({ x, y, flip, delay }: { x: number; y: number; flip?: boolean; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx={0} cy={2} rx={14} ry={3} fill="rgba(20,20,50,.2)" />
      <path d="M-3 0 V-6 M3 0 V-6" stroke="#e8743b" strokeWidth={2} />
      <g className="pigeon-peck" style={{ animationDelay: `${delay}s` }}>
        <path d="M-16 -12 Q-14 -22 0 -20 Q10 -19 10 -12 Q4 -4 -8 -6 Q-16 -6 -16 -12Z" fill="#8f97b3" stroke={INK} strokeWidth={1.8} />
        <path d="M-10 -14 Q-2 -18 4 -12" fill="none" stroke="#6e7594" strokeWidth={2} />
        <circle cx={10} cy={-22} r={6} fill="#7a83a3" stroke={INK} strokeWidth={1.8} />
        <path d="M6 -18 Q10 -14 14 -18" fill="none" stroke="#5fbf9a" strokeWidth={2} />
        <path d="M15 -22 L20 -21 L15 -19Z" fill="#e8743b" />
        <circle cx={11.5} cy={-23} r={1.3} fill={INK} />
      </g>
    </g>
  );
}

/* --------------------------------------------------------------------- treinen */

function Train({ tr, lit }: { tr: TrainDef; lit: boolean }) {
  const left = faceLeft(tr);
  const mirror = left ? `translate(${TRAIN_W} 0) scale(-1 1)` : undefined;
  const win = lit ? "#fff3a6" : "#42568c";
  const people = lit ? "rgba(140,90,30,.45)" : "rgba(20,26,60,.55)";
  return (
    <g className={lit ? "train train-lit" : "train"} data-train={tr.id}>
      <ellipse cx={TRAIN_W / 2} cy={156} rx={TRAIN_W / 2 + 14} ry={9} fill="rgba(10,10,30,.35)" />
      <g transform={mirror}>
        {/* rails */}
        <rect x={-14} y={150} width={TRAIN_W + 28} height={6} fill="#4a4e66" />
        <rect x={-14} y={147.5} width={TRAIN_W + 28} height={3} fill="#c9cee0" />

        {/* dak met stroomafnemer */}
        <rect x={24} y={-10} width={TRAIN_W - 88} height={14} rx={6} fill="#a3aac2" {...O} strokeWidth={2.5} />
        {[70, 250].map((x) => <rect key={x} x={x} y={-18} width={40} height={10} rx={3} fill="#8a91aa" stroke={INK} strokeWidth={2} />)}
        <path d="M312 -10 L336 -32 L312 -44 M354 -10 L336 -32" fill="none" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M296 -44 H330" stroke={INK} strokeWidth={4} strokeLinecap="round" />

        {/* onderstel met draaistellen */}
        <rect x={30} y={126} width={TRAIN_W - 60} height={18} fill="#2b2b3d" />
        {[150, 230].map((x) => <rect key={x} x={x} y={128} width={56} height={14} rx={2} fill="#3d4060" stroke={INK} strokeWidth={1.5} />)}
        {[90, 350].map((bx) => (
          <g key={bx}>
            <rect x={bx - 52} y={128} width={104} height={14} rx={4} fill="#3a3d55" stroke={INK} strokeWidth={2} />
            {[bx - 30, bx + 30].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy={143} r={11} fill="#2b2b3d" {...O} strokeWidth={2.5} />
                <circle cx={cx} cy={143} r={4} fill="#9aa0b8" />
              </g>
            ))}
          </g>
        ))}

        {/* romp met licht van boven en schaduw onder */}
        <rect x={0} y={0} width={TRAIN_W} height={136} rx={26} fill="url(#st-train)" {...O} />
        <path d="M0 96 H440 V110 Q440 136 414 136 H26 Q0 136 0 110Z" fill="#0a3d9e" {...O} />
        <path d="M6 99 H434" stroke="#fff" strokeWidth={3} opacity={0.55} />
        <rect x={14} y={8} width={TRAIN_W - 60} height={6} rx={3} fill="#fff" opacity={0.5} />

        {/* ramen met reizigers */}
        {[30, 100, 240, 310].map((wx, i) => (
          <g key={wx}>
            <rect className="t-win" x={wx} y={24} width={54} height={48} rx={8} fill={win} {...O} strokeWidth={2.5} />
            <circle cx={wx + 16 + (i % 2) * 18} cy={52} r={8} fill={people} />
            <path d={`M${wx + 4 + (i % 2) * 18} 72 Q${wx + 16 + (i % 2) * 18} 56 ${wx + 28 + (i % 2) * 18} 72Z`} fill={people} />
            <path d={`M${wx + 8} 70 L${wx + 26} 26 H${wx + 36} L${wx + 18} 70Z`} fill="#fff" opacity={0.16} />
          </g>
        ))}

        {/* deuren met raampje en deurlampje */}
        {[168, 198].map((dx) => (
          <g key={dx}>
            <rect x={dx} y={18} width={28} height={90} rx={4} fill={lit ? "#ffe27a" : "#e0a400"} {...O} strokeWidth={2.5} />
            <rect x={dx + 5} y={26} width={18} height={34} rx={4} fill={win} stroke={INK} strokeWidth={2} />
          </g>
        ))}
        <path d="M196 22 V104" stroke={INK} strokeWidth={2.5} />
        <circle cx={196} cy={12} r={4} fill={lit ? "#5ef08a" : "#ff6b6b"} stroke={INK} strokeWidth={1.5} />

        {/* neus met cabine, ruitenwisser en koplampen */}
        <path d="M384 4 V96" stroke={INK} strokeWidth={2.5} />
        <path d="M390 20 Q430 24 436 64 V90 H390Z" fill={win} {...O} strokeWidth={2.5} />
        <path d="M398 86 L420 50" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
        <path d="M396 28 Q414 30 422 44 L410 44 Q404 34 396 34Z" fill="#fff" opacity={0.3} />
        <circle cx={424} cy={114} r={20} fill="url(#st-headlight)" />
        <circle cx={424} cy={114} r={7} fill="#fff7c2" stroke={INK} strokeWidth={2} />
        <circle cx={402} cy={114} r={4} fill="#ff5a5a" stroke={INK} strokeWidth={1.2} />
        <rect x={436} y={104} width={12} height={10} rx={2} fill="#3a3d55" stroke={INK} strokeWidth={2} />
      </g>

      {/* opschrift (niet gespiegeld) */}
      <text x={TRAIN_W / 2} y={124} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff" fontFamily={SANS} letterSpacing={4}>
        {t.kindLabel[tr.kind].toUpperCase()}
      </text>
      {/* bestemmingsdisplay boven de cabine */}
      <rect x={left ? 8 : TRAIN_W - 104} y={2} width={96} height={15} rx={3} fill="#14172b" stroke={INK} strokeWidth={1.5} />
      <text x={left ? 56 : TRAIN_W - 56} y={13.5} textAnchor="middle" fontSize={11} fontWeight={800} fill="#ffc917" fontFamily={SANS}>
        {tr.destination.length > 14 ? tr.destination.replace(" Centraal", "") : tr.destination}
      </text>
      <title>{`Perron ${tr.platform}`}</title>
    </g>
  );
}

/* ---------------------------------------------------------------- het decor */

const BACKDROP_MSGS = t.boardMessages;
/** Hoogte van de lichtjesslinger "M0 150 Q400 200 800 150 T1600 150" bij x. */
const garlandY = (x: number) => {
  const s = (x % 800) / 800;
  return 150 + (x < 800 ? 1 : -1) * 2 * s * (1 - s) * 50;
};
const LIGHT_XS = [120, 420, 760, 1080, 1400];

/** Houten lamellenplafond van de stationshal, in perspectief. */
function Ceiling() {
  const vx = 800;
  const vy = 520;
  const bottom = 128;
  const slats = Array.from({ length: 41 }, (_, i) => -800 + i * 80);
  return (
    <g>
      <rect width={1600} height={bottom} fill="url(#st-wood)" />
      {slats.map((x) => {
        const xb = x + (vx - x) * (bottom / vy);
        return <path key={x} d={`M${x} 0 L${xb} ${bottom}`} stroke="#7a4a22" strokeWidth={3} opacity={0.55} />;
      })}
      <path d="M0 42 H1600 M0 86 H1600" stroke="#6b3f1c" strokeWidth={2} opacity={0.35} />
      {/* stalen spanten */}
      <path d="M0 128 L400 8 L800 128 L1200 8 L1600 128" fill="none" stroke="#2b3f66" strokeWidth={12} strokeLinejoin="round" />
      <path d="M0 128 L400 8 L800 128 L1200 8 L1600 128" fill="none" stroke="#5a77b8" strokeWidth={4} strokeLinejoin="round" opacity={0.6} />
      <rect y={120} width={1600} height={18} fill="#1d2f5c" />
      <rect y={120} width={1600} height={4} fill="#6f8fd6" opacity={0.6} />
      {/* inbouwspots in de balk */}
      {LIGHT_XS.map((x) => (
        <g key={x}>
          <ellipse cx={x} cy={138} rx={18} ry={5} fill="#fff4c8" />
          <ellipse cx={x} cy={140} rx={40} ry={12} fill="url(#st-spot)" />
        </g>
      ))}
    </g>
  );
}

/** Skyline van Rotterdam achter de glazen gevel (Euromast, Erasmusbrug, hoogbouw). */
function Skyline() {
  const far: [number, number, number][] = [
    [0, 90, 110], [80, 70, 150], [330, 110, 120], [430, 80, 170], [560, 90, 100], [830, 120, 140],
    [940, 70, 110], [1160, 100, 130], [1300, 80, 160], [1480, 120, 120],
  ];
  const near: [number, number, number][] = [
    [-20, 110, 90], [120, 90, 120], [380, 100, 80], [600, 130, 70], [780, 90, 110], [1200, 110, 80], [1420, 90, 100], [1530, 90, 70],
  ];
  return (
    <g>
      {/* verre laag (nevelig) */}
      {far.map(([x, w, h], i) => <rect key={`f${i}`} x={x} y={380 - h} width={w} height={h} fill="#6c6fb0" opacity={0.75} />)}
      {/* Euromast */}
      <g fill="#4d4f92">
        <rect x={262} y={196} width={14} height={184} />
        <ellipse cx={269} cy={238} rx={30} ry={9} />
        <rect x={266} y={150} width={6} height={50} />
        <path d="M269 132 V150" stroke="#4d4f92" strokeWidth={3} />
        <circle cx={269} cy={132} r={3} fill="#ff6b6b" className="twinkle" />
      </g>
      {/* Erasmusbrug (de Zwaan) */}
      <g>
        <path d="M676 380 L706 214 L718 216 L694 380Z" fill="#dfe6ff" opacity={0.9} />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <path key={i} d={`M${708 - i * 2} ${226 + i * 4} L${600 + i * 30} 352`} stroke="#dfe6ff" strokeWidth={1.4} opacity={0.6} />
        ))}
        <path d="M560 352 H900" stroke="#dfe6ff" strokeWidth={5} opacity={0.75} />
      </g>
      {/* nabije laag met verlichte ramen */}
      {near.map(([x, w, h], i) => (
        <g key={`n${i}`}>
          <rect x={x} y={380 - h} width={w} height={h} fill="#3b4378" />
          {Array.from({ length: Math.floor(h / 18) * 4 }, (_, k) => {
            const cx = x + 10 + (k % 4) * ((w - 20) / 4);
            const cy = 380 - h + 10 + Math.floor(k / 4) * 18;
            return rnd(k + i * 31, 3) > 0.45 ? <rect key={k} x={cx} y={cy} width={8} height={7} fill="#ffd76a" opacity={0.75} /> : null;
          })}
        </g>
      ))}
      {/* Delftse Poort: twee glazen torens */}
      <g>
        <rect x={1000} y={170} width={72} height={210} fill="#2f3768" />
        <rect x={1078} y={214} width={56} height={166} fill="#353e72" />
        <path d="M1000 170 L1072 170 L1072 380" fill="none" stroke="#7d8bd6" strokeWidth={2} opacity={0.6} />
        {Array.from({ length: 11 }, (_, k) => <path key={k} d={`M1004 ${186 + k * 18} H1068`} stroke="#ffd76a" strokeWidth={2} opacity={0.35} />)}
        <circle cx={1036} cy={164} r={3} fill="#ff6b6b" className="twinkle" style={{ animationDelay: ".8s" }} />
      </g>
      {/* viaduct voor de achtergrondtrein */}
      <rect x={0} y={362} width={1600} height={8} fill="#2a2f5a" />
    </g>
  );
}

/** Het stationsdecor zonder bewegende delen die van de spelstatus afhangen. */
const Backdrop = memo(function Backdrop() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="st-dusk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e3a8a" />
          <stop offset=".55" stopColor="#8a6fc0" />
          <stop offset="1" stopColor="#ffb08a" />
        </linearGradient>
        <linearGradient id="st-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8a5a2b" />
          <stop offset="1" stopColor="#c98a4b" />
        </linearGradient>
        <linearGradient id="st-train" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffd84a" />
          <stop offset=".7" stopColor="#ffc917" />
          <stop offset="1" stopColor="#e6a800" />
        </linearGradient>
        <linearGradient id="st-backwall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5d6896" />
          <stop offset="1" stopColor="#3a4372" />
        </linearGradient>
        <linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c9d1e4" />
          <stop offset="1" stopColor="#8d97b6" />
        </linearGradient>
        <linearGradient id="st-column" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3a4a7a" />
          <stop offset=".35" stopColor="#7d93cc" />
          <stop offset="1" stopColor="#2b3a66" />
        </linearGradient>
        <linearGradient id="st-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2c4" stopOpacity=".34" />
          <stop offset="1" stopColor="#fff2c4" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="st-spot">
          <stop offset="0" stopColor="#fff4c8" stopOpacity=".8" />
          <stop offset="1" stopColor="#fff4c8" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="st-pool">
          <stop offset="0" stopColor="#fff1c2" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff1c2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="st-headlight">
          <stop offset="0" stopColor="#fff7c2" stopOpacity=".9" />
          <stop offset="1" stopColor="#fff7c2" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="st-vignette" cx=".5" cy=".45" r=".75">
          <stop offset=".6" stopColor="#140a28" stopOpacity="0" />
          <stop offset="1" stopColor="#140a28" stopOpacity=".5" />
        </radialGradient>
        <pattern id="st-awning" width="38" height="40" patternUnits="userSpaceOnUse">
          <rect width="19" height="40" fill="#d62f2f" />
          <rect x="19" width="19" height="40" fill="#fff" />
        </pattern>
        <clipPath id="st-glass"><rect x={0} y={128} width={1600} height={254} /></clipPath>
      </defs>

      {/* glazen gevel met avondlucht en de skyline van Rotterdam */}
      <rect x={0} y={128} width={1600} height={254} fill="url(#st-dusk)" />
      <g clipPath="url(#st-glass)">
        {[[140, 170], [520, 150], [1240, 160], [1520, 190]].map(([x, y], i) => (
          <circle key={i} className="star" style={{ animationDelay: `${i * 0.7}s` }} cx={x} cy={y} r={2.2} fill="#fff" />
        ))}
        <Skyline />
        {/* rijdende trein op het viaduct */}
        <g className="bg-train">
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i} transform={`translate(${i * 150} 322)`}>
              <rect width={140} height={40} rx={10} fill="#ffc917" stroke={INK} strokeWidth={2.5} />
              <rect y={26} width={140} height={10} fill="#0a3d9e" />
              {[14, 54, 94].map((wx) => <rect key={wx} x={wx} y={7} width={30} height={14} rx={3} fill="#fff3a6" />)}
            </g>
          ))}
        </g>
        {/* stijlen en regels van de glaswand */}
        {Array.from({ length: 17 }, (_, i) => (
          <path key={i} d={`M${i * 100} 128 V382`} stroke="#1d2f5c" strokeWidth={i % 2 ? 3 : 8} />
        ))}
        <path d="M0 250 H1600" stroke="#1d2f5c" strokeWidth={6} />
        <path d="M0 196 H1600 M0 316 H1600" stroke="#1d2f5c" strokeWidth={2.5} opacity={0.8} />
        {/* weerspiegelingen in het glas */}
        {[60, 480, 900, 1320].map((x) => (
          <path key={x} d={`M${x} 382 L${x + 120} 128 H${x + 170} L${x + 50} 382Z`} fill="#fff" opacity={0.06} />
        ))}
      </g>

      {/* achterste perron onder de overkapping (verder weg, koeler licht) */}
      <rect x={0} y={380} width={1600} height={200} fill="url(#st-backwall)" />
      <rect x={0} y={380} width={1600} height={16} fill="#1d2f5c" />
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} className="twinkle" style={{ animationDelay: `${(i % 5) * 0.4}s` }} cx={40 + i * 80} cy={388} r={3.4} fill="#fff4c8" />
      ))}
      {[[528, 548], [1046, 548], [1556, 548]].map(([x, y], i) => (
        <g key={i} opacity={0.55}>
          <circle cx={x} cy={y - 40} r={8} fill="#2a2f5a" />
          <rect x={x - 8} y={y - 32} width={16} height={30} rx={6} fill="#2a2f5a" />
        </g>
      ))}

      {/* stalen kolommen in de hal */}
      {[540, 1060].map((x) => (
        <g key={x}>
          <rect x={x - 14} y={136} width={28} height={444} fill="url(#st-column)" stroke={INK} strokeWidth={2.5} />
          <rect x={x - 22} y={136} width={44} height={14} rx={3} fill="#2b3f66" stroke={INK} strokeWidth={2} />
        </g>
      ))}

      <Ceiling />

      {/* feestverlichting en vlaggetjes (Sinterklaas) */}
      <path d="M0 150 Q400 200 800 150 T1600 150" fill="none" stroke={INK} strokeWidth={2.5} opacity={0.5} />
      {Array.from({ length: 40 }, (_, i) => (
        <circle
          key={i}
          className="twinkle"
          style={{ animationDelay: `${(i % 8) * 0.25}s` }}
          cx={20 + i * 40}
          cy={garlandY(20 + i * 40)}
          r={5.5}
          fill={["#ffd45e", "#ff5d8f", "#5cc4ee", "#7be87a"][i % 4]}
        />
      ))}
      {Array.from({ length: 16 }, (_, i) => {
        const x = 50 + i * 100;
        const y = 160 + Math.sin((i / 16) * Math.PI * 4) * 22 + 10;
        return (
          <g key={i} className="flag-sway" style={{ animationDelay: `${(i % 5) * 0.35}s`, transformOrigin: `${x}px ${y}px` }}>
            <path d={`M${x - 16} ${y} L${x + 16} ${y} L${x} ${y + 34}Z`} fill={["#d62f2f", "#fff", "#ffc400"][i % 3]} stroke={INK} strokeWidth={2} />
          </g>
        );
      })}

      {/* stationsnaam */}
      <g>
        <path d="M1160 0 V36 M1500 0 V36" stroke={INK} strokeWidth={4} />
        <rect x={1100} y={34} width={460} height={68} rx={10} fill="#0a3d9e" {...O} />
        <rect x={1108} y={40} width={444} height={10} rx={4} fill="#fff" opacity={0.15} />
        <text x={1330} y={80} textAnchor="middle" fontSize={30} fontWeight={800} fill="#fff" fontFamily={SANS} letterSpacing={1}>{t.stationName.toUpperCase()}</text>
      </g>
      {/* wegwijzers */}
      <g>
        <path d="M1420 138 V240" stroke={INK} strokeWidth={4} />
        <path d="M1380 240 H1540 L1566 262 L1540 284 H1380Z" fill="#ffc917" {...O} />
        <text x={1450} y={270} textAnchor="middle" fontSize={22} fontWeight={800} fill={INK} fontFamily={SANS}>{t.signs.exit}</text>
      </g>
      <g>
        <path d="M340 138 V228 M440 138 V228" stroke={INK} strokeWidth={4} />
        <rect x={290} y={228} width={200} height={42} rx={8} fill="#0a3d9e" {...O} />
        <path d="M304 249 l12 -8 v5 h10 v6 h-10 v5z" fill="#ffc917" />
        <text x={400} y={257} textAnchor="middle" fontSize={22} fontWeight={800} fill="#fff" fontFamily={SANS}>{t.signs.platforms}</text>
      </g>

      {/* hangend vertrekbord met wisselende meldingen (decor) */}
      <g className="decor-board">
        <path d="M600 124 V150 M1000 124 V150" stroke={INK} strokeWidth={5} />
        <rect x={516} y={40} width={568} height={158} rx={12} fill="#2b3f66" {...O} />
        <rect x={526} y={50} width={548} height={138} rx={6} fill="#0c1230" />
        <rect x={526} y={50} width={548} height={34} rx={6} fill="#0a3d9e" />
        <text x={542} y={75} fontSize={22} fontWeight={800} fill="#fff" fontFamily={SANS}>{t.boardTitle.toUpperCase()}</text>
        {allTrains.map((tr, i) => (
          <g key={tr.id}>
            {i % 2 === 0 && <rect x={526} y={88 + i * 24} width={548} height={24} fill="#fff" opacity={0.04} />}
            <text x={542} y={106 + i * 24} fontSize={18} fontWeight={700} fill="#ffd54a" fontFamily={SANS}>
              {`${tr.time}   ${tr.platform}   ${t.kindLabel[tr.kind]}   ${tr.destination}`}
            </text>
          </g>
        ))}
        <path d="M526 162 H1074" stroke="#33468f" strokeWidth={2} />
        {BACKDROP_MSGS.map((m, i) => (
          <text key={m} className="board-msg" style={{ animationDelay: `${i * 4}s` }} x={542} y={182} fontSize={16} fontWeight={800} fill="#7be87a" fontFamily={SANS}>
            {m}
          </text>
        ))}
        <rect x={520} y={44} width={560} height={6} rx={3} fill="#fff" opacity={0.18} />
      </g>
      <g>
        <rect x={610} y={206} width={380} height={34} rx={17} fill="#d62f2f" {...O} />
        <text x={800} y={230} textAnchor="middle" fontSize={20} fontWeight={800} fill="#fff" fontFamily={SANS}>{t.signs.welcome}</text>
      </g>

      {/* stationsklok met mijter */}
      <g>
        <path d="M190 128 V190" stroke={INK} strokeWidth={6} />
        <path d="M156 200 L170 152 Q190 128 210 152 L224 200 Z" fill="#d62f2f" stroke="#ffc400" strokeWidth={4} strokeLinejoin="round" />
        <path d="M190 146 V196 M176 170 H204" stroke="#ffc400" strokeWidth={4} />
        <rect x={150} y={196} width={80} height={10} rx={5} fill="#ffc400" {...O} strokeWidth={2.5} />
        <circle cx={190} cy={256} r={60} fill="url(#st-spot)" />
        <circle cx={190} cy={256} r={54} fill="#2b3f66" {...O} strokeWidth={4} />
        <circle cx={190} cy={256} r={47} fill="#fff" />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M190 212 V222" stroke={INK} strokeWidth={i % 3 === 0 ? 5 : 3} transform={`rotate(${i * 30} 190 256)`} />
        ))}
        <path className="clock-hand" style={{ "--a0": "231deg", animationDuration: "43200s", transformOrigin: "190px 256px" } as CSSProperties} d="M190 256 V232" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <path className="clock-hand" style={{ "--a0": "252deg", animationDuration: "3600s", transformOrigin: "190px 256px" } as CSSProperties} d="M190 256 V218" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path className="clock-hand clock-second" style={{ "--a0": "0deg", animationDuration: "60s", transformOrigin: "190px 256px" } as CSSProperties} d="M190 266 V216" stroke="#e53935" strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={190} cy={256} r={5} fill="#e53935" />
        <path d="M150 232 Q160 214 180 208" fill="none" stroke="#fff" strokeWidth={3} opacity={0.5} strokeLinecap="round" />
      </g>

      {/* perronvloer: rand, veiligheidslijn, tegels in perspectief */}
      <rect x={0} y={576} width={1600} height={324} fill="url(#st-floor)" />
      <rect x={0} y={576} width={1600} height={12} fill="#7b86a6" />
      <rect x={0} y={588} width={1600} height={9} fill="#eef1f8" />
      <path d={Array.from({ length: 80 }, (_, i) => `M${i * 20 + 6} 590 v5`).join(" ")} stroke="#c3c9da" strokeWidth={3} />
      <rect x={0} y={598} width={1600} height={8} fill="#ffc917" />
      <path d="M0 650 H1600 M0 720 H1600 M0 810 H1600" stroke="#a5b0c8" strokeWidth={3} />
      {Array.from({ length: 30 }, (_, i) => {
        const x = -400 + i * 80;
        const xb = x + (x - 800) * 0.9;
        return <path key={i} d={`M${x} 606 L${xb} 900`} stroke="#a5b0c8" strokeWidth={2} />;
      })}

      {/* lichtpoelen op de vloer */}
      {LIGHT_XS.map((x) => <ellipse key={x} cx={x} cy={690} rx={170} ry={40} fill="url(#st-pool)" />)}

      {/* bankje en incheckpaal */}
      <g>
        <rect x={760} y={624} width={150} height={10} rx={4} fill="#a0662f" {...O} strokeWidth={2.2} />
        <rect x={760} y={604} width={150} height={10} rx={4} fill="#b9773a" {...O} strokeWidth={2.2} />
        <path d="M776 634 V660 M894 634 V660 M776 614 V634 M894 614 V634" stroke="#3a4a7a" strokeWidth={5} />
      </g>
      <g>
        <rect x={1112} y={604} width={22} height={66} rx={8} fill="#ffc917" {...O} strokeWidth={2.5} />
        <rect x={1112} y={620} width={22} height={18} fill="#0a3d9e" />
        <circle cx={1123} cy={629} r={4} className="twinkle" fill="#7be87a" />
      </g>

      {/* pepernotenkraam en cadeautjes */}
      <g>
        <ellipse cx={1475} cy={770} rx={120} ry={14} fill="rgba(20,20,50,.25)" />
        <rect x={1380} y={630} width={190} height={130} fill="#f4e2c0" {...O} />
        <rect x={1380} y={630} width={190} height={16} fill="#ffe7a6" opacity={0.8} />
        <path d="M1370 630 L1380 590 H1570 L1580 630 Z" fill="url(#st-awning)" {...O} />
        <path d="M1370 630 Q1389 644 1408 630 Q1427 644 1446 630 Q1465 644 1484 630 Q1503 644 1522 630 Q1541 644 1560 630 Q1570 640 1580 630" fill="#d62f2f" stroke={INK} strokeWidth={2} />
        <text x={1475} y={672} textAnchor="middle" fontSize={15} fontWeight={800} fill={INK} fontFamily={SANS}>{t.signs.pepernoten}</text>
        {[1410, 1450, 1490, 1530].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={712 + (i % 2) * 4} r={11} fill="#b9772f" {...O} strokeWidth={2} />
            <circle cx={x - 3} cy={709 + (i % 2) * 4} r={3} fill="#e6a35c" />
          </g>
        ))}
        <rect x={1376} y={756} width={198} height={10} fill="#8a5a2b" {...O} strokeWidth={2.5} />
        <circle cx={1475} cy={600} r={60} fill="url(#st-pool)" />
      </g>
      <g>
        <rect x={1240} y={720} width={56} height={44} fill="#2b6fd6" {...O} />
        <path d="M1268 720 V764 M1240 742 H1296" stroke="#ffc400" strokeWidth={5} />
        <rect x={1252} y={684} width={40} height={36} fill="#d62f2f" {...O} />
        <path d="M1272 684 V720" stroke="#fff" strokeWidth={5} />
        <path d="M1272 684 q-12 -14 -14 -2 q8 4 14 2 q12 -14 14 -2 q-8 4 -14 2" fill="#ffc400" stroke={INK} strokeWidth={1.6} />
      </g>
    </g>
  );
});

/** Lichtbundels en vignet over de scène (voor sfeer en diepte; niet klikbaar). */
const Atmosphere = memo(function Atmosphere() {
  return (
    <g aria-hidden pointerEvents="none">
      {LIGHT_XS.map((x, i) => (
        <path key={x} className="light-beam" style={{ animationDelay: `${i * 1.3}s` }} d={`M${x - 16} 140 L${x + 16} 140 L${x + 150} 720 L${x - 150} 720Z`} fill="url(#st-beam)" />
      ))}
      {/* kolom op de voorgrond (dichtbij, donker en onscherp-achtig) */}
      <rect x={-30} y={0} width={64} height={900} fill="#1b2140" />
      <rect x={20} y={0} width={10} height={900} fill="#4a5a8a" opacity={0.5} />
      <rect width={1600} height={900} fill="url(#st-vignette)" />
    </g>
  );
});

/** Rotterdam Centraal: perrons, treinen, reizigers en klok (vaste viewBox 1600 × 900). */
export default function StationScene({ litTrainId, flash, boardTrainId, minou, departing, announcing, minouMood = "neutral", emote = null }: Props) {
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
        <path d="M-6 -2 H18 L40 -16 V42 L18 28 H-6Z" fill="#2b3f66" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
        <path d="M0 4 V22" stroke="#fff" strokeWidth={2} opacity={0.3} />
        <path className="wave w1" d="M52 4 Q66 13 52 22" fill="none" stroke="#ffc917" strokeWidth={4} strokeLinecap="round" />
        <path className="wave w2" d="M62 -6 Q86 13 62 32" fill="none" stroke="#ffc917" strokeWidth={4} strokeLinecap="round" />
        <path className="wave w3" d="M72 -16 Q106 13 72 42" fill="none" stroke="#ffc917" strokeWidth={4} strokeLinecap="round" />
      </g>

      {allTrains.map((tr, i) => {
        const x = TRAIN_XS[i];
        const lit = litTrainId === tr.id;
        const isBoard = tr.id === boardTrainId;
        const f = flash !== null && flash.trainId === tr.id;
        return (
          <g key={tr.id}>
            {/* perronbord aan twee stangen */}
            <path d={`M${x + 70} 138 V330 M${x + 370} 138 V330`} stroke={INK} strokeWidth={5} />
            <path d={`M${x + 70} 330 H${x + 370}`} stroke={INK} strokeWidth={4} />
            {lit && <ellipse cx={x + 220} cy={370} rx={110} ry={60} fill="url(#st-spot)" />}
            <rect x={x + 150} y={326} width={140} height={84} rx={12} fill={lit ? "#2fb36d" : "#0a3d9e"} {...O} className={lit ? "platform-sign sign-lit" : "platform-sign"} />
            <rect x={x + 156} y={332} width={128} height={8} rx={4} fill="#fff" opacity={0.2} />
            <rect x={x + 150} y={398} width={140} height={6} fill="#ffc917" opacity={lit ? 0 : 1} />
            <text x={x + 220} y={354} textAnchor="middle" fontSize={17} fontWeight={800} fill="#fff" fontFamily={SANS}>PERRON</text>
            <text x={x + 220} y={394} textAnchor="middle" fontSize={42} fontWeight={800} fill="#fff" fontFamily={SANS}>{tr.platform}</text>
            {lit && <path className="found-arrow" d={`M${x + 220} 300 l-16 -22 h10 v-22 h12 v22 h10z`} fill="#ffd45e" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />}

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

      {/* duiven en reizigers (bewegen subtiel) */}
      <Pigeon x={610} y={770} delay={0} />
      <Pigeon x={650} y={786} flip delay={-1.1} />
      <Pigeon x={1050} y={800} delay={-0.5} />
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
            <MinouHero mood={minouMood} />
            {emote && minou === "idle" && (
              <g>{/* extra laag: `.minou-marker > *` krijgt een CSS-hop die een transform-attribuut zou overschrijven */}
              <g transform="translate(30 -150)">
               <g key={emote} className="emote-pop">
                <path d="M-18 -16 Q-18 -32 0 -32 Q18 -32 18 -16 Q18 0 0 0 L-8 8 L-6 0 Q-18 0 -18 -16Z" fill="#fff" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
                <text x={0} y={-8} textAnchor="middle" fontSize={22} fontWeight={900} fill={emote === "♥" ? "#e8174f" : emote === "!" ? "#d62f2f" : "#0a3d9e"} fontFamily={SANS}>
                  {emote}
                </text>
               </g>
              </g>
              </g>
            )}
          </g>
        </g>
      )}

      <Atmosphere />
    </svg>
  );
}
