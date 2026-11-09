/**
 * SVG-tekeningen van de voorwerpen in de Tilburg-slaapkamer.
 * Elke tekening heeft haar oorsprong ONDERAAN IN HET MIDDEN (0,0) en groeit
 * omhoog (negatieve y). `w`/`h` is het klikgebied. Vervang een tekening gerust
 * door een echte illustratie; de rest van de scène blijft ongewijzigd.
 * Stijl: inktlijn #2b1b3d, licht van linksboven (glimlichtjes), schaduwzijde rechts.
 */
import type { ReactNode } from "react";
import type { ArtId } from "@/content/tilburg";

export interface Art {
  w: number;
  h: number;
  render: () => ReactNode;
}

const INK = "#2b1b3d";
const stroke = { stroke: INK, strokeWidth: 2.5, strokeLinejoin: "round" as const };
const shine = { fill: "none", stroke: "#fff", strokeLinecap: "round" as const, opacity: 0.75 };

export const itemArt: Record<ArtId, Art> = {
  sieraden: {
    w: 96, h: 70,
    render: () => (
      <g>
        {/* juwelenkistje met deksel open */}
        <path d="M-36 -31 L-30 -52 H30 L36 -31Z" fill="#ff8fb3" {...stroke} />
        <path d="M-26 -48 H26" stroke="#ffc400" strokeWidth={2.5} />
        <rect x={-42} y={-24} width={84} height={24} rx={7} fill="#ff6b9a" {...stroke} />
        <rect x={-36} y={-31} width={72} height={12} rx={4} fill="#ffd1e3" {...stroke} />
        <rect x={-6} y={-16} width={12} height={8} rx={2} fill="#ffc400" stroke={INK} strokeWidth={1.6} />
        <path d="M30 -20 V-6" stroke="#d94c80" strokeWidth={4} opacity={0.6} />
        {/* kettingen en ringoorbellen */}
        <path d="M-30 -30 Q-14 -66 4 -30" fill="none" stroke="#ffc400" strokeWidth={4} strokeLinecap="round" />
        <path d="M-6 -30 Q14 -60 32 -30" fill="none" stroke="#ff9f1c" strokeWidth={4} strokeLinecap="round" />
        <path d="M-24 -38 Q-16 -54 -6 -42" {...shine} strokeWidth={1.4} />
        <circle cx={-12} cy={-48} r={5} fill="#5cc4ee" {...stroke} strokeWidth={2} />
        <circle cx={18} cy={-44} r={5} fill="#c7a6f5" {...stroke} strokeWidth={2} />
        <circle cx={-13.5} cy={-49.5} r={1.4} fill="#fff" />
        <circle cx={16.5} cy={-45.5} r={1.4} fill="#fff" />
        <circle cx={30} cy={-12} r={6} fill="none" stroke="#ffc400" strokeWidth={4} />
        <circle cx={-26} cy={-12} r={6} fill="none" stroke="#ffc400" strokeWidth={4} />
        <path d="M-40 -20 Q-38 -8 -30 -4" {...shine} strokeWidth={2.4} opacity={0.5} />
      </g>
    ),
  },
  "foto-job": {
    w: 70, h: 86,
    render: () => (
      <g>
        <path d="M-10 -8 L0 -2 L10 -8" fill="none" stroke="#a96d33" strokeWidth={4} />
        <rect x={-32} y={-82} width={64} height={76} rx={6} fill="#c98a4b" {...stroke} />
        <rect x={-28} y={-78} width={56} height={6} rx={3} fill="#e0a868" />
        <rect x={-25} y={-75} width={50} height={62} rx={3} fill="#bfe6ff" stroke={INK} strokeWidth={1.6} />
        <rect x={-25} y={-36} width={50} height={23} fill="#a8ebdb" />
        {/* Job, zelfde stijl als zijn personage in Delft */}
        <path d="M-20 -13 Q-20 -36 0 -36 Q20 -36 20 -13Z" fill="#2b8fb3" {...stroke} strokeWidth={2} />
        <path d="M-5 -36 L0 -30 L5 -36" fill="#fff" stroke={INK} strokeWidth={1.4} />
        <circle cx={0} cy={-50} r={13} fill="#f2c9a0" {...stroke} strokeWidth={2} />
        <path d="M-14 -51 Q-15 -66 -1 -67 Q7 -73 13 -65 Q16 -58 14 -51 Q10 -59 3 -58 Q-6 -62 -14 -51Z" fill="#4a2c17" stroke={INK} strokeWidth={1.6} strokeLinejoin="round" />
        <circle cx={-5} cy={-49} r={1.6} fill={INK} />
        <circle cx={5} cy={-49} r={1.6} fill={INK} />
        <path d="M-5 -43 Q0 -39 5 -43" fill="none" stroke="#c2185b" strokeWidth={1.8} strokeLinecap="round" />
        <path d="M18 -66 c-4 -6 -12 0 -6 6 l6 5 l6 -5 c6 -6 -2 -12 -6 -6z" fill="#ff3d68" stroke={INK} strokeWidth={1.2} transform="translate(-4 2) scale(.8)" />
        <path d="M-22 -72 L-8 -72" {...shine} strokeWidth={3} opacity={0.6} />
      </g>
    ),
  },
  studentenpas: {
    w: 62, h: 42,
    render: () => (
      <g transform="rotate(-6)">
        <rect x={-30} y={-40} width={60} height={40} rx={6} fill="#4cc9f0" {...stroke} />
        <rect x={-30} y={-40} width={60} height={9} rx={6} fill="#2ba6cf" />
        <rect x={-24} y={-30} width={20} height={20} rx={2} fill="#ffe3ee" stroke={INK} strokeWidth={1.2} />
        {/* mini-Minou: rood haar en gouden ringetjes */}
        <circle cx={-14} cy={-20} r={6} fill="#d6401f" />
        <circle cx={-14} cy={-19} r={4} fill="#ffd9b8" />
        <circle cx={-18.5} cy={-16} r={1.6} fill="none" stroke="#ffc400" strokeWidth={1} />
        <circle cx={-9.5} cy={-16} r={1.6} fill="none" stroke="#ffc400" strokeWidth={1} />
        <rect x={2} y={-30} width={22} height={4} rx={2} fill="#fff" />
        <rect x={2} y={-23} width={16} height={3.5} rx={1.75} fill="#fff" />
        <rect x={18} y={-37} width={8} height={5} rx={1} fill="#ffc400" />
        <text x={-1} y={-4} fontSize={8} fontWeight={800} fill="#14507a" fontFamily="sans-serif">STUDENT</text>
        <path d="M-26 -36 L-6 -36" {...shine} strokeWidth={2} opacity={0.5} />
      </g>
    ),
  },
  "ov-kaart": {
    w: 62, h: 42,
    render: () => (
      <g transform="rotate(8)">
        <rect x={-30} y={-40} width={60} height={40} rx={6} fill="#ffd45e" {...stroke} />
        <rect x={-30} y={-32} width={60} height={11} fill="#2b6fd6" />
        <path d="M-30 -27 H30" stroke="#fff" strokeWidth={1.5} opacity={0.6} />
        <rect x={-22} y={-15} width={14} height={10} rx={2} fill="#e6b800" stroke={INK} strokeWidth={1.2} />
        <path d="M-22 -10 H-8 M-15 -15 V-5" stroke={INK} strokeWidth={0.8} opacity={0.6} />
        <text x={2} y={-6} fontSize={13} fontWeight={800} fill={INK} fontFamily="sans-serif">OV</text>
        <path d="M-26 -36 L-4 -36" {...shine} strokeWidth={2} opacity={0.6} />
      </g>
    ),
  },
  haarshampoo: {
    w: 42, h: 90,
    render: () => (
      <g>
        <rect x={-18} y={-66} width={36} height={66} rx={12} fill="#e0301e" {...stroke} />
        <path d="M8 -60 Q16 -40 10 -6 H14 Q18 -6 18 -14 V-54Z" fill="#a8200f" opacity={0.6} />
        <rect x={-8} y={-76} width={16} height={12} fill="#fff" {...stroke} />
        <rect x={-11} y={-88} width={22} height={14} rx={4} fill="#fff" {...stroke} />
        <path d="M11 -84 h8 v4 h-8" fill="#fff" stroke={INK} strokeWidth={1.8} />
        <rect x={-13} y={-48} width={26} height={28} rx={5} fill="#fff" stroke={INK} strokeWidth={1.4} />
        <path d="M-8 -28 Q-2 -46 2 -34 Q6 -26 9 -42" fill="none" stroke="#d6401f" strokeWidth={4} strokeLinecap="round" />
        <path d="M-12 -58 V-14" {...shine} strokeWidth={3} />
      </g>
    ),
  },
  boek: {
    w: 52, h: 70,
    render: () => (
      <g transform="rotate(-4)">
        <path d="M24 -66 L28 -63 V2 L24 0Z" fill="#fffbe8" stroke={INK} strokeWidth={1.8} />
        <rect x={-24} y={-68} width={48} height={68} rx={4} fill="#2b6fd6" {...stroke} />
        <rect x={-24} y={-68} width={9} height={68} rx={3} fill="#1f4fa0" />
        <path d="M-15 -60 V-8" stroke="#5a93ef" strokeWidth={1.5} />
        {/* spraakwolkjes: "communicatie" */}
        <ellipse cx={5} cy={-46} rx={14} ry={10} fill="#fff" stroke={INK} strokeWidth={1.4} />
        <path d="M-4 -38 L-8 -30 L4 -37Z" fill="#fff" />
        <ellipse cx={12} cy={-30} rx={8} ry={6} fill="#ffd45e" stroke={INK} strokeWidth={1.2} />
        <rect x={-4} y={-49} width={18} height={3} rx={1.5} fill="#2b6fd6" />
        <rect x={-4} y={-44} width={12} height={3} rx={1.5} fill="#2b6fd6" />
        <rect x={-8} y={-16} width={28} height={5} rx={2} fill="#ffd45e" />
        <path d="M-10 -64 H18" {...shine} strokeWidth={2} opacity={0.5} />
      </g>
    ),
  },
  pepernoten: {
    w: 80, h: 56,
    render: () => (
      <g>
        {/* zakje met strik */}
        <path d="M-36 -26 H36 Q32 0 0 0 Q-32 0 -36 -26Z" fill="#fff6e0" {...stroke} />
        <path d="M-30 -14 Q0 -6 30 -14" fill="none" stroke="#d62f2f" strokeWidth={3} />
        <path d="M-6 -12 q-8 -8 -10 2 q6 4 10 -2 q8 -8 10 2 q-6 4 -10 -2" fill="#d62f2f" stroke={INK} strokeWidth={1.4} />
        {[[-20, -32, 10], [0, -37, 10], [20, -32, 10], [-9, -46, 9], [11, -47, 9]].map(([x, y, r]) => (
          <g key={`${x}${y}`}>
            <circle cx={x} cy={y} r={r} fill="#b8742e" {...stroke} strokeWidth={2} />
            <circle cx={x - 3} cy={y - 3} r={2.5} fill="#d9a066" />
            <circle cx={x + 3} cy={y + 2} r={1.2} fill="#8a5420" />
          </g>
        ))}
        <path d="M-32 -22 Q-28 -8 -18 -4" {...shine} strokeWidth={2.5} opacity={0.6} />
      </g>
    ),
  },
  airfryer: {
    w: 112, h: 96,
    render: () => (
      <g>
        <rect x={-52} y={-92} width={104} height={92} rx={24} fill="#3a3a4a" {...stroke} />
        <path d="M30 -88 Q52 -80 52 -60 V-24 Q52 -4 30 -2Z" fill="#2a2a38" />
        <rect x={-42} y={-58} width={84} height={44} rx={12} fill="#55556a" {...stroke} />
        <rect x={-24} y={-46} width={48} height={11} rx={5} fill="#aab" stroke={INK} strokeWidth={1.6} />
        <rect x={-32} y={-82} width={34} height={10} rx={3} fill="#7be3ff" stroke={INK} strokeWidth={1.4} />
        <text x={-15} y={-74} textAnchor="middle" fontSize={8} fontWeight={800} fill="#0b4a60" fontFamily="sans-serif">200°</text>
        <circle cx={30} cy={-77} r={8} fill="#ff7043" {...stroke} strokeWidth={2} />
        <path d="M30 -83 V-77" stroke="#fff" strokeWidth={2} strokeLinecap="round" />
        <rect x={-46} y={-4} width={14} height={4} fill="#222" />
        <rect x={32} y={-4} width={14} height={4} fill="#222" />
        <path d="M-44 -80 Q-46 -50 -42 -24" {...shine} strokeWidth={3} opacity={0.35} />
      </g>
    ),
  },
  baksteen: {
    w: 78, h: 38,
    render: () => (
      <g>
        <path d="M38 -36 L44 -32 V2 L38 0Z" fill="#a8391a" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <rect x={-38} y={-36} width={76} height={36} rx={4} fill="#d9552f" {...stroke} />
        <rect x={-34} y={-32} width={68} height={8} rx={2} fill="#ea7a52" />
        <ellipse cx={-14} cy={-16} rx={6} ry={3} fill="#a8391a" />
        <ellipse cx={14} cy={-16} rx={6} ry={3} fill="#a8391a" />
        {[[-28, -8], [-4, -26], [24, -6], [6, -10]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={1.4} fill="#a8391a" />)}
      </g>
    ),
  },
  gourmetstel: {
    w: 120, h: 60,
    render: () => (
      <g>
        <rect x={-56} y={-20} width={112} height={20} rx={7} fill="#4a4a55" {...stroke} />
        <rect x={-56} y={-28} width={112} height={10} rx={4} fill="#9aa0aa" {...stroke} />
        <path d="M-50 -25 H50" stroke="#c8cdd6" strokeWidth={2} />
        {[-38, -13, 13, 38].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={-36} rx={11} ry={6} fill={["#e0301e", "#ffc400", "#2fb36d", "#5cc4ee"][i]} {...stroke} strokeWidth={2} />
            <ellipse cx={x - 3} cy={-38} rx={4} ry={1.6} fill="#fff" opacity={0.6} />
            <rect x={x + 8} y={-39} width={14} height={4} rx={2} fill="#3a3a4a" />
          </g>
        ))}
        <circle cx={-44} cy={-10} r={4} fill="#ff7043" />
        <rect x={-30} y={-13} width={50} height={4} rx={2} fill="#33333f" />
      </g>
    ),
  },
  fietspomp: {
    w: 56, h: 118,
    render: () => (
      <g transform="rotate(9)">
        <rect x={-18} y={-10} width={36} height={10} rx={4} fill="#3a3a4a" {...stroke} />
        <rect x={-7} y={-96} width={14} height={88} rx={4} fill="#e0301e" {...stroke} />
        <path d="M-3 -90 V-14" {...shine} strokeWidth={2.5} opacity={0.6} />
        <circle cx={0} cy={-40} r={7} fill="#fff" stroke={INK} strokeWidth={1.8} />
        <path d="M0 -40 L3 -44" stroke="#e0301e" strokeWidth={1.5} />
        <rect x={-26} y={-108} width={52} height={11} rx={5} fill="#3a3a4a" {...stroke} />
        <path d="M7 -30 Q36 -26 30 -2" fill="none" stroke="#3a3a4a" strokeWidth={4} strokeLinecap="round" />
      </g>
    ),
  },
  kaaswiel: {
    w: 130, h: 84,
    render: () => (
      <g>
        <path d="M-62 -48 V-14 A62 18 0 0 0 62 -14 V-48Z" fill="#ffc933" {...stroke} />
        <path d="M30 -32 V-4 A62 18 0 0 0 62 -14 V-40Z" fill="#e6a800" opacity={0.5} />
        <ellipse cx={0} cy={-48} rx={62} ry={20} fill="#ffe066" {...stroke} />
        <path d="M-62 -36 A62 18 0 0 0 62 -36" fill="none" stroke="#e05a1a" strokeWidth={3} opacity={0.5} />
        <ellipse cx={-26} cy={-48} rx={9} ry={4} fill="#e6a800" />
        <ellipse cx={20} cy={-44} rx={11} ry={5} fill="#e6a800" />
        <ellipse cx={-4} cy={-54} rx={6} ry={3} fill="#e6a800" />
        <ellipse cx={-36} cy={-26} rx={6} ry={7} fill="#e6a800" />
        <ellipse cx={30} cy={-22} rx={7} ry={8} fill="#e6a800" />
        <rect x={-14} y={-30} width={28} height={14} rx={3} fill="#fff" stroke={INK} strokeWidth={1.4} />
        <path d="M-10 -23 h20" stroke="#d62f2f" strokeWidth={2} />
        <path d="M-40 -60 Q-10 -68 22 -62" {...shine} strokeWidth={3} opacity={0.6} />
      </g>
    ),
  },
  knuffel: {
    w: 74, h: 84,
    render: () => (
      <g>
        <ellipse cx={-14} cy={-6} rx={11} ry={8} fill="#b8742e" {...stroke} />
        <ellipse cx={14} cy={-6} rx={11} ry={8} fill="#b8742e" {...stroke} />
        <ellipse cx={-14} cy={-6} rx={6} ry={4} fill="#e0a56a" />
        <ellipse cx={14} cy={-6} rx={6} ry={4} fill="#e0a56a" />
        <ellipse cx={0} cy={-30} rx={23} ry={26} fill="#b8742e" {...stroke} />
        <ellipse cx={-26} cy={-32} rx={8} ry={14} fill="#b8742e" transform="rotate(20 -26 -32)" {...stroke} />
        <ellipse cx={26} cy={-32} rx={8} ry={14} fill="#b8742e" transform="rotate(-20 26 -32)" {...stroke} />
        <ellipse cx={0} cy={-26} rx={13} ry={15} fill="#e0a56a" />
        <path d="M-6 -24 h12 M-4 -30 h8" stroke="#c48a50" strokeWidth={1.4} opacity={0.6} />
        <circle cx={-16} cy={-76} r={8} fill="#b8742e" {...stroke} />
        <circle cx={16} cy={-76} r={8} fill="#b8742e" {...stroke} />
        <circle cx={-16} cy={-76} r={4} fill="#e0a56a" />
        <circle cx={16} cy={-76} r={4} fill="#e0a56a" />
        <circle cx={0} cy={-62} r={20} fill="#b8742e" {...stroke} />
        <ellipse cx={0} cy={-57} rx={9} ry={7} fill="#e0a56a" />
        <circle cx={-7} cy={-67} r={2.5} fill={INK} />
        <circle cx={7} cy={-67} r={2.5} fill={INK} />
        <circle cx={-6.2} cy={-67.8} r={0.8} fill="#fff" />
        <circle cx={7.8} cy={-67.8} r={0.8} fill="#fff" />
        <ellipse cx={0} cy={-59} rx={3.5} ry={2.5} fill={INK} />
        <path d="M-3 -54 Q0 -51 3 -54" fill="none" stroke={INK} strokeWidth={1.4} strokeLinecap="round" />
        <path d="M-9 -42 L0 -38 L9 -42 L9 -34 L0 -38 L-9 -34Z" fill="#e0301e" {...stroke} strokeWidth={2} />
        <path d="M-14 -72 Q-8 -78 -2 -76" {...shine} strokeWidth={2} opacity={0.4} />
      </g>
    ),
  },
  stoomboot: {
    w: 108, h: 98,
    render: () => (
      <g>
        <circle className="tb-smoke" cx={14} cy={-90} r={7} fill="#cfd4dc" opacity={0.85} />
        <circle className="tb-smoke" style={{ animationDelay: "-1s" }} cx={24} cy={-80} r={9} fill="#dde1e8" opacity={0.85} />
        <rect x={-8} y={-72} width={16} height={26} fill="#e0301e" {...stroke} />
        <rect x={-8} y={-62} width={16} height={5} fill="#fff" />
        <rect x={-10} y={-76} width={20} height={7} rx={2} fill={INK} />
        <rect x={-28} y={-50} width={50} height={26} rx={4} fill="#fff" {...stroke} />
        <circle cx={-14} cy={-38} r={5} fill="#5cc4ee" {...stroke} strokeWidth={2} />
        <circle cx={6} cy={-38} r={5} fill="#5cc4ee" {...stroke} strokeWidth={2} />
        <path d="M-52 -28 H52 L38 0 H-38Z" fill="#2b6fd6" {...stroke} />
        <path d="M24 -28 H52 L38 0 H22Z" fill="#1f4fa0" opacity={0.6} />
        <rect x={-46} y={-18} width={92} height={5} fill="#fff" opacity={0.9} />
        <path d="M30 -64 V-50 M30 -64 L44 -56 L30 -54" fill="#d62f2f" stroke={INK} strokeWidth={1.4} />
      </g>
    ),
  },
};
