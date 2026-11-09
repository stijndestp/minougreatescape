import { memo, type CSSProperties } from "react";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
const TRIM = "#f4ead8";

/** Deterministische pseudo-willekeur voor decorpatronen. */
const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type Gable = "step" | "bell" | "point" | "flat";
/** [x, breedte, hoogte, kleur, topgevel] — gevels langs de gracht, voeten op y = 560. */
const LEFT: [number, number, number, string, Gable][] = [
  [0, 120, 330, "#c9704f", "step"], [118, 104, 270, "#e6c06a", "bell"], [220, 126, 350, "#9c5a76", "point"],
  [344, 100, 290, "#7fa3cc", "step"], [442, 118, 250, "#e6a064", "bell"],
];
const RIGHT: [number, number, number, string, Gable][] = [
  [1040, 118, 260, "#e6a064", "bell"], [1156, 100, 300, "#b85c40", "step"], [1254, 126, 350, "#7fa3cc", "point"],
  [1378, 104, 280, "#e6c06a", "bell"], [1480, 120, 330, "#9c5a76", "step"],
];

function roofPath(x: number, w: number, top: number, g: Gable) {
  if (g === "step") return `M${x} ${top} h${w * 0.18} v-20 h${w * 0.12} v-20 h${w * 0.12} v-20 h${w * 0.16} v20 h${w * 0.12} v20 h${w * 0.12} v20 h${w * 0.18} Z`;
  if (g === "bell") return `M${x} ${top} Q${x + w * 0.06} ${top - 20} ${x + w * 0.2} ${top - 26} Q${x + w * 0.24} ${top - 50} ${x + w * 0.5} ${top - 56} Q${x + w * 0.76} ${top - 50} ${x + w * 0.8} ${top - 26} Q${x + w * 0.94} ${top - 20} ${x + w} ${top} Z`;
  if (g === "point") return `M${x - 4} ${top} L${x + w / 2} ${top - 66} L${x + w + 4} ${top} Z`;
  return `M${x} ${top} h${w} v-12 h-${w} Z`;
}

function Facade({ x, w, h, c, g, idx }: { x: number; w: number; h: number; c: string; g: Gable; idx: number }) {
  const top = 560 - h;
  const cols = w > 110 ? 3 : 2;
  const rows = Math.floor((h - 80) / 62);
  const shutter = idx % 2 ? "#2f6f5c" : "#a8323a";
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={c} {...O} strokeWidth={2.5} />
      <rect x={x} y={top} width={w} height={h} fill="url(#dl-brick)" opacity={0.5} />
      <path d={roofPath(x, w, top, g)} fill={g === "point" ? "#5a3434" : c} {...O} strokeWidth={2.5} />
      {g === "point" && <path d={`M${x + w / 2 - 10} ${top - 18} h20 v-14 h-20z`} fill="#ffd76a" stroke={INK} strokeWidth={2} className="win-glow" />}
      {g !== "point" && <path d={roofPath(x, w, top, g)} fill="none" stroke={TRIM} strokeWidth={2} opacity={0.75} transform={`translate(0 3)`} />}
      {g === "bell" && <circle cx={x + w / 2} cy={top - 30} r={7} fill="#ffd76a" stroke={INK} strokeWidth={2} className="win-glow" />}
      <rect x={x - 2} y={top - 3} width={w + 4} height={7} fill={TRIM} stroke={INK} strokeWidth={1.8} />
      {/* volume: schaduwzijde */}
      <rect x={x + w - 12} y={top} width={12} height={h} fill="rgba(20,0,40,.18)" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, cc) => {
          const wx = x + 12 + cc * ((w - 24) / cols) + 2;
          const wy = top + 22 + r * 62;
          const ww = (w - 24) / cols - 10;
          const k = idx * 17 + r * 5 + cc;
          const lit = rnd(k, 2) > 0.22;
          return (
            <g key={`${r}-${cc}`}>
              <rect x={wx - 2} y={wy - 4} width={ww + 4} height={6} rx={2} fill={TRIM} opacity={0.9} />
              <rect
                className={lit ? "win-glow" : undefined}
                style={{ animationDelay: `${((r * 3 + cc + x) % 7) * 0.4}s` }}
                x={wx} y={wy} width={ww} height={38} rx={3}
                fill={lit ? "#ffd76a" : "#3b3f78"}
                stroke={INK} strokeWidth={2}
              />
              {lit && rnd(k, 5) > 0.82 && (
                // silhouet van een kat of plantje in de vensterbank
                rnd(k, 6) > 0.5
                  ? <path d={`M${wx + ww / 2 - 6} ${wy + 38} q0 -12 6 -14 l-2 -5 l4 3 l4 -3 l-2 5 q6 2 6 14z`} fill="#3a2440" />
                  : <path d={`M${wx + ww / 2 - 5} ${wy + 38} h10 l-2 -7 h-6z M${wx + ww / 2} ${wy + 31} q-6 -8 0 -12 q6 4 0 12`} fill="#2f6f5c" />
              )}
              <path d={`M${wx + ww / 2} ${wy} V${wy + 38} M${wx} ${wy + 19} H${wx + ww}`} stroke={INK} strokeWidth={1.6} opacity={0.8} />
              <rect x={wx - 7} y={wy} width={6} height={38} fill={shutter} stroke={INK} strokeWidth={1.2} />
              <rect x={wx + ww + 1} y={wy} width={6} height={38} fill={shutter} stroke={INK} strokeWidth={1.2} />
              {r === rows - 1 && (
                <g>
                  <rect x={wx - 2} y={wy + 38} width={ww + 4} height={7} rx={2} fill="#6b3f1c" stroke={INK} strokeWidth={1.4} />
                  {[0.2, 0.5, 0.8].map((f) => <circle key={f} cx={wx + ww * f} cy={wy + 37} r={3.4} fill={f === 0.5 ? "#ff8fb0" : "#e8174f"} />)}
                </g>
              )}
            </g>
          );
        }),
      )}
      {/* voordeur met bovenlicht en stoepje */}
      <path d={`M${x + w / 2 - 13} 560 V${560 - 38} Q${x + w / 2} ${560 - 52} ${x + w / 2 + 13} ${560 - 38} V560Z`} fill="#3a2414" stroke={INK} strokeWidth={2} />
      <path d={`M${x + w / 2 - 10} ${560 - 40} Q${x + w / 2} ${560 - 50} ${x + w / 2 + 10} ${560 - 40}Z`} fill="#ffd76a" className="win-glow" />
      <rect x={x + w / 2 - 17} y={556} width={34} height={5} fill="#9a90b0" stroke={INK} strokeWidth={1.4} />
    </g>
  );
}

