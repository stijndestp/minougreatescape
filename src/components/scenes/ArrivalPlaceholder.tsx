"use client";

import { arrivalTexts as t } from "@/content/arrival";
import { locations } from "@/content/locations";
import type { SceneProps } from "../SceneHost";

/** Tijdelijke aankomstscène voor locaties zonder minigame. Voltooit de locatie NIET. */
export default function ArrivalPlaceholder({ locationId, onExit }: SceneProps & { locationId: string }) {
  const loc = locations.find((l) => l.id === locationId);
  if (!loc) return null;
  return (
    <div className="arrival">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="arrival-bg" src={loc.image} alt="" />
      <div className="arrival-card">
        <h1>{t.title(loc.name)}</h1>
        <p>{t.message(loc.sceneTitle)}</p>
        <button className="btn btn-primary" onClick={onExit}>
          {t.back}
        </button>
      </div>
    </div>
  );
}
