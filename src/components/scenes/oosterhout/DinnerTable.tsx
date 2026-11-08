"use client";

import { memo, type CSSProperties } from "react";
import { familyMembers, minouSeat, tableItems, type Mood } from "@/content/oosterhout";
import DiningRoom from "./DiningRoom";
import { dishArt } from "./dishArt";
import FamilyPerson from "./FamilyPerson";

const O = { stroke: "#2b1b3d", strokeWidth: 3, strokeLinejoin: "round" as const };

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
}

function Chair({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-84} y={-208} width={168} height={214} rx={24} fill="#a96d33" {...O} />
      <rect x={-70} y={-196} width={140} height={60} rx={16} fill="#c98a4b" />
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
        </pattern>
      </defs>
      <ellipse cx={800} cy={690} rx={720} ry={36} fill="rgba(0,0,0,.18)" />
      <rect x={120} y={586} width={1360} height={76} fill="url(#cloth)" {...O} />
      {Array.from({ length: 17 }, (_, i) => (
        <circle key={i} cx={160 + i * 80} cy={662} r={40} fill="url(#cloth)" {...O} />
      ))}
      <rect x={120} y={640} width={1360} height={24} fill="url(#cloth)" />
      <path d="M190 468 H1410 L1480 590 H120Z" fill="url(#cloth)" {...O} />
      <path d="M190 468 H1410" stroke="#ffd45e" strokeWidth={6} />
    </g>
  );
});

/**
 * De eetkamer met familietafel: personen, tafel, serviesgoed en gangen.
 * Pure weergave; welk familielid actief is en hoeveel er geserveerd is komt van buiten.
 */
export default function DinnerTable({ served, activeId, activeMood, minouMood, burstKey }: Props) {
  const items = tableItems.filter((t) => t.course <= served).sort((a, b) => a.y - b.y);
  const active = familyMembers.find((m) => m.id === activeId);

  return (
    <svg
      className={activeId ? "dinner-svg has-speaker" : "dinner-svg"}
      viewBox="0 0 1600 900"
      preserveAspectRatio="none"
      role="img"
      aria-label="Het familiediner in Oosterhout"
    >
      <DiningRoom />

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

      <Table />

      {/* servies en gerechten */}
      {items.map((t, i) => (
        <g key={t.id} transform={`translate(${t.x} ${t.y}) scale(${t.scale ?? 1})`}>
          <g className="dish" style={{ animationDelay: `${(t.course === 0 ? i * 0.04 : (i % 6) * 0.12).toFixed(2)}s` } as CSSProperties}>
            {dishArt[t.art]()}
          </g>
        </g>
      ))}

      {/* Minou aan het hoofd van de tafel */}
      <g transform={`translate(${minouSeat.seat.x} ${minouSeat.seat.y})`}>
        <Chair x={0} y={0} />
        <g transform="scale(-1 1)">
          <g className={["fam", "fam-minou", `fam-${minouMood}`].join(" ")}>
            <FamilyPerson look={minouSeat.look} mood={minouMood} />
          </g>
        </g>
      </g>

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
