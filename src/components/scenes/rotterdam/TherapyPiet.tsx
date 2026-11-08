"use client";

import type { LineMood } from "@/content/dialogue";
import { texts as t } from "@/content/rotterdam";
import PietPortrait from "@/components/PietSprite";

interface Props {
  mood: LineMood;
  /** Index van de regel die nu klinkt (kiest de overdreven notitie); null = geen. */
  noteIndex: number | null;
}

/** Relatiepsycholoog-Piet verschijnt theatraal in de spotlight en maakt overdreven notities. */
export default function TherapyPiet({ mood, noteIndex }: Props) {
  return (
    <div className="therapy-layer" aria-hidden>
      <div className="therapy-spot" />
      <div className="therapy-stage">
        <div className="therapy-name">{t.therapyEnter}</div>
        <div className={`therapy-piet mood-${mood}`}>
          <PietPortrait variant="psycholoog" mood={mood} size={400} />
        </div>
        <svg className="therapy-pad" viewBox="0 0 120 150">
          <g transform="rotate(-8 60 75)">
            <rect x={10} y={8} width={100} height={130} rx={8} fill="#fff7d6" stroke="#2b1b3d" strokeWidth={4} />
            <rect x={10} y={8} width={100} height={20} rx={8} fill="#d62f52" stroke="#2b1b3d" strokeWidth={4} />
            <path className="scribble" d="M24 50 q10 -10 20 0 t20 0 t20 0 M24 72 q12 -10 24 0 t24 0 t14 0 M24 94 q8 -8 16 0 t16 0 t16 0 t16 0 M24 116 q10 -10 20 0 t20 0" fill="none" stroke="#2b1b3d" strokeWidth={4} strokeLinecap="round" />
          </g>
        </svg>
        {noteIndex !== null && (
          <div key={noteIndex} className="therapy-note">
            {t.therapyNotes[noteIndex] ?? ""}
          </div>
        )}
      </div>
    </div>
  );
}
