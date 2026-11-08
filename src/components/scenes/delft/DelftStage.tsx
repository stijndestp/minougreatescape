"use client";

import type { CSSProperties } from "react";
import { delftTexts, stage, timeline } from "@/content/delft";
import type { FinalePhase } from "@/game/finale";
import { JobArt, MinouArt, SinterklaasArt, type JobPose } from "./DelftCast";
import DelftScenery from "./DelftScenery";
import LoveGate from "./LoveGate";

interface Props {
  phase: FinalePhase;
  /** Verandert bij elke foute code (slot schudt). */
  wrongKey: number;
}

const RUN_PHASES: FinalePhase[] = ["run"];
const REUNION: FinalePhase[] = ["hug", "escalate", "outro", "end"];

/**
 * De hele Delft-scène in één vaste SVG (viewBox 1600 × 900). De personages staan
 * in eigen groepen, de animaties hangen alleen aan klassen en de fase: de tekeningen
 * (DelftCast.tsx) zijn dus los te vervangen.
 */
export default function DelftStage({ phase, wrongKey }: Props) {
  const unlocked = phase !== "intro" && phase !== "lock" && phase !== "wrong";
  const gateOpen = unlocked;
  const running = RUN_PHASES.includes(phase);
  const reunion = REUNION.includes(phase);
  const s = stage.scale;

  const minouPos = running ? stage.minouRun : reunion ? stage.minouHug : stage.minouStart;
  const jobPos = reunion ? stage.jobHug : stage.job;
  const jobPose: JobPose = reunion ? "hug" : phase === "run" || phase === "gate" ? "open" : "wave";

  // Sinterklaas: staat bij de poort, stapt opzij tijdens de hereniging en komt in scène E terug.
  const sintMode = phase === "run" || phase === "hug" || phase === "escalate" ? "away" : phase === "outro" || phase === "end" ? "back" : phase === "intro" ? "first" : "steady";

  const runDistance = (stage.minouRun.x - stage.minouStart.x) / s;
  const hugGap = (stage.minouHug.x - stage.minouRun.x) / s;

  return (
    <svg
      className={`delft-svg phase-${phase}`}
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid meet"
      role="group"
      aria-label="Delft, bij de poort van de liefde"
    >
      {/* alles staat 60 hoger, zodat de personages boven de dialoogbalk blijven */}
      <g transform="translate(0 -60)">
      <DelftScenery />

      {/* Job wacht achter de poort */}
      <g transform={`translate(${jobPos.x} ${jobPos.y}) scale(${s})`}>
        <g className={reunion ? (phase === "escalate" ? "hug-job hug-wild" : "hug-job") : "job-idle"} key={reunion ? "hug" : jobPose}>
          <JobArt pose={jobPose} />
        </g>
      </g>

      <LoveGate unlocked={unlocked} open={gateOpen} shakeKey={wrongKey} gateMs={timeline.gate} />

      {/* Sinterklaas naast de poort */}
      <g transform={`translate(${stage.sint.x} ${stage.sint.y}) scale(1.5)`}>
        <g key={sintMode} className={`sint-${sintMode}`}>
          <SinterklaasArt />
          {sintMode === "back" && (
            <g className="sweat" transform="translate(-30 -150)">
              <path d="M0 0 Q-8 14 0 20 Q8 14 0 0Z" fill="#7fd0ff" stroke="#2b1b3d" strokeWidth={2} />
            </g>
          )}
        </g>
      </g>

      {/* Minou: wacht, rent en wordt omarmd */}
      <g transform={`translate(${minouPos.x} ${minouPos.y}) scale(${s})`}>
        <g
          key={running ? "run" : reunion ? "hug" : "wait"}
          className={
            running ? "minou-marker run-in" : reunion ? (phase === "escalate" ? "minou-marker hug-minou hug-wild" : "minou-marker hug-minou") : "minou-marker minou-idle"
          }
          data-walking={running ? "true" : "false"}
          data-facing="right"
          style={
            {
              "--run": `${-runDistance}px`,
              "--hug-gap": `${-hugGap}px`,
              "--run-ms": `${timeline.run}ms`,
            } as CSSProperties
          }
        >
          <MinouArt />
        </g>
      </g>

      {phase === "run" && (
        <text className="slowmo-label" x={800} y={190} textAnchor="middle">
          {delftTexts.slowMotion}
        </text>
      )}
      </g>
    </svg>
  );
}
