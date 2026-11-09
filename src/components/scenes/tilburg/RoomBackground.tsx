/**
 * De slaapkamer als SVG (1600 × 900), alleen decor zonder interactie.
 * De meubels bepalen de oppervlakken waarop voorwerpen liggen; hun plek staat
 * in src/content/tilburg.ts (`place`, `x`, `y`). Meubels niet verplaatsen zonder
 * die plekken mee te nemen.
 *
 * Oppervlakken (y): bed 462 · nachtkastje 482 · kaptafel 512 · bureau 522 ·
 * wandplank 252 · kast-bovenkant 142 · vloer vanaf 650.
 *
 * Bewust geen losse decorvoorwerpen op vloer en meubels die op een klikbaar
 * voorwerp lijken (het is een zoekspel): decor zit in muur, meubels en licht.
 */
import { memo } from "react";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };
const WOOD = "#c98a4b";
const WOOD_DARK = "#a96d33";

const rnd = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const LIGHTS: [number, number, string][] = [
  [100, 62, "#ffc400"], [220, 74, "#ff3d68"], [340, 62, "#5cc4ee"], [470, 50, "#ffc400"], [600, 56, "#2fb36d"], [720, 50, "#ff3d68"],
  [840, 44, "#5cc4ee"], [960, 56, "#ffc400"], [1080, 54, "#ff3d68"], [1200, 52, "#2fb36d"], [1330, 50, "#ffc400"], [1460, 44, "#5cc4ee"],
];

function Defs() {
  return (
    <defs>
      <linearGradient id="tb-wall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#e7a2c2" />
        <stop offset="1" stopColor="#f8cade" />
      </linearGradient>
      <linearGradient id="tb-wall-side" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#5a2a5a" stopOpacity=".22" />
        <stop offset=".18" stopColor="#5a2a5a" stopOpacity="0" />
        <stop offset=".82" stopColor="#5a2a5a" stopOpacity="0" />
        <stop offset="1" stopColor="#5a2a5a" stopOpacity=".22" />
      </linearGradient>
      <pattern id="tb-paper" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M30 22 c-5 -6 -12 0 -6 6 l6 5 l6 -5 c6 -6 -1 -12 -6 -6z" fill="#ffc6dc" />
        <circle cx="0" cy="0" r="2.4" fill="#ffc6dc" />
        <circle cx="60" cy="60" r="2.4" fill="#ffc6dc" />
        <circle cx="0" cy="60" r="2.4" fill="#ffc6dc" />
        <circle cx="60" cy="0" r="2.4" fill="#ffc6dc" />
      </pattern>
      <linearGradient id="tb-floor" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#d9a35e" />
        <stop offset="1" stopColor="#b97a3a" />
      </linearGradient>
      <linearGradient id="tb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1d1660" />
        <stop offset="1" stopColor="#5a3f9e" />
      </linearGradient>
      <linearGradient id="tb-curtain" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#9c6ee0" />
        <stop offset=".5" stopColor="#c3a0f2" />
        <stop offset="1" stopColor="#9c6ee0" />
      </linearGradient>
      <linearGradient id="tb-duvet" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#ffa3c2" />
        <stop offset="1" stopColor="#f2759f" />
      </linearGradient>
      <linearGradient id="tb-mirror" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#e3f5ff" />
        <stop offset="1" stopColor="#9fd0f0" />
      </linearGradient>
      <linearGradient id="tb-moonbeam" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#cfe3ff" stopOpacity=".35" />
        <stop offset="1" stopColor="#cfe3ff" stopOpacity="0" />
      </linearGradient>
      <radialGradient id="tb-lamp-glow">
        <stop offset="0" stopColor="#fff1b8" stopOpacity=".9" />
        <stop offset=".45" stopColor="#ffd98a" stopOpacity=".4" />
        <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="tb-bulb">
        <stop offset="0" stopColor="#fff6c8" stopOpacity=".9" />
        <stop offset="1" stopColor="#fff6c8" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="tb-shadow">
        <stop offset="0" stopColor="#3a1a2a" stopOpacity=".4" />
        <stop offset="1" stopColor="#3a1a2a" stopOpacity="0" />
      </radialGradient>
      <clipPath id="tb-window"><rect x={748} y={92} width={248} height={234} rx={10} /></clipPath>
    </defs>
  );
}

