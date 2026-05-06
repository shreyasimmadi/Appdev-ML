"use client";
import * as React from "react";
import type { Source } from "../lib/types";
import { File, X } from "./icons";

export function SourcesPanel({
  sources, open, onClose,
}: {
  sources: Source[];
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] = React.useState<"retrieved" | "pinned" | "all">("retrieved");
  const [active, setActive] = React.useState<number | null>(1);

  return (
    <aside className={`sources ${open ? "" : "collapsed"}`} aria-hidden={!open}>
      <div className="sources-head">
        <h3>
          Sources
          <span className="count">{sources.length} retrieved</span>
        </h3>
        <button className="tbtn icon" onClick={onClose} title="Close panel">
          <X size={14} />
        </button>
      </div>

      <div className="sources-tabs">
        <button className={`sources-tab ${tab === "retrieved" ? "active" : ""}`} onClick={() => setTab("retrieved")}>Retrieved</button>
        <button className={`sources-tab ${tab === "pinned" ? "active" : ""}`} onClick={() => setTab("pinned")}>Pinned</button>
        <button className={`sources-tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All notes</button>
      </div>

      <div className="sources-list">
        {sources.map((s) => (
          <div
            key={s.id}
            className={`source-card ${active === s.id ? "active" : ""}`}
            onClick={() => setActive(s.id)}
          >
            <div className="source-card-head">
              <div className="source-card-num">{s.id}</div>
              <div className="source-card-title">{s.title}</div>
              <div className="source-card-score">{s.score.toFixed(2)}</div>
            </div>
            <div className="source-card-path">
              <File size={10} style={{ marginRight: 4, verticalAlign: -1 }} />
              {s.path}{s.pageRange ? ` · ${s.pageRange}` : ""}
            </div>
            <div className="source-card-snippet" dangerouslySetInnerHTML={{ __html: s.snippet }} />
            <div className="source-card-foot">
              <span>chunk #{s.chunk}</span>
              {s.tokens && <span>{s.tokens} tok</span>}
              <span style={{ marginLeft: "auto" }}>open ↗</span>
            </div>
          </div>
        ))}
      </div>

      <div className="retrieval-bar">
        <span>hybrid · top-k=4</span>
        <span>cosine + bm25</span>
      </div>
    </aside>
  );
}
