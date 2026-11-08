"use client";

import { clues, destinations, texts as t } from "@/content/rotterdam";
import type { DestinationId, TrainDef } from "@/game/rotterdam";
import SinterklaasSprite from "@/components/SinterklaasSprite";

/** Wisselende meldingen onderaan het bord (pure CSS, geen state). */
function Ticker() {
  return (
    <div className="board-ticker" aria-hidden>
      {t.boardMessages.map((m, i) => (
        <span key={m} style={{ animationDelay: `${i * 4}s` }}>
          {m}
        </span>
      ))}
    </div>
  );
}

interface TrainBoardProps {
  trains: readonly TrainDef[];
  selectedId: string | null;
  /** Aan: klikken en instappen werkt. Uit tijdens een reactie. */
  active: boolean;
  /** Trein die net verkeerd gekozen is: de rij schudt rood. */
  wrongId?: string | null;
  onSelect: (id: string) => void;
  onBoard: (id: string) => void;
}

/**
 * Interactief vertrekbord: tijd, perron, type en richting. De tussenstops staan
 * er bewust niet direct op; die zie je pas als je een trein aanklikt.
 */
export function TrainBoard({ trains, selectedId, active, wrongId = null, onSelect, onBoard }: TrainBoardProps) {
  const sel = trains.find((x) => x.id === selectedId) ?? null;
  return (
    <div className="board-panel" role="group" aria-label={t.boardTitle}>
      <div className="board-head">
        <span>{t.boardTitle.toUpperCase()}</span>
        <span className="board-station">{t.stationName}</span>
      </div>
      <div className="board-cols" aria-hidden>
        <span>{t.boardColumns.time}</span>
        <span>{t.boardColumns.platform}</span>
        <span>{t.boardColumns.kind}</span>
        <span>{t.boardColumns.to}</span>
      </div>
      {trains.map((tr) => (
        <button
          key={tr.id}
          className={["board-row", tr.id === selectedId ? "is-selected" : "", tr.id === wrongId ? "is-wrong" : ""].join(" ")}
          aria-pressed={tr.id === selectedId}
          disabled={!active}
          onClick={() => onSelect(tr.id)}
        >
          <span>{tr.time}</span>
          <span className="board-platform">{tr.platform}</span>
          <span>{t.kindLabel[tr.kind]}</span>
          <span>{tr.destination}</span>
        </button>
      ))}
      <div className="board-detail">
        {sel ? (
          <>
            <p className="board-detail-title">
              {`${t.kindLabel[sel.kind]} · ${t.boardColumns.platform} ${sel.platform} → ${sel.destination}`}
            </p>
            <p>
              <b>{t.detailStops}</b> {sel.stops.join(" · ")}
            </p>
            <p>
              <b>{t.detailEnd}</b> {sel.terminus}
            </p>
            <button className="btn btn-primary board-go" disabled={!active} onClick={() => onBoard(sel.id)}>
              {t.boardAction(sel.platform)}
            </button>
          </>
        ) : (
          <p className="board-hint">{t.boardHint}</p>
        )}
      </div>
      <Ticker />
    </div>
  );
}

/** Aantekenboekje met de aanwijzingen van Sinterklaas (alleen wat al verteld is). */
export function ClueNotes({ revealed }: { revealed: number }) {
  return (
    <div className="notes-panel">
      <div className="notes-head">
        <SinterklaasSprite size={64} />
        <p>{t.notesTitle}</p>
      </div>
      <ol>
        {clues.map((c, i) => (
          <li key={c.id} className={i < revealed ? "note-on" : "note-off"}>
            {i < revealed ? c.note : "…"}
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Tweede bord: Leiden of Delft? */
export function DestinationBoard({ onPick }: { onPick: (id: DestinationId) => void }) {
  return (
    <div className="board-panel board-dest" role="group" aria-label={t.choiceTitle}>
      <div className="board-head">
        <span>{t.choiceTitle.toUpperCase()}</span>
        <span className="board-station">{t.choiceHint}</span>
      </div>
      {destinations.map((d) => (
        <button key={d.id} className="board-row board-dest-row" onClick={() => onPick(d.id)}>
          <span className="board-platform">{d.letter}</span>
          <span className="board-dest-name">{d.name}</span>
          <span className="board-dest-sub">{d.subtitle}</span>
        </button>
      ))}
      <Ticker />
    </div>
  );
}
