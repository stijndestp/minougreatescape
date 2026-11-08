import type { ReactNode } from "react";

/** Vaste 16:9-speelvlakte, schaalt mee met het scherm (ontworpen voor tv). */
export default function GameStage({ children }: { children: ReactNode }) {
  return (
    <div className="stage-outer">
      <div className="stage">{children}</div>
    </div>
  );
}