/** Raam met nachtelijk Tilburg, sneeuw en gordijnen. */
function Window() {
  return (
    <g>
      {/* maanlicht valt de kamer in (achter de meubels) */}
      <path d="M748 346 L996 346 L1180 900 L560 900Z" fill="url(#tb-moonbeam)" />
      <rect x={742} y={86} width={260} height={246} rx={14} fill="url(#tb-sky)" />
      <g clipPath="url(#tb-window)">
        <circle cx={940} cy={140} r={38} fill="#fff4c9" opacity={0.25} />
        <circle cx={940} cy={140} r={22} fill="#ffe27a" />
        <circle cx={933} cy={134} r={4} fill="#f2cf5a" />
        {[[780, 124], [830, 170], [790, 230], [960, 214], [870, 120]].map(([x, y], i) => (
          <circle key={i} className="star" style={{ animationDelay: `${i * 0.6}s` }} cx={x} cy={y} r={2.4} fill="#fff" />
        ))}
        {/* skyline van Tilburg: daken, de Heikese kerk en een hoge toren */}
        <path d="M748 326 V286 H780 V270 L796 256 L812 270 V292 H836 V262 H852 V300 H880 L896 284 L912 300 V280 H930 V248 H958 V300 H996 V326Z" fill="#2a2368" />
        <path d="M858 300 V226 L866 196 L874 226 V300Z" fill="#2a2368" />
        <path d="M866 196 V184" stroke="#2a2368" strokeWidth={2} />
        {[[790, 280], [800, 280], [842, 276], [938, 262], [946, 278], [938, 292], [884, 306]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width={5} height={6} fill="#ffd76a" opacity={0.85} />
        ))}
        {/* sneeuw */}
        {Array.from({ length: 16 }, (_, i) => (
          <circle
            key={i}
            className="tb-snow"
            style={{ animationDelay: `${-rnd(i, 1) * 8}s`, animationDuration: `${6 + rnd(i, 2) * 4}s` }}
            cx={752 + rnd(i, 3) * 240}
            cy={80}
            r={1.8 + rnd(i, 4) * 2}
            fill="#fff"
          />
        ))}
      </g>
      {/* kozijn */}
      <rect x={742} y={86} width={260} height={246} rx={14} fill="none" stroke="#fff" strokeWidth={10} />
      <rect x={742} y={86} width={260} height={246} rx={14} fill="none" stroke={INK} strokeWidth={2.5} />
      <path d="M872 86 V332 M742 209 H1002" stroke="#fff" strokeWidth={9} />
      <path d="M872 86 V332 M742 209 H1002" stroke="#d7cfe6" strokeWidth={2} opacity={0.6} />
      <rect x={720} y={330} width={304} height={18} rx={6} fill="#fff" {...O} strokeWidth={2.5} />
      <rect x={724} y={346} width={296} height={6} fill="#e6d9ec" />
      {/* gordijnroede en gordijnen met plooien en embrasse */}
      <path d="M690 76 H1054" stroke="#8d6ad8" strokeWidth={8} strokeLinecap="round" />
      <circle cx={688} cy={76} r={9} fill="#ffc400" {...O} strokeWidth={2} />
      <circle cx={1056} cy={76} r={9} fill="#ffc400" {...O} strokeWidth={2} />
      <g className="tb-curtain" style={{ transformOrigin: "738px 80px" }}>
        <path d="M700 80 Q744 200 716 300 Q712 330 722 360 L782 360 Q770 280 774 240 Q776 160 776 80Z" fill="url(#tb-curtain)" {...O} strokeWidth={2.5} />
        <path d="M718 90 Q736 200 730 340 M748 90 Q756 200 750 350" fill="none" stroke="#8457c9" strokeWidth={3} opacity={0.6} />
      </g>
      <g className="tb-curtain" style={{ transformOrigin: "1006px 80px", animationDelay: "-2s" }}>
        <path d="M1044 80 Q1000 200 1028 300 Q1032 330 1022 360 L962 360 Q974 280 970 240 Q968 160 968 80Z" fill="url(#tb-curtain)" {...O} strokeWidth={2.5} />
        <path d="M1026 90 Q1008 200 1014 340 M996 90 Q988 200 994 350" fill="none" stroke="#8457c9" strokeWidth={3} opacity={0.6} />
      </g>
      <path d="M712 262 Q744 272 778 258" fill="none" stroke="#ffc400" strokeWidth={6} strokeLinecap="round" />
      <path d="M1032 262 Q1000 272 966 258" fill="none" stroke="#ffc400" strokeWidth={6} strokeLinecap="round" />
    </g>
  );
}

