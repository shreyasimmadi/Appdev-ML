"use client";
import * as React from "react";
import { Copy } from "./icons";

export function CodeBlock({ language, lines }: { language: string; lines: string[] }) {
  return (
    <div className="code">
      <div className="code-head">
        <span>{language}</span>
        <button className="act" style={{ color: "inherit" }}><Copy size={12} /> copy</button>
      </div>
      <pre style={{ margin: 0 }}>
        {lines.map((line, i) => (
          <div key={i} dangerouslySetInnerHTML={{ __html: line }} />
        ))}
      </pre>
    </div>
  );
}
