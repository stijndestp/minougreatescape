"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { texts } from "@/content/texts";
import { startNewGame, useSave } from "@/game/save";
import GameStage from "./GameStage";
import MinouPlaceholder from "./MinouPlaceholder";

export default function StartMenu() {
  const router = useRouter();
  const save = useSave();
  const [confirming, setConfirming] = useState(false);
  const hasSave = !!save;

  function newGame() {
    startNewGame();
    router.push("/kaart");
  }

  return (
    <GameStage>
      <div className="start-screen">
        <span className="deco deco-1" aria-hidden>★</span>
        <span className="deco deco-2" aria-hidden>♥</span>
        <span className="deco deco-3" aria-hidden>★</span>
        <span className="deco deco-4" aria-hidden>♥</span>

        <MinouPlaceholder size={170} />
        <h1 className="title">{texts.gameTitle}</h1>
        <p className="tagline">{texts.tagline}</p>

        <div className="menu">
          <button
            className="btn btn-primary"
            onClick={() => (hasSave ? setConfirming(true) : newGame())}
          >
            {texts.menu.newGame}
          </button>
          <button
            className="btn btn-secondary"
            disabled={!hasSave}
            onClick={() => router.push("/kaart")}
          >
            {texts.menu.continueGame}
          </button>
          {!hasSave && save !== undefined && (
            <p className="menu-note">{texts.menu.noSave}</p>
          )}
        </div>

        {confirming && (
          <div className="overlay" role="dialog" aria-modal="true">
            <div className="dialog">
              <h2>{texts.menu.confirmNewTitle}</h2>
              <p>{texts.menu.confirmNewText}</p>
              <div className="dialog-actions">
                <button className="btn btn-primary" onClick={newGame}>
                  {texts.menu.confirmNewYes}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setConfirming(false)}
                >
                  {texts.menu.confirmNewNo}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </GameStage>
  );
}
