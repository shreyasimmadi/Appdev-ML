"use client";
import * as React from "react";

const FORMULAS: Record<string, React.ReactNode> = {
  endeffector: (
    <>
      <i>x</i> = <i>L</i><sub>1</sub>cos(<i>θ</i><sub>1</sub>) + <i>L</i><sub>2</sub>cos(<i>θ</i><sub>1</sub>+<i>θ</i><sub>2</sub>)
      <span style={{ display: "inline-block", width: 28 }} />
      <i>y</i> = <i>L</i><sub>1</sub>sin(<i>θ</i><sub>1</sub>) + <i>L</i><sub>2</sub>sin(<i>θ</i><sub>1</sub>+<i>θ</i><sub>2</sub>)
    </>
  ),
};

export function Formula({ tex, tag }: { tex: string; tag?: string }) {
  return (
    <div className="formula">
      {tag && <span className="formula-tag">{tag}</span>}
      {FORMULAS[tex] ?? tex}
    </div>
  );
}
