"use client";

import { memo, type CSSProperties } from "react";
import MinouHero, { MinouEmote, type HeroArms, type HeroMood } from "@/components/MinouHero";
import { familyMembers, minouSeat, tableItems, type Mood } from "@/content/oosterhout";
import DiningRoom from "./DiningRoom";
import { dishArt } from "./dishArt";
import FamilyPerson from "./FamilyPerson";

const INK = "#2b1b3d";
const O = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };

/**
 * Minou is overal hetzelfde personage (MinouHero, het Rotterdam-ontwerp). Aan tafel zit ze
 * op dezelfde hoofdhoogte als de familie: hoofd (r 22) × 2.35 ≈ het hoofd van een familielid.
 * `MINOU_LINE` houdt het lijnwerk even dik als in Rotterdam (2 × 0.55 × 2.35 ≈ 2.6).
 */
const MINOU_SCALE = 2.35;
const MINOU_LINE = 0.55;
/** Voetpunt zo gekozen dat Minou's hoofd op dezelfde hoogte zit als de familie. */
const minouFoot = { x: minouSeat.seat.x, y: minouSeat.seat.y + 56 };

interface Props {
  /** Aantal geserveerde gangen (0..5): bepaalt wat er op tafel staat. */
  served: number;
  /** Id van het sprekende/actieve familielid ("minou" is niet actief spreker). */
  activeId: string | null;
  /** Gezichtsuitdrukking van het actieve familielid. */
  activeMood: Mood;
  /** Uitdrukking van Minou. */
  minouMood: Mood;
  /** Verandert bij elk goed antwoord: speelt het succes-effect opnieuw af. */
  burstKey: number;
  /** Minou juicht (na het laatste antwoord). Alleen weergave. */
  minouCheer?: boolean;
}

function Chair({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-84} y={-208} width={168} height={214} rx={24} fill="#8d5a2b" {...O} />
      <path d="M-84 -180 Q-84 -230 0 -232 Q84 -230 84 -180Z" fill="#a96d33" {...O} />
      <circle cx={0} cy={-214} r={8} fill="#e8b23a" stroke={INK} strokeWidth={2} />
      <rect x={-68} y={-196} width={136} height={120} rx={16} fill="#b83a5a" stroke={INK} strokeWidth={2.5} />
      {[[-36, -166], [0, -166], [36, -166], [-18, -130], [18, -130]].map(([cx, cy]) => (
        <circle key={`${cx}${cy}`} cx={cx} cy={cy} r={3.5} fill="#8f2442" />
      ))}
      <path d="M-60 -190 Q0 -198 60 -190" stroke="#e05a7a" strokeWidth={4} fill="none" strokeLinecap="round" />
      <rect x={70} y={-200} width={12} height={200} fill="rgba(40,10,0,.2)" />
    </g>
  );
}

