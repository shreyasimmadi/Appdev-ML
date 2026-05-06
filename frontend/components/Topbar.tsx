"use client";
import * as React from "react";
import { Panel, Refresh, Cog } from "./icons";

export function Topbar({
  title, crumb, sourcesOpen, onToggleSources, showSourcesToggle = true,
}: {
  title: string;
  crumb?: string;
  sourcesOpen?: boolean;
  onToggleSources?: () => void;
  showSourcesToggle?: boolean;
}) {
  return (
    <div className="topbar">
      <div className="topbar-title">
        <h2>{title}</h2>
        {crumb && <span className="crumb">{crumb}</span>}
      </div>
      <div className="topbar-tools">
        <button className="tbtn"><Refresh size={14} /> Reset</button>
        <button className="tbtn icon" title="Settings"><Cog size={15} /></button>
        {showSourcesToggle && (
          <button
            className={`tbtn ${sourcesOpen ? "active" : ""}`}
            onClick={onToggleSources}
          >
            <Panel size={14} />
            Sources
          </button>
        )}
      </div>
    </div>
  );
}
