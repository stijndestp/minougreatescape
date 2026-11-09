"use client";

import { useEffect, useState } from "react";
import type { DialogueLine } from "@/content/dialogue";
import { familyMembers, oosterhoutTexts as t, quiz, type Mood } from "@/content/oosterhout";
import { answerQuestion, createDinnerState, isDinnerComplete, type DinnerQuestion } from "@/game/dinner";
import DialogueBox from "../DialogueBox";
import type { SceneProps } from "../SceneHost";
import DinnerTable from "./oosterhout/DinnerTable";
import { FamilyPortrait } from "./oosterhout/FamilyPerson";
import { MinouPortrait } from "../MinouHero";

type Phase = "intro" | "ask" | "choose" | "wrong" | "right" | "serving" | "outro" | "finale";

const questions: readonly DinnerQuestion[] = quiz;
const SERVE_MS = 2000;
const SERVE_LAST_MS = 3200;
/** Korte succesanimatie na de afsluitende dialoog. */
const FINALE_MS = 2600;

/** Spelflow van het familiediner; de regels zitten in game/dinner.ts, de inhoud in content/oosterhout.ts. */
export default function OosterhoutScene({ onComplete }: SceneProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [dinner, setDinner] = useState(createDinnerState);
  const [burstKey, setBurstKey] = useState(0);

  // Na een goed antwoord is `dinner.current` al opgeschoven: het sprekende familielid is dan de vorige.
  const answered = phase === "right" || phase === "serving";
  const qi = answered ? dinner.current - 1 : dinner.current;
  const question = quiz[qi];
  const member = question ? familyMembers.find((m) => m.id === question.askedBy) : undefined;
  const memberLabel = member ? `${member.name} · ${member.role}` : "";
  // De gang verschijnt pas ná de reactie op het goede antwoord.
  const served = phase === "right" ? dinner.current - 1 : dinner.current;

  const memberMood: Mood =
    phase === "ask" ? "talking" : phase === "wrong" ? (question?.wrongMood ?? "shocked") : answered ? "happy" : "neutral";
  const minouMood: Mood = phase === "wrong" ? "shocked" : answered ? "happy" : "neutral";
  const showMember = !!member && !!question && (phase === "ask" || phase === "choose" || phase === "wrong" || answered);

  useEffect(() => {
    if (phase !== "serving") return;
    const done = isDinnerComplete(questions, dinner);
    const id = setTimeout(() => setPhase(done ? "outro" : "ask"), done ? SERVE_LAST_MS : SERVE_MS);
    return () => clearTimeout(id);
  }, [phase, dinner]);

  useEffect(() => {
    if (phase !== "finale") return;
    const id = setTimeout(onComplete, FINALE_MS);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  function onPick(index: number) {
    if (phase !== "choose") return;
    const result = answerQuestion(questions, dinner, index);
    if (result.outcome === "invalid") return;
    setDinner(result.state);
    if (result.outcome === "correct") {
      setBurstKey((k) => k + 1);
      setPhase("right");
    } else {
      setPhase("wrong");
    }
  }

  const portrait = (line: DialogueLine) =>
    line.speaker === "family" && member ? (
      <FamilyPortrait look={member.look} mood={memberMood} size={110} />
    ) : line.speaker === "minou" ? (
      <MinouPortrait mood="happy" size={110} />
    ) : undefined;
  // Na een goed antwoord: de volgende gang wordt opgediend (alleen weergave).
  const nextCourse = phase === "serving" && !isDinnerComplete(questions, dinner) ? quiz[dinner.current] : undefined;

  const speak = (text: string): DialogueLine[] => [
    { speaker: "family", name: memberLabel, memberId: member?.id, text },
  ];
  const dialogueKey = `${phase}-${dinner.current}-${dinner.wrongAttempts}`;

  return (
    <div className="oosterhout">
      <DinnerTable
        served={served}
        activeId={showMember ? member.id : null}
        activeMood={memberMood}
        minouMood={minouMood}
        burstKey={burstKey}
        minouCheer={phase === "finale"}
      />

      {nextCourse && (
        <p key={nextCourse.id} className="course-banner" aria-live="polite">
          {t.progress(dinner.current, questions.length, nextCourse.course)}
        </p>
      )}

      {phase !== "intro" && phase !== "outro" && phase !== "finale" && (
        <p className="dinner-progress">
          {t.progress(dinner.current, questions.length, quiz[Math.min(dinner.current, quiz.length - 1)].course)}
        </p>
      )}

      {phase === "intro" && (
        <DialogueBox key="intro" compact lines={t.intro} portrait={portrait} onComplete={() => setPhase("ask")} />
      )}

      {phase === "ask" && member && question && (
        <DialogueBox
          key={dialogueKey}
          compact
          lines={speak(question.text)}
          portrait={portrait}
          onComplete={() => setPhase("choose")}
        />
      )}

      {phase === "choose" && member && question && (
        <div className="answer-layer">
          <div className="answer-panel">
            <div className="dialogue-portrait" aria-hidden>
              <FamilyPortrait look={member.look} mood="neutral" size={110} />
            </div>
            <div className="answer-body">
              <p className="dialogue-name">{memberLabel}</p>
              <p className="answer-question">{question.text}</p>
              <p className="answer-label">{t.chooseLabel}</p>
              <div className="answer-options" role="group" aria-label={t.chooseLabel}>
                {question.answers.map((text, i) => (
                  <button key={text} className="answer-btn" onClick={() => onPick(i)}>
                    <span className="answer-letter">{t.answerLetters[i]}</span>
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "wrong" && member && question && (
        <DialogueBox
          key={dialogueKey}
          compact
          lines={speak(question.onWrong[(dinner.wrongAttempts - 1) % question.onWrong.length])}
          portrait={portrait}
          onComplete={() => setPhase("choose")}
        />
      )}

      {phase === "right" && member && question && (
        <DialogueBox
          key={dialogueKey}
          compact
          lines={speak(question.onCorrect)}
          portrait={portrait}
          onComplete={() => setPhase("serving")}
        />
      )}

      {phase === "outro" && (
        <DialogueBox
          key="outro"
          compact
          lines={t.outro}
          portrait={portrait}
          onComplete={() => {
            setBurstKey((k) => k + 1);
            setPhase("finale");
          }}
        />
      )}

      {phase === "finale" && <p className="bridge-banner">{t.finale}</p>}
    </div>
  );
}
