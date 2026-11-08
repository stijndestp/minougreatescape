import { describe, expect, it } from "vitest";
import {
  LOCATION_ORDER,
  arriveAt,
  canEnter,
  canTravelTo,
  completeLocation,
  createInitialState,
  getNextId,
  getPendingCelebrations,
  getStatus,
  leidenCrossState,
  markCelebrated,
  normalizeState,
} from "./progress";

const [TILBURG, OOSTERHOUT, MOERDIJK, DORDRECHT, ROTTERDAM, DELFT] = LOCATION_ORDER;

describe("route", () => {
  it("is strikt lineair", () => {
    expect(LOCATION_ORDER).toEqual(["tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam", "delft"]);
  });
});

describe("nieuw spel", () => {
  const s = createInitialState();
  it("begint met Minou in Tilburg", () => expect(s.minouAt).toBe(TILBURG));
  it("heeft Tilburg als enige beschikbare locatie", () => {
    expect(getStatus(s, TILBURG)).toBe("available");
    for (const id of [OOSTERHOUT, MOERDIJK, DORDRECHT, ROTTERDAM, DELFT]) {
      expect(getStatus(s, id)).toBe("locked");
    }
  });
  it("laat Tilburg direct betreden, de rest niet", () => {
    expect(canEnter(s, TILBURG)).toBe(true);
    for (const id of [OOSTERHOUT, MOERDIJK, DORDRECHT, ROTTERDAM, DELFT]) {
      expect(canEnter(s, id)).toBe(false);
      expect(canTravelTo(s, id)).toBe(false);
    }
  });
});

describe("vergrendeling", () => {
  const s = createInitialState();
  it("laat de staat ongemoeid bij reizen/afronden van vergrendelde locaties", () => {
    for (const id of [OOSTERHOUT, MOERDIJK, DORDRECHT, ROTTERDAM, DELFT]) {
      expect(arriveAt(s, id)).toBe(s);
      expect(completeLocation(s, id)).toBe(s);
    }
  });
  it("kan niet voortijdig afronden zonder dat Minou er is", () => {
    const done = completeLocation(s, TILBURG);
    expect(done.completed).toEqual([TILBURG]);
    // Oosterhout is nu aan de beurt maar Minou staat nog in Tilburg:
    expect(canEnter(done, OOSTERHOUT)).toBe(false);
    expect(completeLocation(done, OOSTERHOUT)).toBe(done);
  });
  it("kan een locatie niet twee keer afronden", () => {
    const done = completeLocation(s, TILBURG);
    expect(completeLocation(done, TILBURG)).toBe(done);
  });
  it("kan geen locaties overslaan", () => {
    const done = completeLocation(s, TILBURG);
    expect(canTravelTo(done, MOERDIJK)).toBe(false);
    expect(arriveAt(done, MOERDIJK)).toBe(done);
  });
});

describe("na Tilburg", () => {
  const done = completeLocation(createInitialState(), TILBURG);
  it("markeert Tilburg voltooid en ontgrendelt Oosterhout", () => {
    expect(getStatus(done, TILBURG)).toBe("completed");
    expect(getStatus(done, OOSTERHOUT)).toBe("available");
    expect(getNextId(done)).toBe(OOSTERHOUT);
  });
  it("laat Minou in Tilburg staan tot ze reist", () => {
    expect(done.minouAt).toBe(TILBURG);
    expect(canTravelTo(done, OOSTERHOUT)).toBe(true);
  });
  it("verplaatst Minou pas bij aankomst", () => {
    const arrived = arriveAt(done, OOSTERHOUT);
    expect(arrived.minouAt).toBe(OOSTERHOUT);
    expect(canEnter(arrived, OOSTERHOUT)).toBe(true);
    expect(arrived.completed).toEqual([TILBURG]);
  });
  it("toont de active-status tijdens een reis", () => {
    expect(getStatus(done, OOSTERHOUT, OOSTERHOUT)).toBe("active");
  });
  it("heeft viering-animaties in afwachting", () => {
    expect(getPendingCelebrations(done)).toEqual({ doneId: TILBURG, unlockId: OOSTERHOUT });
    const seen = markCelebrated(done, `done:${TILBURG}`, `unlock:${OOSTERHOUT}`);
    expect(getPendingCelebrations(seen)).toEqual({ doneId: null, unlockId: null });
  });
});

describe("normalizeState (verversen / beschadigde opslag)", () => {
  it("weigert onzin", () => {
    expect(normalizeState(null)).toBeNull();
    expect(normalizeState("x")).toBeNull();
    expect(normalizeState({ version: 99, completed: [] })).toBeNull();
    expect(normalizeState({ version: 2 })).toBeNull();
  });
  it("migreert v1", () => {
    const s = normalizeState({ version: 1, completed: ["tilburg"] });
    expect(s?.completed).toEqual(["tilburg"]);
    expect(s?.minouAt).toBe("tilburg");
  });
  it("repareert overgeslagen locaties", () => {
    const s = normalizeState({ version: 2, completed: ["moerdijk"], minouAt: "moerdijk", celebrated: [] });
    expect(s?.completed).toEqual([]);
    expect(s?.minouAt).toBe(TILBURG);
  });
  it("repareert een onmogelijke Minou-positie", () => {
    const s = normalizeState({ version: 2, completed: ["tilburg"], minouAt: "delft", celebrated: [] });
    expect(s?.minouAt).toBe(TILBURG);
  });
  it("accepteert Minou op de volgende locatie (na een reis)", () => {
    const s = normalizeState({ version: 2, completed: ["tilburg"], minouAt: "oosterhout", celebrated: [] });
    expect(s?.minouAt).toBe(OOSTERHOUT);
  });
  it("laat een geldige staat ongewijzigd", () => {
    const s = completeLocation(createInitialState(), TILBURG);
    expect(normalizeState(JSON.parse(JSON.stringify(s)))).toEqual(s);
  });
});

describe("Leiden doorgestreept", () => {
  const route = (...ids: string[]) => {
    let s = createInitialState();
    for (const id of ids) s = completeLocation(arriveAt(s, id), id);
    return s;
  };
  it("is niet doorgestreept voor Rotterdam voltooid is", () => {
    expect(leidenCrossState(createInitialState())).toBe("hidden");
    expect(leidenCrossState(route("tilburg", "oosterhout", "moerdijk", "dordrecht"))).toBe("hidden");
    expect(leidenCrossState(arriveAt(route("tilburg", "oosterhout", "moerdijk", "dordrecht"), "rotterdam"))).toBe("hidden");
  });
  it("is na Rotterdam doorgestreept, eerst met animatie en daarna (ook na verversen) vast", () => {
    const s = route("tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam");
    expect(leidenCrossState(s)).toBe("animate");
    const seen = markCelebrated(s, "cross:leiden");
    expect(leidenCrossState(seen)).toBe("static");
    expect(leidenCrossState(normalizeState(JSON.parse(JSON.stringify(seen)))!)).toBe("static");
  });
  it("Delft blijft bereikbaar en de uitkomst is voor beide Rotterdam-keuzes gelijk (er is één voortgangsstatus)", () => {
    const s = route("tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam");
    expect(canTravelTo(s, "delft")).toBe(true);
    expect(s.completed).toEqual(["tilburg", "oosterhout", "moerdijk", "dordrecht", "rotterdam"]);
  });
});