function Bed() {
  return (
    <g>
      <ellipse cx={290} cy={652} rx={290} ry={22} fill="url(#tb-shadow)" />
      {/* hoofdeinde: gestoffeerd met knopen */}
      <rect x={30} y={372} width={52} height={240} rx={18} fill={WOOD_DARK} {...O} />
      <rect x={38} y={384} width={36} height={170} rx={12} fill="#ff8fb3" stroke={INK} strokeWidth={2} />
      {[410, 446, 482, 518].map((y) => <circle key={y} cx={56} cy={y} r={3} fill="#d9547f" />)}
      <rect x={52} y={598} width={22} height={52} fill={WOOD_DARK} {...O} />
      <rect x={504} y={598} width={22} height={52} fill={WOOD_DARK} {...O} />
      {/* bedframe met houtnerf */}
      <rect x={60} y={520} width={480} height={80} rx={10} fill={WOOD} {...O} />
      <path d="M80 548 Q200 540 320 552 T520 546 M90 574 Q240 566 380 578 T520 572" fill="none" stroke={WOOD_DARK} strokeWidth={2} opacity={0.6} />
      <rect x={66} y={524} width={468} height={6} rx={3} fill="#e0a868" />
      {/* matras en kussen */}
      <rect x={66} y={468} width={470} height={60} rx={22} fill="#fff" {...O} />
      <rect x={82} y={440} width={124} height={44} rx={20} fill="#fff" {...O} />
      <path d="M96 470 Q144 478 192 468" fill="none" stroke="#e5ddf0" strokeWidth={3} />
      <path d="M90 448 Q140 444 196 452" fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />
      {/* dekbed met stippen, quilting en omgeslagen rand */}
      <path d="M200 462 H520 Q548 462 548 490 V530 Q548 540 538 540 H200Z" fill="url(#tb-duvet)" {...O} />
      {[[240, 486], [300, 506], [356, 482], [420, 510], [478, 486], [506, 516], [270, 524], [388, 528]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={4.5} fill="#fff" opacity={0.75} />
      ))}
      <path d="M260 466 V536 M330 466 V536 M400 466 V536 M470 466 V536" stroke="#e8608e" strokeWidth={2} strokeDasharray="6 6" />
      <path d="M200 462 H236 V540 H200Z" fill="#fff" stroke={INK} strokeWidth={2.5} strokeLinejoin="round" />
      <path d="M210 470 V532" stroke="#ffb3cc" strokeWidth={4} />
      {/* plaid over het voeteneind */}
      <path d="M492 460 Q520 456 552 470 L556 560 Q532 566 500 556Z" fill="#7fd6c2" {...O} strokeWidth={2.5} />
      <path d="M504 470 L506 552 M520 466 L524 556 M536 468 L540 558" stroke="#5fb8a3" strokeWidth={3} />
      <path d="M500 556 l4 10 M512 559 l3 10 M524 560 l2 10 M536 560 l2 10 M548 560 l1 10" stroke="#5fb8a3" strokeWidth={2.5} strokeLinecap="round" />
    </g>
  );
}

