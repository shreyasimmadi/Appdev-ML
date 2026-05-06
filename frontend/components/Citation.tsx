"use client";
import * as React from "react";

export function Citation({ n, onClick }: { n: number; onClick?: () => void }) {
  return (
    <button className="cite" onClick={onClick} title={`Source ${n}`}>
      <span className="cite-dot" /> {n}
    </button>
  );
}
