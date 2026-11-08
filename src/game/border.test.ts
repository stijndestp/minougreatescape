import { describe, expect, it } from "vitest";
import { borderRules } from "@/content/dordrecht";
import { packingItems } from "@/content/tilburg";
import { checkItem, offeredItems } from "./border";
import { collectedItemIds, hasItem } from "./inventory";
import { canEnter, canTravelTo, completeLocation, createInitialState, arriveAt, getStatus, type GameState } from "./progress";

/** Speel de route tot en met `last` en laat Minou er staan. */
function stateAfter(...ids: string[]): GameState {
  let s = createInitialState();
  for (const id of ids) {
    s = arriveAt(s, id);
    s = completeLocation(s, id);
  }
  return s;
}
const tilburg = createInitialState();
const afterMoerdijk = stateAfter("tilburg", "oosterhout", "moerdijk");

describe("inventaris", () => {
  it("is leeg zolang Tilburg niet voltooid is", () => {
    expect(collectedItemIds(tilburg)).toEqual([]);
  });

  it("bevat na Tilburg precies de zeven juiste voorwerpen, inclusief de studentenpas", () => {
    const inv = collectedItemIds(afterMoerdijk);
    expect(inv).toHaveLength(7);
    expect(inv).toEqual(packingItems.filter((i) => i.correct).map((i) => i.id));
    expect(hasItem(afterMoerdijk, "studentenpas")).toBe(true);
    expect(hasItem(afterMoerdijk, "baksteen")).toBe(false);
  });
});

describe("grenscontrole Dordrecht", () => {
  const inv = collectedItemIds(afterMoerdijk);

  it("het toegangsbewijs is een voorwerp dat echt in de inventaris zit", () => {
    expect(inv).toContain(borderRules.requiredItemId);
    expect(offeredItems(borderRules, inv)).toContain(borderRules.requiredItemId);
  });

  it("alle getoonde voorwerpen komen uit de inventaris", () => {
    for (const id of offeredItems(borderRules, inv)) expect(inv).toContain(id);
    expect(offeredItems(borderRules, inv).length).toBeGreaterThan(2);
  });

  it("de studentenpas wordt geaccepteerd", () => {
    expect(checkItem(borderRules, inv, "studentenpas")).toBe("accepted");
  });

  it("elk ander voorwerp wordt afgewezen, onbeperkt vaak", () => {
    for (const id of offeredItems(borderRules, inv).filter((x) => x !== "studentenpas")) {
      for (let i = 0; i < 5; i++) expect(checkItem(borderRules, inv, id)).toBe("rejected");
    }
  });

  it("een voorwerp dat Minou niet heeft, kan niet worden getoond", () => {
    expect(checkItem(borderRules, inv, "baksteen")).toBe("unavailable");
    expect(checkItem(borderRules, [], "studentenpas")).toBe("unavailable");
  });
});

describe("vergrendeling rond Dordrecht", () => {
  it("Dordrecht is alleen bereikbaar na Moerdijk", () => {
    expect(canTravelTo(tilburg, "dordrecht")).toBe(false);
    expect(canTravelTo(stateAfter("tilburg"), "dordrecht")).toBe(false);
    expect(canTravelTo(stateAfter("tilburg", "oosterhout"), "dordrecht")).toBe(false);
    expect(canTravelTo(afterMoerdijk, "dordrecht")).toBe(true);
    expect(getStatus(afterMoerdijk, "dordrecht")).toBe("available");
  });

  it("de grenscontrole kan niet worden gestart zonder aankomst en niet worden voltooid zonder Moerdijk", () => {
    expect(canEnter(afterMoerdijk, "dordrecht")).toBe(false); // Minou staat nog in Moerdijk
    const before = stateAfter("tilburg", "oosterhout");
    expect(completeLocation(before, "dordrecht")).toBe(before);
  });

  it("de grenscontrole ontgrendelt Rotterdam en niets verder", () => {
    const inDordrecht = arriveAt(afterMoerdijk, "dordrecht");
    expect(canEnter(inDordrecht, "dordrecht")).toBe(true);
    const done = completeLocation(inDordrecht, "dordrecht");
    expect(done.completed).toEqual(["tilburg", "oosterhout", "moerdijk", "dordrecht"]);
    expect(canTravelTo(done, "rotterdam")).toBe(true);
    expect(canTravelTo(done, "delft")).toBe(false);
  });
});