/** Weerspiegeling van een gevel in de gracht (zachte kleur met golvende lichtstrepen). */
function Reflection({ x, w, c, idx }: { x: number; w: number; c: string; idx: number }) {
  return (
    <g>
      <rect x={x} y={564} width={w} height={70} fill={c} opacity={0.22} />
      {[0, 1, 2].map((r) => (
        <path
          key={r}
          className="reflect-shimmer"
          style={{ animationDelay: `${(idx + r) * 0.5}s` }}
          d={`M${x + 14 + (r % 2) * 10} ${576 + r * 20} h${w * 0.25} M${x + w * 0.55} ${578 + r * 20} h${w * 0.22}`}
          stroke="#ffd76a"
          strokeWidth={4}
          strokeLinecap="round"
          opacity={0.45 - r * 0.1}
        />
      ))}
    </g>
  );
}

/** De Nieuwe Kerk: hoge gotische toren, van onder aangelicht. */
function NieuweKerk() {
  const stage = (x: number, w: number, y0: number, y1: number, wins: number) => (
    <g>
      <rect x={x} y={y1} width={w} height={y0 - y1} fill="url(#dl-tower)" {...O} strokeWidth={2.5} />
      <rect x={x - 5} y={y1 - 6} width={w + 10} height={10} fill="#b98f72" {...O} strokeWidth={2} />
      {Array.from({ length: wins }, (_, i) => {
        const ww = (w - 16) / wins - 6;
        const wx = x + 8 + i * ((w - 16) / wins) + 3;
        return <path key={i} d={`M${wx} ${y0 - 10} V${y1 + 26} Q${wx + ww / 2} ${y1 + 10} ${wx + ww} ${y1 + 26} V${y0 - 10}Z`} fill="#2b2a5a" stroke={INK} strokeWidth={1.6} />;
      })}
      {[x - 4, x + w - 4].map((px) => <path key={px} d={`M${px} ${y1 - 6} l4 -18 l4 18z`} fill="#8a6a5a" stroke={INK} strokeWidth={1.6} />)}
    </g>
  );
  return (
    <g>
      {/* schip van de kerk */}
      <path d="M520 560 V380 L600 330 H1000 L1080 380 V560Z" fill="#6f6496" opacity={0.85} />
      {[560, 640, 960, 1040].map((x) => <path key={x} d={`M${x} 520 V420 Q${x + 14} 396 ${x + 28} 420 V520Z`} fill="#ffd76a" opacity={0.55} className="win-glow" />)}
      {/* toren in trappen */}
      {stage(740, 120, 560, 330, 3)}
      {stage(754, 92, 330, 236, 2)}
      {stage(768, 64, 236, 168, 2)}
      {stage(780, 40, 168, 118, 1)}
      <path d="M778 118 L800 30 L822 118Z" fill="#4e5f8c" {...O} strokeWidth={2.5} />
      <path d="M790 92 L800 50 L810 92" fill="none" stroke="#8fa3d6" strokeWidth={2} opacity={0.7} />
      <circle cx={800} cy={28} r={5} fill="#ffc400" stroke={INK} strokeWidth={2} />
      <path d="M800 22 V8" stroke="#ffc400" strokeWidth={3} />
      {/* wijzerplaat */}
      <circle cx={800} cy={286} r={18} fill="#fff6d8" {...O} strokeWidth={2.5} />
      <circle cx={800} cy={286} r={18} fill="url(#dl-glow-warm)" opacity={0.6} />
      <path d="M800 286 V274 M800 286 L809 290" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

/** Scheve toren van de Oude Kerk (helt echt over) en molen De Roos. */
function FarLandmarks() {
  return (
    <g opacity={0.9}>
      <g transform="rotate(-4 330 420)">
        <rect x={296} y={150} width={68} height={270} fill="#7a4f62" stroke="#3a2a50" strokeWidth={2.5} />
        {[176, 236, 296].map((y) => <path key={y} d={`M310 ${y + 40} V${y + 10} Q318 ${y} 326 ${y + 10} V${y + 40}Z M334 ${y + 40} V${y + 10} Q342 ${y} 350 ${y + 10} V${y + 40}Z`} fill="#3b2c54" />)}
        <rect x={292} y={146} width={76} height={8} fill="#5a3a52" stroke="#3a2a50" strokeWidth={2} />
        <path d="M300 146 L330 80 L360 146Z" fill="#4a4170" stroke="#3a2a50" strokeWidth={2.5} strokeLinejoin="round" />
        {[292, 360].map((x) => <path key={x} d={`M${x} 146 l4 -24 l4 24z`} fill="#4a4170" stroke="#3a2a50" strokeWidth={1.6} />)}
        <path d="M330 80 V66" stroke="#ffc400" strokeWidth={3} />
      </g>
      {/* molen De Roos */}
      <g>
        <path d="M1418 300 L1430 196 H1470 L1482 300Z" fill="#5d5280" />
        <path d="M1424 196 Q1450 168 1476 196Z" fill="#4a4170" />
        <rect x={1416} y={232} width={68} height={8} fill="#4a4170" />
        <g className="mill-sails" style={{ transformOrigin: "1450px 196px" } as CSSProperties}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a} 1450 196)`}>
              <path d="M1450 196 L1446 116 H1454Z" fill="#4a4170" />
              <rect x={1452} y={120} width={16} height={68} fill="none" stroke="#7d72a8" strokeWidth={2} />
              <path d="M1452 136 h16 M1452 152 h16 M1452 168 h16" stroke="#7d72a8" strokeWidth={1.5} />
            </g>
          ))}
          <circle cx={1450} cy={196} r={5} fill="#ffc400" />
        </g>
      </g>
    </g>
  );
}

function Lantern({ x }: { x: number }) {
  return (
    <g>
      <ellipse cx={x} cy={712} rx={110} ry={24} fill="url(#dl-pool)" />
      <circle cx={x} cy={552} r={80} fill="url(#dl-glow-warm)" className="lamp-glow" />
      <path d={`M${x - 14} 712 h28 l-4 -14 h-20z`} fill="#2b1b3d" />
      <rect x={x - 4} y={570} width={8} height={130} fill="#2b1b3d" />
      <path d={`M${x - 10} 580 h20 M${x - 8} 620 h16`} stroke="#4a3a60" strokeWidth={3} />
      <path d={`M${x - 16} 534 L${x - 12} 570 H${x + 12} L${x + 16} 534Z`} fill="#ffd76a" {...O} strokeWidth={2.5} className="win-glow" />
      <path d={`M${x} 536 V568`} stroke={INK} strokeWidth={1.6} />
      <path d={`M${x - 20} 534 L${x} 516 L${x + 20} 534Z`} fill="#2b1b3d" stroke={INK} strokeWidth={2} />
      <circle cx={x} cy={512} r={4} fill="#2b1b3d" />
      <rect x={x - 13} y={568} width={26} height={6} rx={2} fill="#2b1b3d" />
    </g>
  );
}

function Bike({ x, y, flip, basket }: { x: number; y: number; flip?: boolean; basket: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx={0} cy={2} rx={50} ry={6} fill="rgba(20,10,40,.3)" />
      {[-30, 30].map((cx) => (
        <g key={cx}>
          <circle cx={cx} cy={-22} r={21} fill="none" stroke={INK} strokeWidth={4} />
          <circle cx={cx} cy={-22} r={21} fill="none" stroke="#5a5a7a" strokeWidth={1.5} strokeDasharray="2 5" />
        </g>
      ))}
      <path d="M-30 -22 L-8 -22 L8 -50 L-16 -50 Z M-8 -22 L-20 -56 M8 -50 L30 -22 M10 -56 L8 -50" fill="none" stroke="#1f6f8f" strokeWidth={4} strokeLinejoin="round" />
      <path d="M-28 -58 h16" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <path d="M4 -60 q8 -4 14 2" fill="none" stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
      <rect x={16} y={-58} width={24} height={16} rx={3} fill="#c98a4b" stroke={INK} strokeWidth={2} />
      {[20, 28, 36].map((bx, i) => <circle key={bx} cx={bx} cy={-60} r={5} fill={i === 1 ? "#fff" : basket} stroke={INK} strokeWidth={1.4} />)}
    </g>
  );
}

/** Delfts blauwe bloempot met rozen. */
function DelftPot({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx={0} cy={2} rx={30} ry={6} fill="rgba(20,10,40,.3)" />
      {[-14, 0, 14, -7, 7].map((cx, i) => (
        <g key={i}>
          <path d={`M${cx} -40 V${-62 - (i % 2) * 10}`} stroke="#2f7a4a" strokeWidth={3} />
          <circle cx={cx} cy={-64 - (i % 2) * 10} r={8} fill={i % 2 ? "#ff6b8f" : "#e8174f"} stroke={INK} strokeWidth={1.8} />
          <path d={`M${cx - 3} ${-64 - (i % 2) * 10} q3 -4 6 0 q-3 4 -6 0`} fill="none" stroke="#8a0a2e" strokeWidth={1.4} />
        </g>
      ))}
      <path d="M-24 -42 H24 L18 0 H-18Z" fill="#f6f3ff" {...O} strokeWidth={2.5} />
      <path d="M-22 -34 H22 M-19 -8 H19" stroke="#1f4fa8" strokeWidth={3} />
      <path d="M0 -28 q-6 4 0 12 q6 -8 0 -12 M-10 -22 q4 6 10 6 M10 -22 q-4 6 -10 6" fill="none" stroke="#1f4fa8" strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}

/** Statisch decor: het historische centrum van Delft aan een gracht, in romantisch avondlicht. */
const DelftScenery = memo(function DelftScenery() {
  return (
    <g aria-hidden>
      <defs>
        <linearGradient id="dl-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2a6e" />
          <stop offset="0.45" stopColor="#6a4fa0" />
          <stop offset="0.8" stopColor="#d97aa8" />
          <stop offset="1" stopColor="#ffb27a" />
        </linearGradient>
        <linearGradient id="dl-canal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a5fae" />
          <stop offset="1" stopColor="#262f6e" />
        </linearGradient>
        <linearGradient id="dl-tower" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#e6b48f" />
          <stop offset="1" stopColor="#a0765e" />
        </linearGradient>
        <linearGradient id="dl-plaza-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1a4a" stopOpacity="0" />
          <stop offset="1" stopColor="#2a1a4a" stopOpacity=".55" />
        </linearGradient>
        <radialGradient id="dl-moon-halo">
          <stop offset=".3" stopColor="#fff4c9" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff4c9" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dl-glow-warm">
          <stop offset="0" stopColor="#ffd76a" stopOpacity=".55" />
          <stop offset="1" stopColor="#ffd76a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dl-pool">
          <stop offset="0" stopColor="#ffd9a0" stopOpacity=".5" />
          <stop offset="1" stopColor="#ffd9a0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="dl-pink-pool">
          <stop offset="0" stopColor="#ff8fc0" stopOpacity=".55" />
          <stop offset="1" stopColor="#ff8fc0" stopOpacity="0" />
        </radialGradient>
        <pattern id="dl-brick" width="24" height="12" patternUnits="userSpaceOnUse">
          <path d="M0 12 H24 M12 0 V6 M0 6 H24 M0 6 V12 M24 6 V12" stroke="#2b1b3d" strokeWidth={0.8} opacity={0.35} fill="none" />
        </pattern>
        <pattern id="dl-cobble" width="40" height="22" patternUnits="userSpaceOnUse">
          <rect width="40" height="22" fill="#8d82ad" />
          <rect x="1.5" y="1.5" width="17" height="8" rx="4" fill="#a39ac2" />
          <rect x="21.5" y="1.5" width="17" height="8" rx="4" fill="#9a90bb" />
          <rect x="-8.5" y="12.5" width="17" height="8" rx="4" fill="#9a90bb" />
          <rect x="11.5" y="12.5" width="17" height="8" rx="4" fill="#a39ac2" />
          <rect x="31.5" y="12.5" width="17" height="8" rx="4" fill="#968cb8" />
        </pattern>
      </defs>

      {/* lucht met maan, sterren en drijvende wolken */}
      <rect width={1600} height={600} fill="url(#dl-sky)" />
      {Array.from({ length: 24 }, (_, i) => (
        <circle
          key={i}
          className="star"
          style={{ animationDelay: `${rnd(i, 1) * 3}s` }}
          cx={30 + rnd(i, 2) * 1540}
          cy={20 + rnd(i, 3) * 200}
          r={1.5 + rnd(i, 4) * 2}
          fill="#fff"
        />
      ))}
      <circle cx={1240} cy={110} r={130} fill="url(#dl-moon-halo)" />
      <circle cx={1240} cy={110} r={44} fill="#fff4c9" />
      <circle cx={1226} cy={100} r={8} fill="#f0e2a8" />
      <circle cx={1254} cy={124} r={6} fill="#f0e2a8" />
      <g className="cloud-slow">
        <path d="M120 150 q20 -30 50 -14 q16 -26 50 -8 q30 -6 34 22 q-70 12 -134 0z" fill="#ffb8d6" opacity={0.5} />
        <path d="M980 190 q16 -24 42 -12 q14 -20 42 -6 q26 -4 28 18 q-56 10 -112 0z" fill="#ffc8a8" opacity={0.45} />
      </g>

      <FarLandmarks />
      <NieuweKerk />

      {/* gevels links en rechts */}
      {LEFT.map(([x, w, h, c, g], i) => <Facade key={`l${x}`} idx={i} x={x} w={w} h={h} c={c} g={g} />)}
      {RIGHT.map(([x, w, h, c, g], i) => <Facade key={`r${x}`} idx={i + 5} x={x} w={w} h={h} c={c} g={g} />)}

      {/* slinger met lichtjes, vlaggetjes en hartjes tussen de huizen */}
      <path d="M440 300 Q800 380 1160 300" fill="none" stroke={INK} strokeWidth={2.5} opacity={0.6} />
      {Array.from({ length: 14 }, (_, i) => {
        const tt = (i + 0.5) / 14;
        const x = 440 + tt * 720;
        const y = 300 + Math.sin(Math.PI * tt) * 66 * 0.9 + 4;
        return i % 2 ? (
          <path key={i} d={`M${x - 14} ${y} L${x + 14} ${y} L${x} ${y + 32}Z`} fill={["#d62f2f", "#fff", "#ffc400"][i % 3]} stroke={INK} strokeWidth={2} />
        ) : (
          <path key={i} d={`M${x} ${y + 26} C${x - 18} ${y + 12} ${x - 14} ${y - 4} ${x - 5} ${y - 2} C${x - 1} ${y - 2} ${x} ${y + 2} ${x} ${y + 4} C${x} ${y + 2} ${x + 1} ${y - 2} ${x + 5} ${y - 2} C${x + 14} ${y - 4} ${x + 18} ${y + 12} ${x} ${y + 26}Z`} fill="#ff4d6d" stroke={INK} strokeWidth={2} />
        );
      })}
      {Array.from({ length: 22 }, (_, i) => {
        const tt = i / 21;
        return (
          <circle key={i} className="twinkle" style={{ animationDelay: `${(i % 6) * 0.3}s` }} cx={440 + tt * 720} cy={300 + Math.sin(Math.PI * tt) * 72} r={3.6} fill={["#fff4c8", "#ffb3c6"][i % 2]} />
        );
      })}

      {/* gracht met weerspiegelingen */}
      <rect y={560} width={1600} height={86} fill="url(#dl-canal)" />
      {LEFT.map(([x, w, , c], i) => <Reflection key={`rl${x}`} idx={i} x={x} w={w} c={c} />)}
      {RIGHT.map(([x, w, , c], i) => <Reflection key={`rr${x}`} idx={i + 5} x={x} w={w} c={c} />)}
      <ellipse cx={1240} cy={600} rx={36} ry={6} fill="#fff4c9" opacity={0.5} className="reflect-shimmer" />
      <rect y={554} width={1600} height={9} fill="#9a90b0" {...O} strokeWidth={2} />
      <g className="waves waves-a" fill="none" stroke="#ffd76a" strokeWidth={3} strokeLinecap="round" opacity={0.4}>
        {[[90, 590], [380, 616], [660, 592], [960, 618], [1250, 594], [1480, 614]].map(([x, y], i) => (
          <path key={i} d={`M${x} ${y} q 14 -8 28 0 t 28 0 t 28 0`} />
        ))}
      </g>

      {/* plein met kinderkopjes */}
      <rect y={640} width={1600} height={420} fill="url(#dl-cobble)" />
      <rect y={640} width={1600} height={420} fill="url(#dl-plaza-shade)" />
      <rect y={636} width={1600} height={12} fill="#6a6388" stroke={INK} strokeWidth={2} />
      {/* kettingreling langs de gracht */}
      {Array.from({ length: 21 }, (_, i) => (
        <g key={i}>
          <rect x={i * 80 - 4} y={612} width={8} height={28} rx={2} fill="#2b1b3d" />
          <circle cx={i * 80} cy={610} r={5} fill="#2b1b3d" />
          {i < 20 && <path d={`M${i * 80} 616 Q${i * 80 + 40} 632 ${i * 80 + 80} 616`} fill="none" stroke="#2b1b3d" strokeWidth={2.5} />}
        </g>
      ))}
      {/* roze gloed van de poort op de stenen */}
      <ellipse cx={800} cy={680} rx={300} ry={60} fill="url(#dl-pink-pool)" className="lamp-glow" />

      <Lantern x={100} />
      <Lantern x={520} />
      <Lantern x={1080} />
      <Lantern x={1500} />

      <Bike x={1350} y={688} basket="#ff6b8f" />
      <Bike x={1440} y={700} flip basket="#ffc400" />
      <DelftPot x={600} y={700} />
      <DelftPot x={1000} y={700} />

      {/* cadeautjes en pepernoten op het plein */}
      <g>
        <ellipse cx={430} cy={712} rx={44} ry={7} fill="rgba(20,10,40,.3)" />
        <rect x={400} y={676} width={46} height={36} fill="#2b6fd6" {...O} strokeWidth={2.5} />
        <path d="M423 676 V712 M400 694 H446" stroke="#ffc400" strokeWidth={5} />
        <rect x={430} y={656} width={34} height={30} fill="#d62f2f" {...O} strokeWidth={2.5} />
        <path d="M447 656 V686" stroke="#fff" strokeWidth={4} />
        <path d="M447 656 q-10 -12 -12 -2 q6 4 12 2 q10 -12 12 -2 q-6 4 -12 2" fill="#ffc400" stroke={INK} strokeWidth={1.5} />
        {[1130, 1150, 1170].map((x, i) => <circle key={x} cx={x} cy={720 + i * 3} r={8} fill="#b9772f" {...O} strokeWidth={2} />)}
      </g>

      {/* langzaam dwarrelende rozenblaadjes */}
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i} transform={`translate(${520 + rnd(i, 7) * 560} 230)`}>
          <path
            className="petal"
            style={{ animationDelay: `${-rnd(i, 8) * 12}s`, animationDuration: `${10 + rnd(i, 9) * 6}s` } as CSSProperties}
            d="M0 0 q6 -6 10 0 q-4 6 -10 0z"
            fill={i % 2 ? "#ff8fb0" : "#ff4d6d"}
          />
        </g>
      ))}
    </g>
  );
});

export default DelftScenery;
