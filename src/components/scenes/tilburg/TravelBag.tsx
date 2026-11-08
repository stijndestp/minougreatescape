import type { Ref } from "react";
import { packingItems, tilburgTexts as t } from "@/content/tilburg";
import { requiredIds } from "@/game/packing";
import { itemArt } from "./itemArt";

const SLOT_IDS = requiredIds(packingItems);
export const BAG_TOTAL = SLOT_IDS.length;

/** Open reistas rechtsonder met 7 plekken, teller en sluit-animatie. */
export default function TravelBag({ collected, closed, bagRef }: { collected: readonly string[]; closed: boolean; bagRef: Ref<HTMLDivElement> }) {
  return (
    <div ref={bagRef} className={closed ? "bag bag-closed" : "bag"} aria-label={t.bagTitle}>
      <div className="bag-lid-back" aria-hidden />
      <div className="bag-body">
        <div className="bag-title">{t.bagTitle}</div>
        <div className="bag-items">
          {SLOT_IDS.map((id) => {
            const inBag = collected.includes(id);
            return (
              <span key={id} className={inBag ? "bag-slot filled" : "bag-slot"} aria-hidden={!inBag}>
                {inBag && (
                  <svg viewBox="-60 -96 120 106">
                    {itemArt[packingItems.find((i) => i.id === id)!.art].render()}
                  </svg>
                )}
              </span>
            );
          })}
        </div>
        <div className="bag-lid" aria-hidden />
        {closed && <div className="bag-success">{t.bagClosed}</div>}
      </div>
      <div className="bag-count" aria-live="polite">
        {t.bagCount(collected.length, BAG_TOTAL)}
      </div>
    </div>
  );
}
