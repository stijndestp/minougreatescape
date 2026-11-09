import { memo, type CSSProperties } from "react";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
const GOLD = "#e8b23a";

const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function Defs() {
  return (
    <defs>
      <linearGradient id="oh-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e7a46a" />
        <stop offset="1" stopColor="#f6c48e" />
      </linearGradient>
      <pattern id="oh-damask" width="80" height="96" patternUnits="userSpaceOnUse">
        <path d="M40 14 Q52 30 40 48 Q28 30 40 14Z M40 48 Q58 54 62 72 Q46 70 40 48Z M40 48 Q22 54 18 72 Q34 70 40 48Z M40 48 V82" fill="none" stroke="#d98f52" strokeWidth={2.4} />
        <circle cx="0" cy="0" r="3" fill="#d98f52" />
        <circle cx="80" cy="0" r="3" fill="#d98f52" />
        <circle cx="0" cy="96" r="3" fill="#d98f52" />
        <circle cx="80" cy="96" r="3" fill="#d98f52" />
      </pattern>
      <linearGradient id="oh-wainscot" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#a65f2d" />
        <stop offset="1" stopColor="#7e4420" />
      </linearGradient>
      <linearGradient id="oh-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#c8884c" />
        <stop offset="1" stopColor="#9a5e2c" />
      </linearGradient>
      <linearGradient id="oh-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d1660" />
        <stop offset="1" stopColor="#4d3a92" />
      </linearGradient>
      <linearGradient id="oh-curtain" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#c0392b" />
        <stop offset=".5" stopColor="#e25a45" />
        <stop offset="1" stopColor="#c0392b" />
      </linearGradient>
      <radialGradient id="oh-chandelier">
        <stop offset="0" stopColor="#fff2c0" stopOpacity=".75" />
        <stop offset=".4" stopColor="#ffd98a" stopOpacity=".3" />
        <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="oh-bulb">
        <stop offset="0" stopColor="#fff6c8" stopOpacity=".95" />
        <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="oh-shadow">
        <stop offset="0" stopColor="#3a1a0a" stopOpacity=".4" />
        <stop offset="1" stopColor="#3a1a0a" stopOpacity="0" />
      </radialGradient>
      <clipPath id="oh-window"><rect x={1296} y={76} width={218} height={228} rx={8} /></clipPath>
    </defs>
  );
}

function Frame({ x, y, w, h, bg, coat }: { x: number; y: number; w: number; h: number; bg: string; coat: string }) {
  return (
    <g>
      <rect x={x - 6} y={y - 6} width={w + 12} height={h + 12} rx={8} fill={GOLD} {...O} />
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} rx={4} fill="#b8862a" />
      <rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} fill={bg} stroke={INK} strokeWidth={2} />
      <circle cx={x + w / 2} cy={y + h * 0.42} r={w * 0.18} fill="#ffd9b8" stroke={INK} strokeWidth={2} />
      <path d={`M${x + w / 2 - w * 0.2} ${y + h * 0.36} Q${x + w / 2} ${y + h * 0.18} ${x + w / 2 + w * 0.2} ${y + h * 0.36}`} fill="#8a6a50" stroke={INK} strokeWidth={1.6} />
      <path d={`M${x + 18} ${y + h - 10} Q${x + w / 2} ${y + h * 0.52} ${x + w - 18} ${y + h - 10}Z`} fill={coat} stroke={INK} strokeWidth={2} />
      <path d={`M${x + 14} ${y + 16} L${x + 34} ${y + 16}`} stroke="#fff" strokeWidth={3} opacity={0.5} strokeLinecap="round" />
    </g>
  );
}

