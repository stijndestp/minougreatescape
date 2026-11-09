"use client";

import type { CSSProperties } from "react";
import type { HeroMood } from "@/components/MinouHero";
import { delftTexts, kissTimes, stage, timeline } from "@/content/delft";
import type { FinalePhase } from "@/game/finale";
import { JobArt, MinouArt, SinterklaasArt, type JobMood, type JobPose } from "./DelftCast";
import DelftScenery from "./DelftScenery";
import LoveGate from "./LoveGate";

interface Props {
  phase: FinalePhase;
  /** Verandert bij elke foute code (slot schudt). */
  wrongKey: number;
}

const RUN_PHASES: FinalePhase[] = ["run"];
const REUNION: FinalePhase[] = ["hug", "escalate", "outro", "end"];
const BIG_HEART = "M0 120 C-190 0 -150 -170 -50 -170 C-10 -170 0 -130 0 -116 C0 -130 10 -170 50 -170 C150 -170 190 0 0 120Z";

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

  // Alleen weergave: gezichtsuitdrukkingen per fase.
  const minouMood: HeroMood =
    reunion ? "love" : phase === "wrong" ? "worried" : phase === "gate" ? "surprised" : phase === "run" || phase === "intro" ? "happy" : "neutral";
  const jobMood: JobMood = reunion ? "love" : phase === "gate" ? "surprised" : "smile";

  // Midden tussen de hoofden van het knuffelende stel (voor het grote hart en de kusjes).
  const couple = { x: (stage.minouHug.x + stage.jobHug.x) / 2, y: stage.minouHug.y - 150 * s * 0.62 };
  const kisses = phase === "hug" ? kissTimes.hug : phase === "escalate" ? kissTimes.escalate : [];

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

      {/* groot gloeiend hart achter het stel tijdens de hereniging */}
      {reunion && (
        <g transform={`translate(${couple.x} ${couple.y + 40})`} aria-hidden>
          <g className={phase === "escalate" ? "couple-heart couple-heart-wild" : "couple-heart"}>
            <path d={BIG_HEART} fill="url(#couple-heart-fill)" />
            <path d={BIG_HEART} fill="none" stroke="#fff" strokeWidth={4} opacity={0.5} transform="scale(.9)" />
          </g>
        </g>
      )}
      <defs>
        <radialGradient id="couple-heart-fill" cx=".5" cy=".45" r=".6">
          <stop offset="0" stopColor="#fff2c4" stopOpacity=".95" />
          <stop offset=".45" stopColor="#ff8fc0" stopOpacity=".7" />
          <stop offset="1" stopColor="#ff4d8d" stopOpacity=".15" />
        </radialGradient>
      </defs>

      {/* Job wacht achter de poort */}
      <g transform={`translate(${jobPos.x} ${jobPos.y}) scale(${s})`}>
        <g className={reunion ? (phase === "escalate" ? "hug-job hug-wild" : "hug-job") : "job-idle"} key={reunion ? "hug" : jobPose}>
          <JobArt pose={jobPose} mood={jobMood} />
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
          <MinouArt mood={minouMood} />
        </g>
      </g>

      {/* "SMAK!" en kuslipjes, precies op de momenten van de kusgeluidjes */}
      {kisses.length > 0 && (
        <g key={phase} transform={`translate(${couple.x} ${couple.y})`} aria-hidden>
          {kisses.map((ms, i) => (
            <g key={ms} transform={`translate(${(i % 2 ? 1 : -1) * (40 + (i % 3) * 18)} ${-30 - (i % 3) * 22}) rotate(${i % 2 ? 12 : -12})`}>
              <g className="kiss-pop" style={{ animationDelay: `${ms}ms` }}>
                <path d="M-22 0 Q-11 -14 0 -5 Q11 -14 22 0 Q11 14 0 8 Q-11 14 -22 0Z" fill="#e8174f" stroke="#2b1b3d" strokeWidth={3} strokeLinejoin="round" />
                <path d="M-18 0 Q0 4 18 0" fill="none" stroke="#8a0a2e" strokeWidth={2.4} />
                <path d="M-12 -6 Q-6 -9 -2 -5" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />
                <text className="kiss-word" y={-22} textAnchor="middle">{delftTexts.kissPop}</text>
              </g>
            </g>
          ))}
        </g>
      )}

      {phase === "run" && (
        <text className="slowmo-label" x={800} y={190} textAnchor="middle">
          {delftTexts.slowMotion}
        </text>
      )}
      </g>
    </svg>
  );
}