function Nightstand() {
  return (
    <g>
      <ellipse cx={645} cy={644} rx={74} ry={9} fill="url(#tb-shadow)" />
      <rect x={586} y={482} width={118} height={158} rx={8} fill={WOOD} {...O} />
      <rect x={582} y={478} width={126} height={12} rx={4} fill="#d99a58" {...O} strokeWidth={2.5} />
      {[500, 564].map((y) => (
        <g key={y}>
          <rect x={598} y={y} width={94} height={52} rx={6} fill="#b87a3f" stroke={INK} strokeWidth={2} />
          <rect x={602} y={y + 4} width={86} height={5} rx={2} fill="#d99a58" opacity={0.7} />
          <rect x={632} y={y + 22} width={26} height={8} rx={4} fill="#ffc400" stroke={INK} strokeWidth={1.6} />
        </g>
      ))}
      <rect x={692} y={486} width={10} height={152} fill="rgba(60,20,10,.18)" />
      {/* lamp met gloed */}
      <circle className="lamp-glow" cx={605} cy={430} r={300} fill="url(#tb-lamp-glow)" />
      <ellipse cx={605} cy={480} rx={22} ry={5} fill="#6b4bb5" stroke={INK} strokeWidth={2} />
      <path d="M602 440 Q596 460 602 478 H610 Q616 460 610 440Z" fill="#8d6ad8" stroke={INK} strokeWidth={2} />
      <path d="M578 442 L594 394 H616 L632 442Z" fill="#ffe9a0" {...O} />
      <path d="M582 442 L632 442" stroke="#ffc400" strokeWidth={4} />
      <path d="M594 400 L588 436" stroke="#fff" strokeWidth={3} opacity={0.7} strokeLinecap="round" />
    </g>
  );
}

function Vanity() {
  return (
    <g>
      <ellipse cx={880} cy={644} rx={120} ry={10} fill="url(#tb-shadow)" />
      {/* spiegel met lampjes rondom */}
      <circle cx={880} cy={438} r={76} fill={WOOD} {...O} />
      <circle cx={880} cy={438} r={64} fill="url(#tb-mirror)" stroke={INK} strokeWidth={2.5} />
      <path d="M842 404 Q862 384 892 390" stroke="#fff" strokeWidth={7} strokeLinecap="round" fill="none" opacity={0.85} />
      <path d="M906 470 Q920 456 922 438" stroke="#fff" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.6} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const x = 880 + Math.cos(a) * 76;
        const y = 438 + Math.sin(a) * 76;
        if (y > 500) return null;
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={14} fill="url(#tb-bulb)" className="twinkle" style={{ animationDelay: `${i * 0.3}s`, animationDuration: "2.4s" }} />
            <circle cx={x} cy={y} r={5.5} fill="#fff6c8" stroke={INK} strokeWidth={1.6} />
          </g>
        );
      })}
      {/* tafel met lade, poten en kruk */}
      <rect x={772} y={512} width={216} height={16} rx={5} fill="#ff8fb3" {...O} />
      <rect x={776} y={514} width={208} height={4} rx={2} fill="#ffc1d6" />
      <rect x={784} y={528} width={14} height={112} fill="#ff8fb3" {...O} />
      <rect x={962} y={528} width={14} height={112} fill="#ff8fb3" {...O} />
      <rect x={812} y={532} width={140} height={44} rx={6} fill="#ffb6cf" {...O} strokeWidth={2.5} />
      <path d="M866 554 H894" stroke="#ffc400" strokeWidth={6} strokeLinecap="round" />
      <path d="M862 610 L858 640 M898 610 L902 640" stroke={WOOD_DARK} strokeWidth={8} strokeLinecap="round" />
      <ellipse cx={880} cy={604} rx={46} ry={12} fill="#5fb8a3" stroke={INK} strokeWidth={2.5} />
      <ellipse cx={880} cy={596} rx={44} ry={14} fill="#7fd6c2" {...O} />
      <ellipse cx={866} cy={590} rx={18} ry={4} fill="#fff" opacity={0.45} />
    </g>
  );
}

