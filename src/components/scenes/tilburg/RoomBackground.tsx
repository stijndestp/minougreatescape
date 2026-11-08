/**
 * De slaapkamer als SVG (1600 × 900), alleen decor zonder interactie.
 * De meubels bepalen de oppervlakken waarop voorwerpen liggen; hun plek staat
 * in src/content/tilburg.ts (`place`, `x`, `y`). Meubels niet verplaatsen zonder
 * die plekken mee te nemen.
 *
 * Oppervlakken (y): bed 462 · nachtkastje 482 · kaptafel 512 · bureau 522 ·
 * wandplank 252 · kast-bovenkant 142 · vloer vanaf 650.
 */
const OUTLINE = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

export default function RoomBackground() {
  return (
    <svg className="room-bg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
      {/* muur */}
      <rect width={1600} height={650} fill="#ffd9e8" />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={i * 120 + 50} y={0} width={44} height={650} fill="#ffcde1" />
      ))}
      {/* vloer */}
      <rect y={650} width={1600} height={250} fill="#e9b872" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} y={668 + i * 32} width={1600} height={3} fill="#cf9650" />
      ))}
      <rect y={634} width={1600} height={20} fill="#fff" />

      {/* lichtsnoer */}
      <path d="M20 28 Q220 90 420 40 T820 40 T1220 44 T1580 30" fill="none" stroke="#6b4bb5" strokeWidth={3} />
      {[[100, 62, "#ffc400"], [220, 74, "#ff3d68"], [340, 62, "#5cc4ee"], [470, 50, "#ffc400"], [600, 56, "#2fb36d"], [720, 50, "#ff3d68"], [840, 44, "#5cc4ee"], [960, 56, "#ffc400"], [1080, 54, "#ff3d68"], [1200, 52, "#2fb36d"], [1330, 50, "#ffc400"], [1460, 44, "#5cc4ee"]].map(([x, y, c]) => (
        <circle key={`${x}`} cx={x as number} cy={y as number} r={9} fill={c as string} {...OUTLINE} strokeWidth={2} />
      ))}

      {/* posters */}
      <rect x={120} y={96} width={130} height={110} rx={6} fill="#fff" {...OUTLINE} />
      <path d="M135 190 L175 130 L205 165 L225 140 L240 190Z" fill="#5cc4ee" />
      <circle cx={215} cy={120} r={11} fill="#ffc400" />
      <rect x={300} y={106} width={96} height={96} rx={6} fill="#fff" {...OUTLINE} />
      <path d="M348 186 c-30 -22 -32 -46 -12 -50 c9 -2 12 4 12 8 c0 -4 3 -10 12 -8 c20 4 18 28 -12 50z" fill="#ff3d68" />

      {/* wandplank */}
      <path d="M130 258 L130 282 M440 258 L440 282" stroke="#a96d33" strokeWidth={8} strokeLinecap="round" />
      <rect x={100} y={252} width={370} height={16} rx={4} fill="#c98a4b" {...OUTLINE} />

      {/* raam met gordijnen */}
      <rect x={742} y={86} width={260} height={246} rx={14} fill="#2b1b6b" {...OUTLINE} strokeWidth={6} stroke="#fff" />
      <path d="M872 86 V332 M742 209 H1002" stroke="#fff" strokeWidth={9} />
      <circle cx={940} cy={140} r={22} fill="#ffe27a" />
      {[[780, 124], [830, 170], [920, 270], [790, 280], [960, 214]].map(([x, y]) => (
        <path key={`${x}${y}`} d={`M${x} ${y - 9} L${x + 3} ${y - 3} L${x + 9} ${y} L${x + 3} ${y + 3} L${x} ${y + 9} L${x - 3} ${y + 3} L${x - 9} ${y} L${x - 3} ${y - 3}Z`} fill="#fff" />
      ))}
      <rect x={724} y={332} width={296} height={14} rx={5} fill="#fff" {...OUTLINE} strokeWidth={2.5} />
      <path d="M700 76 H1044" stroke="#8d6ad8" strokeWidth={7} strokeLinecap="round" />
      <path d="M704 80 Q740 200 722 340 L772 340 Q770 200 770 80Z" fill="#b388eb" {...OUTLINE} strokeWidth={2.5} />
      <path d="M1040 80 Q1004 200 1022 340 L972 340 Q974 200 974 80Z" fill="#b388eb" {...OUTLINE} strokeWidth={2.5} />

      {/* bed */}
      <rect x={34} y={380} width={44} height={230} rx={14} fill="#a96d33" {...OUTLINE} />
      <rect x={52} y={598} width={22} height={52} fill="#a96d33" {...OUTLINE} />
      <rect x={504} y={598} width={22} height={52} fill="#a96d33" {...OUTLINE} />
      <rect x={60} y={520} width={480} height={80} rx={10} fill="#c98a4b" {...OUTLINE} />
      <rect x={66} y={468} width={470} height={60} rx={22} fill="#fff" {...OUTLINE} />
      <path d="M200 462 H520 Q548 462 548 490 V530 H200Z" fill="#ff8fb3" {...OUTLINE} />
      {[260, 330, 400, 470].map((x) => (
        <path key={x} d={`M${x} 466 V528`} stroke="#ff6b9a" strokeWidth={8} />
      ))}
      <rect x={82} y={440} width={124} height={44} rx={20} fill="#fff" {...OUTLINE} />

      {/* nachtkastje met lamp */}
      <rect x={586} y={482} width={118} height={158} rx={8} fill="#c98a4b" {...OUTLINE} />
      <rect x={598} y={500} width={94} height={52} rx={6} fill="#b87a3f" />
      <rect x={598} y={564} width={94} height={52} rx={6} fill="#b87a3f" />
      <circle cx={645} cy={526} r={5} fill="#ffc400" />
      <circle cx={645} cy={590} r={5} fill="#ffc400" />
      <rect x={602} y={440} width={7} height={42} fill="#6b4bb5" />
      <path d="M582 440 L604 396 L628 440Z" fill="#ffe27a" {...OUTLINE} />

      {/* kaptafel met spiegel en kruk */}
      <circle cx={880} cy={438} r={66} fill="#bfe6ff" {...OUTLINE} strokeWidth={6} stroke="#c98a4b" />
      <path d="M850 410 Q870 396 890 404" stroke="#fff" strokeWidth={6} strokeLinecap="round" fill="none" />
      <rect x={772} y={512} width={216} height={16} rx={5} fill="#ff8fb3" {...OUTLINE} />
      <rect x={784} y={528} width={14} height={112} fill="#ff8fb3" {...OUTLINE} />
      <rect x={962} y={528} width={14} height={112} fill="#ff8fb3" {...OUTLINE} />
      <rect x={812} y={532} width={140} height={44} rx={6} fill="#ffb6cf" {...OUTLINE} strokeWidth={2.5} />
      <ellipse cx={880} cy={596} rx={44} ry={14} fill="#7fd6c2" {...OUTLINE} />
      <rect x={858} y={604} width={8} height={36} fill="#a96d33" />
      <rect x={894} y={604} width={8} height={36} fill="#a96d33" />

      {/* stoel + bureau */}
      <rect x={1128} y={470} width={56} height={150} rx={10} fill="#2fb3a0" {...OUTLINE} />
      <rect x={1118} y={600} width={80} height={14} rx={6} fill="#2fb3a0" {...OUTLINE} />
      <rect x={1150} y={614} width={10} height={26} fill="#a96d33" />
      <rect x={1040} y={522} width={268} height={16} rx={5} fill="#8d6ad8" {...OUTLINE} />
      <rect x={1052} y={538} width={92} height={102} rx={5} fill="#a98be8" {...OUTLINE} strokeWidth={2.5} />
      <rect x={1062} y={552} width={72} height={34} rx={4} fill="#8d6ad8" />
      <rect x={1062} y={594} width={72} height={34} rx={4} fill="#8d6ad8" />
      <circle cx={1098} cy={569} r={4} fill="#ffc400" />
      <circle cx={1098} cy={611} r={4} fill="#ffc400" />
      <rect x={1288} y={538} width={14} height={102} fill="#a98be8" {...OUTLINE} strokeWidth={2.5} />

      {/* kledingkast */}
      <rect x={1332} y={146} width={250} height={494} rx={10} fill="#8d6ad8" {...OUTLINE} strokeWidth={4} />
      <path d="M1457 146 V640" stroke="#2b1b3d" strokeWidth={3} />
      <rect x={1346} y={162} width={100} height={220} rx={6} fill="#a98be8" opacity={0.55} />
      <rect x={1468} y={162} width={100} height={220} rx={6} fill="#a98be8" opacity={0.55} />
      <circle cx={1440} cy={400} r={7} fill="#ffc400" {...OUTLINE} strokeWidth={2} />
      <circle cx={1474} cy={400} r={7} fill="#ffc400" {...OUTLINE} strokeWidth={2} />
      <rect x={1346} y={598} width={100} height={30} rx={4} fill="#7a58c4" />
      <rect x={1468} y={598} width={100} height={30} rx={4} fill="#7a58c4" />

      {/* vloerkleed */}
      <ellipse cx={780} cy={800} rx={420} ry={88} fill="#7fd6c2" {...OUTLINE} strokeWidth={2.5} />
      <ellipse cx={780} cy={800} rx={340} ry={64} fill="#a8ebdb" />
      <ellipse cx={780} cy={800} rx={250} ry={42} fill="#7fd6c2" opacity={0.6} />
    </svg>
  );
}
