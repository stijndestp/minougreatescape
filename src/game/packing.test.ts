import { describe, expect, it } from "vitest";
import { packingItems } from "@/content/tilburg";
import { createPackingState, isPackingComplete, pickItem, requiredIds, type PackingState } from "./packing";

const items = packingItems;
const correct = requiredIds(items);
const wrong = items.filter((i) => !i.correct).map((i) => i.id);

function pickAll(ids: string[], start: PackingState = createPackingState()) {
  return ids.reduce((s, id) => pickItem(items, s, id).state, start);
}

describe("Tilburg-configuratie", () => {
  it("heeft precies de 7 gevraagde juiste voorwerpen", () => {
    expect(correct.sort()).toEqual(
      ["boek", "foto-job", "haarshampoo", "ov-kaart", "pepernoten", "sieraden", "studentenpas"].sort(),
    );
  });
  it("heeft de 7 gevraagde verkeerde voorwerpen", () => {
    expect(wrong.sort()).toEqual(
      ["airfryer", "baksteen", "fietspomp", "gourmetstel", "kaaswiel", "knuffel", "stoomboot"].sort(),
    );
  });
  it("plaatst elk voorwerp binnen de kamer (1600 × 900) met een layer en tekening", () => {
    for (const i of items) {
      expect(i.x).toBeGreaterThan(0);
      expect(i.x).toBeLessThan(1600);
      expect(i.y).toBeGreaterThan(0);
      expect(i.y).toBeLessThanOrEqual(900);
      expect(i.layer).toBeGreaterThan(0);
      expect(i.art).toBeTruthy();
      expect(i.place).toBeTruthy();
    }
  });
  it("geeft elk verkeerd voorwerp een grappige reactie", () => {
    for (const i of items.filter((x) => !x.correct)) expect(i.reactions?.length).toBeGreaterThan(0);
  });
  it("heeft unieke id's", () => {
    expect(new Set(items.map((i) => i.id)).size).toBe(items.length);
  });
});

describe("inpakken", () => {
  it("voegt een juist voorwerp toe", () => {
    const r = pickItem(items, createPackingState(), "boek");
    expect(r.outcome).toBe("collected");
    expect(r.state.collected).toEqual(["boek"]);
  });
  it("laat verkeerde voorwerpen niet meetellen", () => {
    for (const id of wrong) {
      const r = pickItem(items, createPackingState(), id);
      expect(r.outcome).toBe("wrong");
      expect(r.state.collected).toEqual([]);
    }
  });
  it("voegt een voorwerp niet twee keer toe", () => {
    const once = pickAll(["boek"]);
    const r = pickItem(items, once, "boek");
    expect(r.outcome).toBe("duplicate");
    expect(r.state.collected).toEqual(["boek"]);
  });
  it("negeert onbekende voorwerpen", () => {
    expect(pickItem(items, createPackingState(), "bestaat-niet").outcome).toBe("unknown");
  });
});

describe("voltooiing", () => {
  it("is niet klaar zonder voorwerpen", () => {
    expect(isPackingComplete(items, createPackingState())).toBe(false);
  });
  it("is niet klaar met 6 van 7", () => {
    expect(isPackingComplete(items, pickAll(correct.slice(0, 6)))).toBe(false);
  });
  it("telt verkeerde voorwerpen niet mee, ook niet bij 7 keuzes", () => {
    const s = pickAll([...correct.slice(0, 3), ...wrong]);
    expect(s.collected).toHaveLength(3);
    expect(isPackingComplete(items, s)).toBe(false);
  });
  it("is klaar zodra de juiste zeven er zijn", () => {
    expect(isPackingComplete(items, pickAll([...wrong, ...correct, ...correct]))).toBe(true);
  });
  it("controleert de juiste voorwerpen, niet alleen het aantal", () => {
    // Een handmatig gemanipuleerde staat met 7 verkeerde id's mag nooit slagen.
    expect(isPackingComplete(items, { collected: wrong })).toBe(false);
    expect(isPackingComplete(items, { collected: [...correct.slice(0, 6), "baksteen"] })).toBe(false);
  });
});