function Desk() {
  return (
    <g>
      <ellipse cx={1180} cy={646} rx={150} ry={10} fill="url(#tb-shadow)" />
      {/* prikbord boven het bureau */}
      <rect x={1062} y={360} width={232} height={128} rx={8} fill="#c98a4b" {...O} />
      <rect x={1072} y={370} width={212} height={108} rx={4} fill="#e2b77c" />
      {[[1090, 380, "#fff59a", -6], [1134, 386, "#a8ebdb", 4], [1240, 380, "#ffc1d6", 7], [1196, 420, "#bfe6ff", -4]].map(([x, y, c, r], i) => (
        <g key={i} transform={`rotate(${r} ${x as number} ${y as number})`}>
          <rect x={x as number} y={y as number} width={36} height={34} fill={c as string} stroke={INK} strokeWidth={1.6} />
          <path d={`M${(x as number) + 6} ${(y as number) + 12} h22 M${(x as number) + 6} ${(y as number) + 20} h16`} stroke={INK} strokeWidth={1.4} opacity={0.5} />
          <circle cx={(x as number) + 18} cy={(y as number) + 3} r={3} fill="#e8174f" />
        </g>
      ))}
      <g transform="rotate(-3 1170 440)">
        <rect x={1148} y={420} width={44} height={50} fill="#fff" stroke={INK} strokeWidth={1.6} />
        <rect x={1152} y={424} width={36} height={32} fill="#ffd1e3" />
        <path d="M1170 450 c-8 -8 -14 0 -8 5 l8 6 l8 -6 c6 -5 0 -13 -8 -5z" fill="#e8174f" />
      </g>
      <path d="M1094 430 Q1140 446 1180 430 T1270 444" fill="none" stroke="#e8174f" strokeWidth={2} strokeDasharray="4 4" />
      {/* stoel */}
      <rect x={1124} y={466} width={64} height={150} rx={16} fill="#2fb3a0" {...O} />
      <rect x={1134} y={478} width={44} height={70} rx={12} fill="#5fd3bf" />
      <rect x={1114} y={598} width={84} height={16} rx={7} fill="#2fb3a0" {...O} />
      <path d="M1156 614 V636 M1130 642 L1182 642" stroke="#4a4a5a" strokeWidth={6} strokeLinecap="round" />
      {/* bureaublad, ladeblok en poot */}
      <rect x={1040} y={522} width={268} height={16} rx={5} fill="#8d6ad8" {...O} />
      <rect x={1044} y={524} width={260} height={4} rx={2} fill="#b39af0" />
      <rect x={1052} y={538} width={92} height={102} rx={5} fill="#a98be8" {...O} strokeWidth={2.5} />
      {[552, 594].map((y) => (
        <g key={y}>
          <rect x={1062} y={y} width={72} height={34} rx={4} fill="#8d6ad8" />
          <rect x={1086} y={y + 14} width={24} height={7} rx={3.5} fill="#ffc400" stroke={INK} strokeWidth={1.4} />
        </g>
      ))}
      <rect x={1288} y={538} width={14} height={102} fill="#a98be8" {...O} strokeWidth={2.5} />
    </g>
  );
}

function Wardrobe() {
  return (
    <g>
      <ellipse cx={1457} cy={646} rx={150} ry={10} fill="url(#tb-shadow)" />
      {/* kast met kroonlijst, panelen en plint */}
      <rect x={1324} y={140} width={266} height={14} rx={4} fill="#7a58c4" {...O} />
      <rect x={1332} y={146} width={250} height={494} rx={10} fill="#8d6ad8" {...O} strokeWidth={4} />
      <path d="M1457 154 V632" stroke={INK} strokeWidth={3} />
      <rect x={1346} y={166} width={100} height={216} rx={6} fill="#9b7ce0" stroke="#6f4fb8" strokeWidth={3} />
      <rect x={1468} y={166} width={100} height={216} rx={6} fill="url(#tb-mirror)" stroke="#6f4fb8" strokeWidth={3} />
      <path d="M1480 196 L1520 176 M1484 236 L1550 200" stroke="#fff" strokeWidth={5} strokeLinecap="round" opacity={0.7} />
      <rect x={1346} y={404} width={100} height={180} rx={6} fill="#9b7ce0" stroke="#6f4fb8" strokeWidth={3} />
      <rect x={1468} y={404} width={100} height={180} rx={6} fill="#9b7ce0" stroke="#6f4fb8" strokeWidth={3} />
      <rect x={1434} y={360} width={8} height={70} rx={4} fill="#ffc400" stroke={INK} strokeWidth={1.8} />
      <rect x={1472} y={360} width={8} height={70} rx={4} fill="#ffc400" stroke={INK} strokeWidth={1.8} />
      <rect x={1346} y={598} width={100} height={30} rx={4} fill="#7a58c4" />
      <rect x={1468} y={598} width={100} height={30} rx={4} fill="#7a58c4" />
      <rect x={1560} y={150} width={20} height={488} fill="rgba(30,10,60,.2)" />
    </g>
  );
}