/** Het decor van de eetkamer (statisch). De tafel en personen staan in DinnerTable.tsx. */
const DiningRoom = memo(function DiningRoom() {
  return (
    <g aria-hidden>
      <Defs />
      {/* muur met damastbehang en kroonlijst */}
      <rect width={1600} height={560} fill="url(#oh-wall)" />
      <rect width={1600} height={410} fill="url(#oh-damask)" opacity={0.55} />
      <rect width={1600} height={18} fill="#fff1dc" />
      <rect y={16} width={1600} height={6} fill="#c27a3e" />

      {/* lambrisering met panelen en lijstwerk */}
      <rect y={410} width={1600} height={150} fill="url(#oh-wainscot)" />
      <rect y={402} width={1600} height={16} fill="#d9945a" {...O} strokeWidth={2.5} />
      <rect y={404} width={1600} height={4} fill="#f2b67a" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i}>
          <rect x={30 + i * 134} y={430} width={104} height={108} rx={6} fill="#9a5628" stroke="#6b3a18" strokeWidth={2.5} />
          <path d={`M${36 + i * 134} 436 H${128 + i * 134}`} stroke="#c47a40" strokeWidth={2} />
        </g>
      ))}

      {/* vloer met planken, plint en tapijt */}
      <rect y={560} width={1600} height={340} fill="url(#oh-floor)" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} y={580 + i * 36 + i * i} width={1600} height={3} fill="#8a5426" opacity={0.6} />
      ))}
      <rect y={552} width={1600} height={14} fill="#fff1dc" stroke={INK} strokeWidth={2} />
      <ellipse cx={800} cy={770} rx={790} ry={156} fill="#3a1a0a" opacity={0.18} />
      <ellipse cx={800} cy={760} rx={780} ry={150} fill="#b83a5a" {...O} strokeWidth={2.5} />
      <ellipse cx={800} cy={760} rx={700} ry={120} fill="none" stroke="#ffd45e" strokeWidth={6} strokeDasharray="18 12" />
      <ellipse cx={800} cy={760} rx={620} ry={96} fill="none" stroke="#8f2442" strokeWidth={4} />

      {/* slingers met vlaggetjes (oranje-wit-blauw) */}
      <path d="M0 24 Q200 96 400 30 T800 30 T1200 30 T1600 24" fill="none" stroke={INK} strokeWidth={3} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 50 + i * 98;
        const y = 36 + Math.sin(i * 1.1) * 18 + (i % 4 === 0 ? 12 : 0);
        return (
          <g key={i} className="flag-sway" style={{ animationDelay: `${(i % 5) * 0.3}s`, transformOrigin: `${x}px ${y}px` } as CSSProperties}>
            <path d={`M${x - 20} ${y} L${x + 20} ${y} L${x} ${y + 40}Z`} fill={["#ff8a3d", "#fff", "#2b6fd6"][i % 3]} {...O} strokeWidth={2} />
          </g>
        );
      })}

      {/* familieportretten in gouden lijsten */}
      <Frame x={440} y={86} w={120} h={140} bg="#bfe6ff" coat="#2b6fd6" />
      <Frame x={1040} y={86} w={120} h={140} bg="#ffd1e3" coat="#ff8fb3" />
      <g>
        <rect x={596} y={110} width={84} height={64} rx={4} fill={GOLD} {...O} strokeWidth={2.5} />
        <rect x={604} y={118} width={68} height={48} fill="#a8ebdb" />
        <path d="M604 166 L626 140 L642 154 L656 138 L672 166Z" fill="#3f9a5a" />
      </g>

      {/* staande klok met slingerende pendule */}
      <g>
        <circle cx={955} cy={120} r={50} fill="#8d5a2b" {...O} strokeWidth={3} />
        <circle cx={955} cy={120} r={42} fill="#fff8ec" stroke={INK} strokeWidth={2.5} />
        {Array.from({ length: 12 }, (_, i) => (
          <path key={i} d="M955 82 V88" stroke={INK} strokeWidth={i % 3 ? 2 : 4} transform={`rotate(${i * 30} 955 120)`} />
        ))}
        <path className="clock-hand" style={{ "--a0": "300deg", animationDuration: "3600s", transformOrigin: "955px 120px" } as CSSProperties} d="M955 120 V90" stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M955 120 L975 132" stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <circle cx={955} cy={120} r={4} fill={GOLD} stroke={INK} strokeWidth={1.5} />
        <g className="oh-pendulum" style={{ transformOrigin: "955px 170px" }}>
          <path d="M955 170 V226" stroke={GOLD} strokeWidth={4} />
          <circle cx={955} cy={234} r={11} fill={GOLD} stroke={INK} strokeWidth={2.5} />
        </g>
      </g>

      {/* dressoir met plant, chocoladeletter en een schoen met wortel */}
      <g>
        <ellipse cx={125} cy={548} rx={110} ry={10} fill="url(#oh-shadow)" />
        <rect x={22} y={332} width={206} height={16} rx={4} fill="#a66a35" {...O} strokeWidth={2.5} />
        <rect x={30} y={340} width={190} height={200} rx={8} fill="#8d5a2b" {...O} />
        <rect x={42} y={372} width={80} height={150} rx={5} fill="#a66a35" stroke="#6b3a18" strokeWidth={2} />
        <rect x={128} y={372} width={80} height={150} rx={5} fill="#a66a35" stroke="#6b3a18" strokeWidth={2} />
        <circle cx={114} cy={446} r={5} fill="#ffc400" stroke={INK} strokeWidth={1.5} />
        <circle cx={136} cy={446} r={5} fill="#ffc400" stroke={INK} strokeWidth={1.5} />
        <path d="M58 332 L62 296 H108 L112 332Z" fill="#e0301e" {...O} strokeWidth={2.5} />
        <path d="M62 306 H108" stroke="#fff" strokeWidth={3} opacity={0.5} />
        {[[-22, -40], [0, -62], [22, -44], [-10, -30]].map(([dx, dy]) => (
          <ellipse key={`${dx}`} cx={85 + dx} cy={296 + dy} rx={14} ry={32} fill="#2fb36d" {...O} strokeWidth={2.5} transform={`rotate(${dx} ${85 + dx} 296)`} />
        ))}
        {/* chocoladeletter M */}
        <path d="M150 332 V292 L164 312 L178 292 V332 H170 V310 L164 320 L158 310 V332Z" fill="#6b3a1a" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
        <path d="M152 296 L156 302" stroke="#a0603a" strokeWidth={2} />
        {/* klomp/schoen met wortel voor Amerigo */}
        <path d="M184 332 Q184 318 196 316 H210 Q222 316 224 332Z" fill="#ffd45e" stroke={INK} strokeWidth={2} />
        <path d="M200 316 L214 290" stroke="#ff8a3d" strokeWidth={6} strokeLinecap="round" />
        <path d="M214 290 l4 -8 M214 290 l7 -4" stroke="#2fb36d" strokeWidth={2.5} strokeLinecap="round" />
      </g>

      {/* raam met besneeuwde avond en rode gordijnen */}
      <g>
        <rect x={1290} y={70} width={230} height={240} rx={12} fill="url(#oh-sky)" />
        <g clipPath="url(#oh-window)">
          <circle cx={1470} cy={118} r={30} fill="#fff4c9" opacity={0.25} />
          <circle cx={1470} cy={118} r={16} fill="#ffe27a" />
          <path d="M1296 304 V262 H1330 V246 L1346 232 L1362 246 V270 H1400 V250 H1430 V276 H1470 V258 H1514 V304Z" fill="#2a2368" />
          {[[1308, 270], [1340, 256], [1412, 262], [1440, 284], [1486, 270]].map(([x, y], i) => <rect key={i} x={x} y={y} width={6} height={7} fill="#ffd76a" opacity={0.85} />)}
          {Array.from({ length: 12 }, (_, i) => (
            <circle
              key={i}
              className="tb-snow"
              style={{ animationDelay: `${-rnd(i, 1) * 8}s`, animationDuration: `${6 + rnd(i, 2) * 4}s` }}
              cx={1300 + rnd(i, 3) * 210}
              cy={64}
              r={1.8 + rnd(i, 4) * 2}
              fill="#fff"
            />
          ))}
        </g>
        <rect x={1290} y={70} width={230} height={240} rx={12} fill="none" stroke="#fff" strokeWidth={9} />
        <path d="M1405 70 V310 M1290 190 H1520" stroke="#fff" strokeWidth={7} />
        <rect x={1276} y={306} width={258} height={14} rx={5} fill="#fff1dc" {...O} strokeWidth={2.5} />
        <path d="M1250 56 H1560" stroke="#8d5a2b" strokeWidth={8} strokeLinecap="round" />
        <path d="M1262 62 Q1300 190 1282 316 L1332 316 Q1330 190 1330 62Z" fill="url(#oh-curtain)" {...O} strokeWidth={2.5} />
        <path d="M1548 62 Q1510 190 1528 316 L1478 316 Q1480 190 1480 62Z" fill="url(#oh-curtain)" {...O} strokeWidth={2.5} />
        <path d="M1282 72 Q1300 190 1296 300 M1528 72 Q1512 190 1514 300" fill="none" stroke="#9e2a1f" strokeWidth={3} opacity={0.6} />
        <path d="M1272 230 Q1302 240 1332 226 M1538 230 Q1508 240 1478 226" fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* kroonluchter met kaarslampjes en een warme lichtkegel over de tafel */}
      <ellipse className="lamp-glow" cx={800} cy={320} rx={620} ry={260} fill="url(#oh-chandelier)" />
      <g>
        <path d="M800 0 V96" stroke={INK} strokeWidth={4} />
        <path d="M800 96 V128" stroke={GOLD} strokeWidth={6} />
        <path d="M712 150 Q756 172 800 150 Q844 172 888 150" fill="none" stroke={GOLD} strokeWidth={6} strokeLinecap="round" />
        <path d="M712 150 Q724 120 800 128 Q876 120 888 150" fill="none" stroke={GOLD} strokeWidth={5} />
        <ellipse cx={800} cy={142} rx={18} ry={14} fill={GOLD} {...O} strokeWidth={2.5} />
        {[712, 756, 800, 844, 888].map((x, i) => (
          <g key={x}>
            <circle cx={x} cy={120 + (i % 2) * 14} r={22} fill="url(#oh-bulb)" className="twinkle" style={{ animationDelay: `${i * 0.35}s`, animationDuration: "2.8s" }} />
            <rect x={x - 5} y={128 + (i % 2) * 14} width={10} height={20} fill="#fff8ec" stroke={INK} strokeWidth={1.8} />
            <path className="flame" d={`M${x} ${110 + (i % 2) * 14} Q${x + 6} ${120 + (i % 2) * 14} ${x} ${128 + (i % 2) * 14} Q${x - 6} ${120 + (i % 2) * 14} ${x} ${110 + (i % 2) * 14}Z`} fill="#ffb703" />
            <ellipse cx={x} cy={150 + (i % 2) * 14} rx={10} ry={4} fill={GOLD} stroke={INK} strokeWidth={1.6} />
          </g>
        ))}
        {[740, 780, 820, 860].map((x, i) => (
          <path key={x} d={`M${x} 166 v${12 + (i % 2) * 8}`} stroke="#bfe6ff" strokeWidth={3} strokeLinecap="round" />
        ))}
      </g>
    </g>
  );
});

export default DiningRoom;
