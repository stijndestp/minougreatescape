import { describe, expect, it } from "vitest";
import { ASPECT, buildPath, cameraAround, distanceAt, makeProfile, pointAt, zoomCamera } from "./motion";

describe("pad", () => {
  const path = buildPath([
    { x: 0, y: 0 },
    { x: 100, y: 0 },
    { x: 100, y: 50 },
  ]);
  it("berekent de lengte", () => expect(path.length).toBe(150));
  it("loopt echt langs het pad (geen sprong)", () => {
    expect(pointAt(path, 0)).toMatchObject({ x: 0, y: 0 });
    expect(pointAt(path, 50)).toMatchObject({ x: 50, y: 0 });
    expect(pointAt(path, 100)).toMatchObject({ x: 100, y: 0 });
    expect(pointAt(path, 125)).toMatchObject({ x: 100, y: 25 });
    expect(pointAt(path, 150)).toMatchObject({ x: 100, y: 50 });
  });
  it("klemt buiten het bereik", () => {
    expect(pointAt(path, -5)).toMatchObject({ x: 0, y: 0 });
    expect(pointAt(path, 999)).toMatchObject({ x: 100, y: 50 });
  });
});

describe("snelheidsprofiel", () => {
  const length = 200;
  const p = makeProfile(length, 100, 0.5);
  it("start op 0 en eindigt precies op de lengte", () => {
    expect(distanceAt(p, 0, length)).toBe(0);
    expect(distanceAt(p, p.duration, length)).toBeCloseTo(length);
  });
  it("is monotoon stijgend", () => {
    let prev = -1;
    for (let t = 0; t <= p.duration; t += 0.01) {
      const d = distanceAt(p, t, length);
      expect(d).toBeGreaterThanOrEqual(prev);
      prev = d;
    }
  });
  it("heeft in het midden constante snelheid", () => {
    const a = distanceAt(p, 0.8, length);
    const b = distanceAt(p, 0.9, length);
    expect(b - a).toBeCloseTo(100 * 0.1, 5);
  });
  it("werkt voor zeer korte paden", () => {
    const short = makeProfile(10, 100, 0.5);
    expect(distanceAt(short, short.duration, 10)).toBeCloseTo(10);
  });
});

describe("camera", () => {
  it("houdt 16:9", () => {
    const c = cameraAround({ x: 500, y: 400 }, 640);
    expect(c.height).toBeCloseTo(640 * ASPECT);
    expect(c.x + c.width / 2).toBeCloseTo(500);
    expect(c.y + c.height / 2).toBeCloseTo(400);
  });
  it("zoomt van begin- naar eindcamera", () => {
    const a = { x: 0, y: 0, width: 1600, height: 900 };
    const b = cameraAround({ x: 300, y: 300 }, 640);
    expect(zoomCamera(a, b, 0).width).toBeCloseTo(1600);
    expect(zoomCamera(a, b, 1).width).toBeCloseTo(640);
    expect(zoomCamera(a, b, 1).x).toBeCloseTo(b.x);
  });
});
