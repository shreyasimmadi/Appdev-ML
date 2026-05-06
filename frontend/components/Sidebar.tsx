"use client";
import * as React from "react";
import { ChatI, Library, Plus } from "./icons";
import { recentChats, courseNotes } from "./data";

export type View = "empty" | "chat" | "notes";

export function Sidebar({
  view, setView, activeId, setActiveId,
}: {
  view: View;
  setView: (v: View) => void;
  activeId: string;
  setActiveId: (id: string) => void;
}) {
  return (
    <aside className="nav">
      <div className="nav-brand">
        <div className="nav-mark">e</div>
        <div className="nav-brand-text">eckard<em>.ai</em></div>
      </div>

      <button className="nav-cta" onClick={() => setView("empty")}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <Plus size={14} /> New conversation
        </span>
        <kbd>⌘N</kbd>
      </button>

      <div className="nav-section">
        <div className="nav-section-label"><span>Workspace</span></div>
        <button
          className={`nav-item ${view === "notes" ? "active" : ""}`}
          onClick={() => setView("notes")}
        >
          <Library className="nav-item-icon" />
          <span className="nav-item-label">Course notes</span>
          <span className="nav-item-meta">{courseNotes.length}</span>
        </button>
      </div>

      <div className="nav-section" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="nav-section-label">
          <span>Recent</span>
          <button title="Clear">···</button>
        </div>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: 2 }}>
          {recentChats.map((c) => (
            <button
              key={c.id}
              className={`nav-item ${view === "chat" && activeId === c.id ? "active" : ""}`}
              onClick={() => { setActiveId(c.id); setView("chat"); }}
            >
              <ChatI className="nav-item-icon" />
              <span className="nav-item-label">{c.title}</span>
              <span className="nav-item-meta">{c.time}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="nav-foot">
        <div className="nav-avatar">A</div>
        <div className="nav-foot-text">
          Ajay
          <small>UMD · ENPM662</small>
        </div>
      </div>
    </aside>
  );
}