/** Statisch decor van de slaapkamer. */
const RoomBackground = memo(function RoomBackground() {
  return (
    <svg className="room-bg" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden>
      <Defs />
      {/* muur met behang, kroonlijst en schaduw in de hoeken */}
      <rect width={1600} height={650} fill="url(#tb-wall)" />
      <rect width={1600} height={650} fill="url(#tb-paper)" opacity={0.7} />
      <rect width={1600} height={650} fill="url(#tb-wall-side)" />
      <rect width={1600} height={16} fill="#fff" />
      <rect y={14} width={1600} height={6} fill="#e9b3cb" />

      {/* vloer: planken in perspectief */}
      <rect y={650} width={1600} height={250} fill="url(#tb-floor)" />
      {Array.from({ length: 8 }, (_, i) => (
        <rect key={i} y={668 + i * 32 + i * i * 1.5} width={1600} height={3} fill="#a8692c" opacity={0.7} />
      ))}
      {Array.from({ length: 24 }, (_, i) => {
        const x = -400 + i * 100;
        return <path key={i} d={`M${x + (i % 2) * 30} ${668 + (i % 3) * 32} L${x + (x - 800) * 0.25} 900`} stroke="#a8692c" strokeWidth={2} opacity={0.45} />;
      })}
      <path d="M0 700 Q400 690 800 700 T1600 700" fill="none" stroke="#fff" strokeWidth={10} opacity={0.08} />
      <rect y={632} width={1600} height={22} fill="#fff" stroke={INK} strokeWidth={2} />
      <rect y={650} width={1600} height={10} fill="#5a2a1a" opacity={0.18} />

      {/* lichtsnoer met gloed */}
      <path d="M20 28 Q220 90 420 40 T820 40 T1220 44 T1580 30" fill="none" stroke="#6b4bb5" strokeWidth={3} />
      {LIGHTS.map(([x, y, c], i) => (
        <g key={x}>
          <circle className="twinkle" style={{ animationDelay: `${(i % 4) * 0.4}s` }} cx={x} cy={y + 4} r={24} fill={c} opacity={0.22} />
          <rect x={x - 4} y={y - 14} width={8} height={8} rx={2} fill="#4a3a6a" />
          <circle cx={x} cy={y} r={9} fill={c} stroke={INK} strokeWidth={2} />
          <circle cx={x - 3} cy={y - 3} r={2.5} fill="#fff" opacity={0.8} />
        </g>
      ))}

      {/* ingelijste posters en een slinger met polaroids */}
      <g>
        <rect x={114} y={90} width={142} height={122} rx={6} fill={WOOD} {...O} />
        <rect x={124} y={100} width={122} height={102} fill="#bfe6ff" />
        <rect x={124} y={160} width={122} height={42} fill="#7fd6c2" />
        <path d="M124 202 L170 140 L196 170 L218 146 L246 186 V202Z" fill="#5a8fd6" stroke={INK} strokeWidth={2} />
        <path d="M164 148 L170 140 L176 148Z" fill="#fff" />
        <circle cx={220} cy={120} r={11} fill="#ffc400" />
      </g>
      <g>
        <rect x={294} y={100} width={108} height={108} rx={6} fill="#fff" {...O} />
        <rect x={304} y={110} width={88} height={88} fill="#ffe3ee" />
        <path d="M348 186 c-30 -22 -32 -46 -12 -50 c9 -2 12 4 12 8 c0 -4 3 -10 12 -8 c20 4 18 28 -12 50z" fill="#ff3d68" stroke={INK} strokeWidth={2} />
        <path d="M330 148 q4 -6 10 -4" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
      <path d="M440 116 Q560 160 680 118" fill="none" stroke="#8a5a2b" strokeWidth={2} />
      {[[470, 128, -8, "#ffd1e3"], [530, 144, 5, "#bfe6ff"], [595, 146, -4, "#fff59a"], [650, 128, 8, "#c7a6f5"]].map(([x, y, r, c], i) => (
        <g key={i} transform={`rotate(${r} ${x as number} ${y as number})`}>
          <g className="tb-polaroid" style={{ animationDelay: `${i * -0.8}s`, transformOrigin: `${x}px ${y}px` }}>
            <rect x={(x as number) - 22} y={y as number} width={44} height={50} fill="#fff" stroke={INK} strokeWidth={1.8} />
            <rect x={(x as number) - 18} y={(y as number) + 4} width={36} height={32} fill={c as string} />
            <circle cx={x as number} cy={(y as number) + 16} r={7} fill="#fff" opacity={0.8} />
            <rect x={(x as number) - 3} y={(y as number) - 5} width={6} height={9} fill="#8d6ad8" />
          </g>
        </g>
      ))}

      {/* wandplank met plantje */}
      <path d="M130 268 L130 292 Q130 300 140 300 M440 268 L440 292 Q440 300 430 300" fill="none" stroke={WOOD_DARK} strokeWidth={8} strokeLinecap="round" />
      <rect x={100} y={252} width={370} height={16} rx={4} fill={WOOD} {...O} />
      <rect x={104} y={254} width={362} height={4} rx={2} fill="#e0a868" />
      <ellipse cx={285} cy={276} rx={160} ry={8} fill="#5a2a5a" opacity={0.12} />
      <g>
        {[[-12, -40, -20], [0, -50, 0], [12, -40, 20], [-6, -30, -40], [8, -32, 40]].map(([dx, dy, r], i) => (
          <ellipse key={i} cx={285 + dx} cy={232 + dy / 2} rx={6} ry={14} fill={i % 2 ? "#5fbf7a" : "#3f9a5a"} stroke={INK} strokeWidth={1.6} transform={`rotate(${r} ${285 + dx} ${232 + dy / 2})`} />
        ))}
        <path d="M271 230 H299 L295 252 H275Z" fill="#ff8fb3" stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>

      <Window />
      <Bed />
      <Nightstand />
      <Vanity />
      <Desk />
      <Wardrobe />

      {/* rond hoogpolig vloerkleed met franjes */}
      <ellipse cx={780} cy={806} rx={426} ry={92} fill="#5a2a3a" opacity={0.15} />
      <ellipse cx={780} cy={800} rx={420} ry={88} fill="#7fd6c2" {...O} strokeWidth={2.5} />
      <ellipse cx={780} cy={800} rx={360} ry={70} fill="#a8ebdb" />
      <ellipse cx={780} cy={800} rx={300} ry={56} fill="none" stroke="#ff8fb3" strokeWidth={6} strokeDasharray="2 14" strokeLinecap="round" />
      <ellipse cx={780} cy={800} rx={240} ry={42} fill="#7fd6c2" opacity={0.6} />
      <ellipse cx={780} cy={800} rx={160} ry={26} fill="none" stroke="#fff" strokeWidth={4} opacity={0.6} />
      {Array.from({ length: 40 }, (_, i) => {
        const a = (i / 40) * Math.PI * 2;
        const x = 780 + Math.cos(a) * 420;
        const y = 800 + Math.sin(a) * 88;
        return <path key={i} d={`M${x} ${y} l${Math.cos(a) * 10} ${Math.sin(a) * 6}`} stroke="#5fb8a3" strokeWidth={3} strokeLinecap="round" />;
      })}
    </svg>
  );
});

export default RoomBackground;
