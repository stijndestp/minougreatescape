"use client";

import { useEffect, useRef, useState } from "react";
import type { DialogueLine, LineMood } from "@/content/dialogue";
import { borderRules, dordrechtTexts as t } from "@/content/dordrecht";
import { checkItem, offeredItems } from "@/game/border";
import { collectedItemIds } from "@/game/inventory";
import { useSave } from "@/game/save";
import { packingItems } from "@/content/tilburg";
import DialogueBox from "../DialogueBox";
import PietPortrait from "../PietSprite";
import type { SceneProps } from "../SceneHost";
import BorderPost from "./dordrecht/BorderPost";
import { itemArt } from "./tilburg/itemArt";

type Phase = "intro" | "choose" | "wrong" | "checking" | "approved" | "opening" | "walking";

/** Duur van de animaties (ongeveer 30 seconden spel, exclusief het lezen van dialogen). */
const CHECK_MS = 2600;
const OPEN_MS = 1600;
const WALK_MS = 3200;

/**
 * Korte grenscontrole. De regels zitten in game/border.ts, de inhoud in
 * content/dordrecht.ts; de inventaris komt uit de centrale spelstatus.
 */
export default function DordrechtScene({ onComplete }: SceneProps) {
  const save = useSave();
  const inventory = save ? collectedItemIds(save) : [];
  const items = offeredItems(borderRules, inventory);

  const [phase, setPhase] = useState<Phase>("intro");
  const [reaction, setReaction] = useState<{ text: string; key: number } | null>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const wrongCount = useRef(0);
  const doneRef = useRef(false);

  // Vaste tijden voor de animatiefases.
  useEffect(() => {
    const next: Partial<Record<Phase, [Phase | "done", number]>> = {
      checking: ["approved", CHECK_MS],
      opening: ["walking", OPEN_MS],
      walking: ["done", WALK_MS],
    };
    const step = next[phase];
    if (!step) return;
    const id = setTimeout(() => {
      if (step[0] === "done") {
        if (!doneRef.current) {
          doneRef.current = true;
          onComplete();
        }
      } else {
        setPhase(step[0]);
      }
    }, step[1]);
    return () => clearTimeout(id);
  }, [phase, onComplete]);

  function onPick(itemId: string) {
    if (phase !== "choose") return;
    const outcome = checkItem(borderRules, inventory, itemId);
    if (outcome === "unavailable") return;
    if (outcome === "accepted") {
      setPhase("checking");
      return;
    }
    // Verkeerd voorwerp: Piet schudt zijn hoofd en reageert, geen voortgang.
    const list = t.wrong[itemId] ?? t.genericWrong;
    const text = list[wrongCount.current % list.length];
    wrongCount.current += 1;
    setReaction({ text, key: wrongCount.current });
    setShakeKey((k) => k + 1);
    setPhase("wrong");
  }

  const pietMood: LineMood =
    phase === "wrong" ? "shocked" : phase === "approved" || phase === "opening" || phase === "walking" ? "happy" : phase === "checking" ? "neutral" : "stern";

  const portrait = (line: DialogueLine) =>
    line.speaker === "piet" ? <PietPortrait variant="douane" mood={line.mood ?? "stern"} size={110} /> : undefined;

  const labelOf = (id: string) => packingItems.find((i) => i.id === id)?.label ?? id;

  return (
    <div className="dordrecht">
      <BorderPost
        pietMood={pietMood}
        shakeKey={shakeKey}
        checking={phase === "checking" || phase === "approved"}
        stamped={phase === "approved" || phase === "opening" || phase === "walking"}
        barrierOpen={phase === "opening" || phase === "walking"}
        minou={phase === "walking" ? "walk" : "wait"}
        minouMood={phase === "wrong" ? "worried" : phase === "checking" ? "surprised" : phase === "approved" || phase === "opening" || phase === "walking" ? "happy" : "neutral"}
      />

      {phase === "intro" && (
        <DialogueBox key="intro" compact lines={t.intro} portrait={portrait} onComplete={() => setPhase("choose")} />
      )}

      {phase === "choose" && (
        <div className="answer-layer">
          <div className="answer-panel">
            <div className="dialogue-portrait" aria-hidden>
              <PietPortrait variant="douane" mood="stern" size={110} />
            </div>
            <div className="answer-body">
              <p className="dialogue-name">{t.choosePrompt}</p>
              <p className="answer-label">{t.chooseLabel}</p>
              <div className="item-grid" role="group" aria-label={t.chooseLabel}>
                {items.map((id) => {
                  const art = packingItems.find((i) => i.id === id)!.art;
                  const a = itemArt[art];
                  return (
                    <button key={id} className="item-card" onClick={() => onPick(id)}>
                      <svg viewBox={`${-a.w / 2 - 8} ${-a.h - 8} ${a.w + 16} ${a.h + 16}`} aria-hidden>
                        {a.render()}
                      </svg>
                      <span>{labelOf(id)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {phase === "wrong" && reaction && (
        <DialogueBox
          key={reaction.key}
          compact
          lines={[{ speaker: "piet", name: "Grenswacht-Piet", text: reaction.text, mood: "shocked" }]}
          portrait={portrait}
          onComplete={() => setPhase("choose")}
        />
      )}

      {phase === "approved" && (
        <DialogueBox key="approved" compact lines={t.approved} portrait={portrait} onComplete={() => setPhase("opening")} />
      )}
    </div>
  );
}
