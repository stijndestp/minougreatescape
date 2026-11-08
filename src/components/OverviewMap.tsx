"use client";

import { useImperativeHandle, useRef, type Ref } from "react";
import { overviewPaths, overviewSize, overviewViewport, toOverview } from "@/map/mapData";
import { DEFAULT_CAMERA, type Camera, type Point } from "@/map/projection";

export interface OverviewHandle {
  setCamera(camera: Camera): void;
  setMinou(point: Point): void;
}

/** Kleine overzichtskaart van Nederland: speelgebied (kader) en Minou (stip). */
export default function OverviewMap({ ref, minouAt }: { ref?: Ref<OverviewHandle>; minouAt: Point }) {
  const frameRef = useRef<SVGRectElement>(null);
  const dotRef = useRef<SVGGElement>(null);
  const vp = overviewViewport(DEFAULT_CAMERA);
  const dot = toOverview(minouAt);

  useImperativeHandle(ref, () => ({
    setCamera(camera) {
      const r = overviewViewport(camera);
      const f = frameRef.current;
      if (!f) return;
      f.setAttribute("x", String(r.x));
      f.setAttribute("y", String(r.y));
      f.setAttribute("width", String(r.width));
      f.setAttribute("height", String(r.height));
    },
    setMinou(point) {
      const p = toOverview(point);
      dotRef.current?.setAttribute("transform", `translate(${p.x.toFixed(2)} ${p.y.toFixed(2)})`);
    },
  }));

  return (
    <div className="overview" aria-label="Overzichtskaart Nederland">
      <svg viewBox={`0 0 ${overviewSize.width} ${overviewSize.height}`} role="img" aria-label="Nederland met huidig speelgebied en Minou">
        <rect width={overviewSize.width} height={overviewSize.height} fill="#5cc4ee" />
        {overviewPaths.map((p) => (
          <path
            key={p.name}
            d={p.d}
            fill={p.name === "Zuid-Holland" || p.name === "Noord-Brabant" ? "#ffd45e" : "#b8e6a0"}
            stroke="#fff"
            strokeWidth={0.8}
            strokeLinejoin="round"
          />
        ))}
        <rect
          ref={frameRef}
          className="overview-frame"
          x={vp.x}
          y={vp.y}
          width={vp.width}
          height={vp.height}
          fill="rgba(255,61,104,.18)"
          stroke="#ff3d68"
          strokeWidth={2.2}
          rx={3}
        />
        <g ref={dotRef} transform={`translate(${dot.x} ${dot.y})`}>
          <circle className="overview-dot" r={5.5} fill="#ff3d68" stroke="#fff" strokeWidth={2} />
        </g>
      </svg>
      <span className="overview-label">Nederland</span>
    </div>
  );
}
