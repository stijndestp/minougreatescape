import { describe, expect, it } from "vitest";
import { bridgeParts, bridgeShapes, bridgeSlots, trayLayout } from "@/content/moerdijk";
import {
  createBridgeState,
  isBridgeComplete,
  isPartPlaced,
  isSlotFilled,
  placePart,
  type BridgeState,
} from "./bridge";

const rules = { parts: bridgeParts, slots: bridgeSlots };
const decoys = bridgeParts.filter((p) => !p.correctSlot);
const correct = bridgeParts.filter((p) => p.correctSlot);

/** Platte (gesampelde) omtrek van een pad met absolute M L H V Q Z-commando's. */
function flatten(d: string): [number, number][] {
  const tokens = d.match(/[MLHVQZ]|-?\d+(?:\.\d+)?/g)!;
  const pts: [number, number][] = [];
  let i = 0;
  let cmd = "";
  let cx = 0;
  let cy = 0;
  const num = () => Number(tokens[i++]);
  while (i < tokens.length) {
    if (/[A-Z]/.test(tokens[i])) cmd = tokens[i++];
    if (cmd === "Z") continue;
    if (cmd === "M" || cmd === "L") {
      cx = num(); cy = num(); pts.push([cx, cy]);
    } else if (cmd === "H") {
      cx = num(); pts.push([cx, cy]);
    } else if (cmd === "V") {
      cy = num(); pts.push([cx, cy]);
    } else if (cmd === "Q") {
      const x1 = num(), y1 = num(), x = num(), y = num();
      for (let t = 1; t <= 8; t++) {
        const u = t / 8;
        pts.push([(1 - u) ** 2 * cx + 2 * (1 - u) * u * x1 + u * u * x, (1 - u) ** 2 * cy + 2 * (1 - u) * u * y1 + u * u * y]);
      }
      cx = x; cy = y;
    } else throw new Error(`Onbekend commando ${cmd}`);
  }
  return pts;
}

