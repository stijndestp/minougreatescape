/**
 * Tijdelijke SVG-tekeningen van de voorwerpen in de Tilburg-slaapkamer.
 * Elke tekening heeft haar oorsprong ONDERAAN IN HET MIDDEN (0,0) en groeit
 * omhoog (negatieve y). `w`/`h` is het klikgebied. Vervang een tekening gerust
 * door een echte illustratie; de rest van de scène blijft ongewijzigd.
 */
import type { ReactNode } from "react";
import type { ArtId } from "@/content/tilburg";

export interface Art {
  w: number;
  h: number;
  render: () => ReactNode;
}

const stroke = { stroke: "#2b1b3d", strokeWidth: 2.5, strokeLinejoin: "round" as const };

export const itemArt: Record<ArtId, Art> = {
  sieraden: {
    w: 96, h: 70,
    render: () => (
      <g>
        <rect x={-42} y={-24} width={84} height={24} rx={7} fill="#ff6b9a" {...stroke} />
        <rect x={-36} y={-31} width={72} height={12} rx={4} fill="#ffd1e3" {...stroke} />
        <path d="M-30 -30 Q-14 -66 4 -30" fill="none" stroke="#ffc400" strokeWidth={4} strokeLinecap="round" />
        <path d="M-6 -30 Q14 -60 32 -30" fill="none" stroke="#ff9f1c" strokeWidth={4} strokeLinecap="round" />
        <circle cx={-12} cy={-48} r={5} fill="#5cc4ee" {...stroke} />
        <circle cx={18} cy={-44} r={5} fill="#c7a6f5" {...stroke} />
        <circle cx={30} cy={-12} r={5} fill="none" stroke="#ffc400" strokeWidth={4} />
        <circle cx={-26} cy={-12} r={5} fill="none" stroke="#ffc400" strokeWidth={4} />
      </g>
    ),
  },
  "foto-job": {
    w: 70, h: 86,
    render: () => (
      <g>
        <path d="M-10 -8 L0 -2 L10 -8" fill="none" stroke="#a96d33" strokeWidth={4} />
        <rect x={-32} y={-82} width={64} height={76} rx={6} fill="#c98a4b" {...stroke} />
        <rect x={-25} y={-75} width={50} height={62} rx={3} fill="#bfe6ff" />
        <circle cx={0} cy={-50} r={13} fill="#ffd9b8" {...stroke} />
        <path d="M-14 -52 Q0 -72 14 -52 Q0 -60 -14 -52Z" fill="#4a2c17" />
        <path d="M-20 -13 Q0 -38 20 -13Z" fill="#2b6fd6" {...stroke} />
        <path d="M18 -66 c-4 -6 -12 0 -6 6 l6 5 l6 -5 c6 -6 -2 -12 -6 -6z" fill="#ff3d68" transform="translate(-4 2) scale(.8)" />
      </g>
    ),
  },
  studentenpas: {
    w: 62, h: 42,
    render: () => (
      <g transform="rotate(-6)">
        <rect x={-30} y={-40} width={60} height={40} rx={6} fill="#4cc9f0" {...stroke} />
        <rect x={-24} y={-33} width={20} height={22} rx={2} fill="#ffd9b8" />
        <circle cx={-14} cy={-25} r={5} fill="#d6401f" />
        <rect x={2} y={-33} width={22} height={5} rx={2} fill="#fff" />
        <rect x={2} y={-24} width={18} height={4} rx={2} fill="#fff" />
        <text x={-2} y={-7} fontSize={8} fontWeight={800} fill="#14507a" fontFamily="sans-serif">STUDENT</text>
      </g>
    ),
  },
  "ov-kaart": {
    w: 62, h: 42,
    render: () => (
      <g transform="rotate(8)">
        <rect x={-30} y={-40} width={60} height={40} rx={6} fill="#ffd45e" {...stroke} />
        <rect x={-30} y={-32} width={60} height={11} fill="#2b6fd6" />
        <rect x={-22} y={-14} width={14} height={9} rx={2} fill="#c98a00" />
        <text x={2} y={-6} fontSize={13} fontWeight={800} fill="#2b1b3d" fontFamily="sans-serif">OV</text>
      </g>
    ),
  },
  haarshampoo: {
    w: 42, h: 90,
    render: () => (
      <g>
        <rect x={-18} y={-66} width={36} height={66} rx={12} fill="#e0301e" {...stroke} />
        <rect x={-8} y={-76} width={16} height={12} fill="#fff" {...stroke} />
        <rect x={-11} y={-88} width={22} height={14} rx={4} fill="#fff" {...stroke} />
        <rect x={-13} y={-48} width={26} height={28} rx={5} fill="#fff" />
        <path d="M-8 -28 Q-2 -46 2 -34 Q6 -26 9 -42" fill="none" stroke="#d6401f" strokeWidth={4} strokeLinecap="round" />
      </g>
    ),
  },
  boek: {
    w: 52, h: 70,
    render: () => (
      <g transform="rotate(-4)">
        <rect x={-24} y={-68} width={48} height={68} rx={4} fill="#2b6fd6" {...stroke} />
        <rect x={-24} y={-68} width={9} height={68} rx={3} fill="#1f4fa0" />
        <ellipse cx={5} cy={-44} rx={14} ry={10} fill="#fff" />
        <path d="M-4 -36 L-8 -28 L4 -35Z" fill="#fff" />
        <rect x={-6} y={-48} width={22} height={3} rx={1.5} fill="#2b6fd6" />
        <rect x={-6} y={-42} width={14} height={3} rx={1.5} fill="#2b6fd6" />
        <rect x={-8} y={-18} width={28} height={5} rx={2} fill="#ffd45e" />
      </g>
    ),
  },
  pepernoten: {
    w: 80, h: 56,
    render: () => (
      <g>
        <path d="M-36 -26 H36 Q32 0 0 0 Q-32 0 -36 -26Z" fill="#fff6e0" {...stroke} />
        {[[-20, -32, 10], [0, -37, 10], [20, -32, 10], [-9, -46, 9], [11, -47, 9]].map(([x, y, r]) => (
          <g key={`${x}${y}`}>
            <circle cx={x} cy={y} r={r} fill="#b8742e" {...stroke} />
            <circle cx={x - 3} cy={y - 3} r={2.5} fill="#d9a066" />
          </g>
        ))}
      </g>
    ),
  },
  airfryer: {
    w: 112, h: 96,
    render: () => (
      <g>
        <rect x={-52} y={-92} width={104} height={92} rx={24} fill="#3a3a4a" {...stroke} />
        <rect x={-42} y={-58} width={84} height={44} rx={12} fill="#55556a" {...stroke} />
        <rect x={-24} y={-46} width={48} height={11} rx={5} fill="#aab" />
        <rect x={-32} y={-82} width={34} height={9} rx={3} fill="#7be3ff" />
        <circle cx={30} cy={-77} r={8} fill="#ff7043" {...stroke} />
        <rect x={-46} y={-4} width={14} height={4} fill="#222" />
        <rect x={32} y={-4} width={14} height={4} fill="#222" />
      </g>
    ),
  },
  baksteen: {
    w: 78, h: 38,
    render: () => (
      <g>
        <rect x={-38} y={-36} width={76} height={36} rx={4} fill="#d9552f" {...stroke} />
        <rect x={-34} y={-32} width={68} height={8} rx={2} fill="#ea7a52" />
        <ellipse cx={-14} cy={-16} rx={6} ry={3} fill="#a8391a" />
        <ellipse cx={14} cy={-16} rx={6} ry={3} fill="#a8391a" />
      </g>
    ),
  },
  gourmetstel: {
    w: 120, h: 60,
    render: () => (
      <g>
        <rect x={-56} y={-20} width={112} height={20} rx={7} fill="#4a4a55" {...stroke} />
        <rect x={-56} y={-28} width={112} height={10} rx={4} fill="#9aa0aa" {...stroke} />
        {[-38, -13, 13, 38].map((x, i) => (
          <g key={x}>
            <ellipse cx={x} cy={-36} rx={11} ry={6} fill={["#e0301e", "#ffc400", "#2fb36d", "#5cc4ee"][i]} {...stroke} />
            <rect x={x + 8} y={-39} width={14} height={4} rx={2} fill="#3a3a4a" />
          </g>
        ))}
        <circle cx={-44} cy={-10} r={4} fill="#ff7043" />
      </g>
    ),
  },
  fietspomp: {
    w: 56, h: 118,
    render: () => (
      <g transform="rotate(9)">
        <rect x={-18} y={-10} width={36} height={10} rx={4} fill="#3a3a4a" {...stroke} />
        <rect x={-7} y={-96} width={14} height={88} rx={4} fill="#e0301e" {...stroke} />
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
        <ellipse cx={0} cy={-48} rx={62} ry={20} fill="#ffe066" {...stroke} />
        <ellipse cx={-26} cy={-48} rx={9} ry={4} fill="#e6a800" />
        <ellipse cx={20} cy={-44} rx={11} ry={5} fill="#e6a800" />
        <ellipse cx={-4} cy={-54} rx={6} ry={3} fill="#e6a800" />
        <ellipse cx={-36} cy={-26} rx={6} ry={7} fill="#e6a800" />
        <ellipse cx={30} cy={-22} rx={7} ry={8} fill="#e6a800" />
      </g>
    ),
  },
  knuffel: {
    w: 74, h: 84,
    render: () => (
      <g>
        <ellipse cx={-14} cy={-6} rx={11} ry={8} fill="#b8742e" {...stroke} />
        <ellipse cx={14} cy={-6} rx={11} ry={8} fill="#b8742e" {...stroke} />
        <ellipse cx={0} cy={-30} rx={23} ry={26} fill="#b8742e" {...stroke} />
        <ellipse cx={-26} cy={-32} rx={8} ry={14} fill="#b8742e" transform="rotate(20 -26 -32)" {...stroke} />
        <ellipse cx={26} cy={-32} rx={8} ry={14} fill="#b8742e" transform="rotate(-20 26 -32)" {...stroke} />
        <ellipse cx={0} cy={-26} rx={13} ry={15} fill="#e0a56a" />
        <circle cx={-16} cy={-76} r={8} fill="#b8742e" {...stroke} />
        <circle cx={16} cy={-76} r={8} fill="#b8742e" {...stroke} />
        <circle cx={0} cy={-62} r={20} fill="#b8742e" {...stroke} />
        <ellipse cx={0} cy={-57} rx={9} ry={7} fill="#e0a56a" />
        <circle cx={-7} cy={-67} r={2.5} fill="#2b1b3d" />
        <circle cx={7} cy={-67} r={2.5} fill="#2b1b3d" />
        <ellipse cx={0} cy={-59} rx={3.5} ry={2.5} fill="#2b1b3d" />
        <path d="M-9 -42 L0 -38 L9 -42 L9 -34 L0 -38 L-9 -34Z" fill="#e0301e" {...stroke} />
      </g>
    ),
  },
  stoomboot: {
    w: 108, h: 98,
    render: () => (
      <g>
        <circle cx={14} cy={-90} r={7} fill="#cfd4dc" opacity={0.85} />
        <circle cx={24} cy={-80} r={9} fill="#dde1e8" opacity={0.85} />
        <rect x={-8} y={-72} width={16} height={26} fill="#e0301e" {...stroke} />
        <rect x={-10} y={-76} width={20} height={7} rx={2} fill="#2b1b3d" />
        <rect x={-28} y={-50} width={50} height={26} rx={4} fill="#fff" {...stroke} />
        <circle cx={-14} cy={-38} r={5} fill="#5cc4ee" {...stroke} />
        <circle cx={6} cy={-38} r={5} fill="#5cc4ee" {...stroke} />
        <path d="M-52 -28 H52 L38 0 H-38Z" fill="#2b6fd6" {...stroke} />
        <rect x={-46} y={-18} width={92} height={5} fill="#fff" opacity={0.9} />
      </g>
    ),
  },
};
