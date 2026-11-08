import { memo } from "react";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

/** Het decor van de eetkamer (statisch). De tafel en personen staan in DinnerTable.tsx. */
const DiningRoom = memo(function DiningRoom() {
  return (
    <g aria-hidden>
      {/* muur */}
      <rect width={1600} height={560} fill="#ffcf9e" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 120 + 40} width={36} height={560} fill="#ffd9ae" />
      ))}
      {/* lambrisering */}
      <rect y={410} width={1600} height={150} fill="#b9703a" />
      <rect y={404} width={1600} height={14} fill="#d9945a" {...O} strokeWidth={2.5} />
      {Array.from({ length: 12 }, (_, i) => (
        <rect key={i} x={30 + i * 134} y={430} width={104} height={108} rx={6} fill="#a65f2d" />
      ))}
      {/* vloer + tapijt */}
      <rect y={560} width={1600} height={340} fill="#dba368" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect key={i} y={580 + i * 36} width={1600} height={3} fill="#c18b52" />
      ))}
      <rect y={552} width={1600} height={14} fill="#fff" />
      <ellipse cx={800} cy={760} rx={780} ry={150} fill="#b83a5a" {...O} strokeWidth={2.5} />
      <ellipse cx={800} cy={760} rx={700} ry={120} fill="none" stroke="#ffd45e" strokeWidth={6} strokeDasharray="18 12" />

      {/* slingers */}
      <path d="M0 24 Q200 96 400 30 T800 30 T1200 30 T1600 24" fill="none" stroke="#2b1b3d" strokeWidth={3} />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 50 + i * 98;
        const y = 36 + Math.sin(i * 1.1) * 18 + (i % 4 === 0 ? 12 : 0);
        return <path key={i} d={`M${x - 20} ${y} L${x + 20} ${y} L${x} ${y + 40}Z`} fill={["#ff8a3d", "#fff", "#2b6fd6"][i % 3]} {...O} strokeWidth={2} />;
      })}

      {/* hanglamp */}
      <path d="M800 0 V110" stroke="#2b1b3d" strokeWidth={4} />
      <ellipse cx={800} cy={250} rx={260} ry={70} fill="rgba(255, 226, 122, .22)" />
      <path d="M740 150 L760 108 H840 L860 150Z" fill="#ffc400" {...O} />
      <ellipse cx={800} cy={152} rx={60} ry={9} fill="#ffe27a" {...O} strokeWidth={2.5} />

      {/* lijsten met familieportretten */}
      {[440, 1040].map((x, i) => (
        <g key={x}>
          <rect x={x} y={86} width={120} height={140} rx={6} fill="#8d5a2b" {...O} />
          <rect x={x + 10} y={96} width={100} height={120} fill={["#bfe6ff", "#ffd1e3"][i]} />
          <circle cx={x + 60} cy={146} r={22} fill="#ffd9b8" {...O} strokeWidth={2.5} />
          <path d={`M${x + 22} 216 Q${x + 60} 160 ${x + 98} 216Z`} fill={["#2b6fd6", "#ff8fb3"][i]} {...O} strokeWidth={2.5} />
        </g>
      ))}

      {/* klok */}
      <circle cx={1150} cy={130} r={46} fill="#fff" {...O} strokeWidth={5} />
      <path d="M1150 130 V100 M1150 130 L1172 142" stroke="#2b1b3d" strokeWidth={5} strokeLinecap="round" />

      {/* dressoir links met plant */}
      <rect x={30} y={340} width={190} height={200} rx={8} fill="#8d5a2b" {...O} />
      <rect x={42} y={372} width={80} height={150} rx={5} fill="#a66a35" />
      <rect x={128} y={372} width={80} height={150} rx={5} fill="#a66a35" />
      <circle cx={122} cy={440} r={5} fill="#ffc400" />
      <path d="M62 340 L66 300 H112 L116 340Z" fill="#e0301e" {...O} strokeWidth={2.5} />
      {[[-22, -40], [0, -62], [22, -44], [-10, -30]].map(([dx, dy]) => (
        <ellipse key={`${dx}`} cx={89 + dx} cy={300 + dy} rx={14} ry={32} fill="#2fb36d" {...O} strokeWidth={2.5} transform={`rotate(${dx} ${89 + dx} 300)`} />
      ))}

      {/* raam rechts met gordijnen */}
      <rect x={1290} y={70} width={230} height={240} rx={12} fill="#2b1b6b" stroke="#fff" strokeWidth={8} />
      <path d="M1405 70 V310 M1290 190 H1520" stroke="#fff" strokeWidth={7} />
      <circle cx={1470} cy={118} r={16} fill="#ffe27a" />
      <path d="M1320 100 l3 -8 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3z" fill="#fff" />
      <path d="M1262 62 Q1300 190 1282 316 L1332 316 Q1330 190 1330 62Z" fill="#ff8a3d" {...O} strokeWidth={2.5} />
      <path d="M1548 62 Q1510 190 1528 316 L1478 316 Q1480 190 1480 62Z" fill="#ff8a3d" {...O} strokeWidth={2.5} />
    </g>
  );
});

export default DiningRoom;