const Table = memo(function Table() {
  return (
    <g>
      <defs>
        <pattern id="cloth" width={48} height={48} patternUnits="userSpaceOnUse">
          <rect width={48} height={48} fill="#fff7e8" />
          <rect width={24} height={24} fill="#ffc9d4" />
          <rect x={24} y={24} width={24} height={24} fill="#ffc9d4" />
          <path d="M0 24 H48 M24 0 V48" stroke="#ffb3c2" strokeWidth={1} />
        </pattern>
        <linearGradient id="cloth-shade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5a1a2a" stopOpacity="0" />
          <stop offset="1" stopColor="#5a1a2a" stopOpacity=".22" />
        </linearGradient>
        <linearGradient id="table-top-light" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff2c0" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff2c0" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx={830} cy={696} rx={770} ry={40} fill="rgba(40,10,0,.25)" />
      {/* tafelkleed: voorkant met kantjes en plooien */}
      <rect x={120} y={586} width={1440} height={76} fill="url(#cloth)" {...O} />
      {Array.from({ length: 18 }, (_, i) => (
        <circle key={i} cx={160 + i * 80} cy={662} r={40} fill="url(#cloth)" {...O} />
      ))}
      <rect x={120} y={640} width={1440} height={24} fill="url(#cloth)" />
      <rect x={120} y={586} width={1440} height={116} fill="url(#cloth-shade)" />
      {Array.from({ length: 18 }, (_, i) => (
        <path key={i} d={`M${130 + i * 80} 690 a10 10 0 0 0 20 0 a10 10 0 0 0 20 0 a10 10 0 0 0 20 0`} fill="none" stroke="#fff" strokeWidth={3} opacity={0.9} />
      ))}
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M${200 + i * 80} 594 V660`} stroke="#e8a0b0" strokeWidth={2} opacity={0.6} />
      ))}
      {/* tafelblad met loper en lichtval van de kroonluchter */}
      <path d="M190 468 H1500 L1560 590 H120Z" fill="url(#cloth)" {...O} />
      <path d="M190 468 H1500 L1560 590 H120Z" fill="url(#table-top-light)" />
      <path d="M176 524 H1424 L1442 556 H158Z" fill="#c0392b" stroke={INK} strokeWidth={2} />
      <path d="M170 534 H1430 M164 546 H1436" stroke="#e8b23a" strokeWidth={2.5} />
      <path d="M190 468 H1500" stroke="#ffd45e" strokeWidth={6} />
    </g>
  );
});

const toHeroMood = (m: Mood): HeroMood => (m === "happy" ? "happy" : m === "shocked" || m === "disapproving" ? "worried" : "neutral");

/**
 * De eetkamer met familietafel: personen, tafel, serviesgoed en gangen.
 * Pure weergave; welk familielid actief is en hoeveel er geserveerd is komt van buiten.
 */
export default function DinnerTable({ served, activeId, activeMood, minouMood, burstKey, minouCheer = false }: Props) {
  const items = tableItems.filter((t) => t.course <= served).sort((a, b) => a.y - b.y);
  const active = familyMembers.find((m) => m.id === activeId);
  const heroMood = minouCheer ? "happy" : toHeroMood(minouMood);
  const arms: HeroArms = minouCheer ? "cheer" : "down";
  const emote = minouMood === "shocked" ? "!" : minouMood === "happy" ? "♥" : null;

  return (
    <svg
      className={activeId ? "dinner-svg has-speaker" : "dinner-svg"}
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      role="img"
      aria-label="Het familiediner in Oosterhout"
    >
      <DiningRoom />

      {/* zacht spotlicht achter wie er aan het woord is */}
      {active && (
        <g key={active.id} transform={`translate(${active.seat.x} ${active.seat.y - 150})`} aria-hidden>
          <ellipse className="oh-spot" cx={0} cy={0} rx={150} ry={170} fill="url(#oh-chandelier)" />
        </g>
      )}

      {/* familie aan de overkant van de tafel */}
      {familyMembers.map((m) => {
        const isActive = m.id === activeId;
        const mood: Mood = isActive ? activeMood : "neutral";
        const scale = m.seat.scale ?? 1;
        return (
          <g key={m.id} transform={`translate(${m.seat.x} ${m.seat.y}) scale(${scale})`}>
            <Chair x={0} y={0} />
            <g className={["fam", isActive ? "fam-active" : "fam-idle", `fam-${mood}`].join(" ")} style={{ animationDelay: `${(m.seat.x % 7) * -0.4}s` } as CSSProperties}>
              <FamilyPerson look={m.look} mood={mood} />
              {isActive && (
                <g className="fam-tag">
                  <rect x={-78} y={-292} width={156} height={34} rx={17} fill="#fff" {...O} strokeWidth={2.5} />
                  <text x={0} y={-268} textAnchor="middle">
                    {m.name}
                  </text>
                </g>
              )}
            </g>
          </g>
        );
      })}

      {/* Minou aan het hoofd van de tafel: zelfde personage als in Rotterdam, zittend */}
      <g transform={`translate(${minouSeat.seat.x} ${minouSeat.seat.y})`}>
        <Chair x={0} y={0} />
      </g>
      <g transform={`translate(${minouFoot.x} ${minouFoot.y}) scale(${MINOU_SCALE})`}>
        <g className={minouMood === "happy" ? "fam-minou hero-nod" : "fam-minou"}>
          <MinouHero mood={heroMood} arms={arms} seated line={MINOU_LINE} />
        </g>
        {emote && (
          <g transform="translate(-34 -150)">
            <MinouEmote key={`${emote}-${burstKey}`} glyph={emote} />
          </g>
        )}
      </g>

      <Table />

      {/* servies en gerechten */}
      {items.map((t, i) => (
        <g key={t.id} transform={`translate(${t.x} ${t.y}) scale(${t.scale ?? 1})`}>
          <g className="dish" style={{ animationDelay: `${(t.course === 0 ? i * 0.04 : (i % 6) * 0.12).toFixed(2)}s` } as CSSProperties}>
            {dishArt[t.art]()}
          </g>
        </g>
      ))}

      {/* succes-effect boven het familielid dat net gelijk kreeg */}
      {burstKey > 0 && active && (
        <g key={burstKey} className="burst" transform={`translate(${active.seat.x} ${active.seat.y - 190})`}>
          {Array.from({ length: 8 }, (_, i) => (
            <text key={i} className="burst-star" style={{ "--a": `${i * 45}deg` } as CSSProperties} textAnchor="middle">
              {i % 2 ? "★" : "✦"}
            </text>
          ))}
        </g>
      )}
    </svg>
  );
}