const key = (pts: [number, number][]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");


describe("puzzeldefinitie", () => {
  it("heeft vijf openingen en acht brugdelen (5 juist, 3 afleiders)", () => {
    expect(bridgeSlots).toHaveLength(5);
    expect(bridgeParts).toHaveLength(8);
    expect(correct).toHaveLength(5);
    expect(decoys).toHaveLength(3);
  });
  it("heeft unieke id's", () => {
    expect(new Set(bridgeParts.map((p) => p.id)).size).toBe(8);
    expect(new Set(bridgeSlots.map((s) => s.id)).size).toBe(5);
    expect(new Set(bridgeShapes.map((s) => s.id)).size).toBe(8);
  });
  it("koppelt elk juist onderdeel aan precies één opening, en omgekeerd", () => {
    for (const slot of bridgeSlots) {
      const part = bridgeParts.find((p) => p.id === slot.requires)!;
      expect(part.correctSlot).toBe(slot.id);
      expect(part.shapeId).toBe(slot.shapeId); // dezelfde vormdefinitie
    }
    expect(new Set(correct.map((p) => p.correctSlot)).size).toBe(5);
  });
  it("heeft acht plekken op de oever en elke opening/vorm bestaat", () => {
    expect(trayLayout.cells).toHaveLength(8);
    for (const p of bridgeParts) expect(bridgeShapes.some((s) => s.id === p.shapeId)).toBe(true);
  });
});

describe("vormen", () => {
  const flat = new Map(bridgeShapes.map((s) => [s.id, flatten(s.d)]));
  it("zijn allemaal onderling verschillend (geen enkel paar heeft dezelfde omtrek)", () => {
    const keys = bridgeShapes.map((s) => key(flat.get(s.id)!));
    expect(new Set(keys).size).toBe(bridgeShapes.length);
  });
  it("verschillen merkbaar: minstens 6% van de vlakken valt niet samen (rasterverschil)", () => {
    const inside = (pts: [number, number][], x: number, y: number) => {
      let c = false;
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
        const [xi, yi] = pts[i], [xj, yj] = pts[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    };
    const grid = (id: string) => {
      const pts = flat.get(id)!;
      const cells: boolean[] = [];
      for (let y = -60; y < 60; y += 2) for (let x = -60; x < 60; x += 2) cells.push(inside(pts, x + 1, y + 1));
      return cells;
    };
    const grids = new Map(bridgeShapes.map((s) => [s.id, grid(s.id)]));
    for (let i = 0; i < bridgeShapes.length; i++) {
      for (let j = i + 1; j < bridgeShapes.length; j++) {
        const a = grids.get(bridgeShapes[i].id)!, b = grids.get(bridgeShapes[j].id)!;
        let diff = 0, uni = 0;
        a.forEach((v, k) => {
          if (v || b[k]) uni++;
          if (v !== b[k]) diff++;
        });
        expect(diff / uni, `${bridgeShapes[i].id} vs ${bridgeShapes[j].id}`).toBeGreaterThanOrEqual(0.06);
      }
    }
  });  it("hebben een afleider-omtrek die op geen enkele opening past", () => {
    const slotKeys = bridgeSlots.map((s) => key(flat.get(s.shapeId)!));
    for (const d of decoys) expect(slotKeys).not.toContain(key(flat.get(d.shapeId)!));
  });
  it("blijven binnen hun vak en hebben de vaste scène-afmetingen", () => {
    for (const s of bridgeShapes) {
      for (const [x, y] of flat.get(s.id)!) {
        expect(Math.abs(x)).toBeLessThanOrEqual(60);
        expect(Math.abs(y)).toBeLessThanOrEqual(60);
      }
    }
    for (const s of bridgeSlots) {
      expect(s.x).toBeGreaterThan(0);
      expect(s.x).toBeLessThan(1600);
      expect(s.y).toBeGreaterThan(0);
      expect(s.y).toBeLessThan(900);
    }
  });
});

describe("plaatsen", () => {
  it("accepteert alleen de vijf juiste combinaties", () => {
    let placed = 0;
    for (const part of bridgeParts) {
      for (const slot of bridgeSlots) {
        const r = placePart(rules, createBridgeState(), part.id, slot.id);
        if (part.correctSlot === slot.id) {
          expect(r.outcome).toBe("placed");
          placed++;
        } else {
          expect(r.outcome).toBe("wrong");
        }
      }
    }
    expect(placed).toBe(5);
  });
  it("laat de drie afleiders in geen enkele opening passen", () => {
    for (const d of decoys) {
      for (const slot of bridgeSlots) {
        expect(placePart(rules, createBridgeState(), d.id, slot.id).outcome).toBe("wrong");
      }
    }
  });
  it("verandert niets bij een verkeerde plaatsing (zelfde state, onbeperkt opnieuw proberen)", () => {
    const s0 = createBridgeState();
    let s: BridgeState = s0;
    for (let i = 0; i < 20; i++) s = placePart(rules, s, "p-pyloon-scheef", "s-boog").state;
    expect(s).toBe(s0);
    expect(placePart(rules, s, "p-boog", "s-boog").outcome).toBe("placed");
  });
  it("zet een juist onderdeel vast en gebruikt het niet twee keer", () => {
    const s = placePart(rules, createBridgeState(), "p-boog", "s-boog").state;
    expect(isPartPlaced(s, "p-boog")).toBe(true);
    expect(isSlotFilled(s, "s-boog")).toBe(true);
    expect(placePart(rules, s, "p-boog", "s-boog").outcome).toBe("invalid");
    expect(placePart(rules, s, "p-boog", "s-dek").outcome).toBe("invalid");
    expect(placePart(rules, s, "p-dek", "s-boog").outcome).toBe("invalid");
  });
  it("negeert onbekende id's", () => {
    const s = createBridgeState();
    expect(placePart(rules, s, "bestaat-niet", "s-boog")).toEqual({ state: s, outcome: "invalid" });
    expect(placePart(rules, s, "p-boog", "bestaat-niet")).toEqual({ state: s, outcome: "invalid" });
  });
});

describe("voltooiing", () => {
  it("is niet voltooid zonder of met vier juiste plaatsingen", () => {
    let s = createBridgeState();
    expect(isBridgeComplete(rules, s)).toBe(false);
    for (const slot of bridgeSlots.slice(0, 4)) s = placePart(rules, s, slot.requires, slot.id).state;
    expect(isBridgeComplete(rules, s)).toBe(false);
  });
  it("kan niet voortijdig voltooid worden door verkeerde plaatsingen", () => {
    let s = createBridgeState();
    for (const d of decoys) for (const slot of bridgeSlots) s = placePart(rules, s, d.id, slot.id).state;
    expect(isBridgeComplete(rules, s)).toBe(false);
  });
  it("is voltooid bij vijf juiste plaatsingen, in willekeurige volgorde", () => {
    let s = createBridgeState();
    for (const slot of [...bridgeSlots].reverse()) s = placePart(rules, s, slot.requires, slot.id).state;
    expect(isBridgeComplete(rules, s)).toBe(true);
  });
});
