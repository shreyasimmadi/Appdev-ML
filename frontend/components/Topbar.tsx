"use client";
import { Panel, Refresh, Cog, Moon, Sun } from "./icons";

export function Topbar({
  title, crumb, sourcesOpen, onToggleSources, showSourcesToggle = true,
  theme, onToggleTheme,
}: {
  title: string;
  crumb?: string;
  sourcesOpen?: boolean;
  onToggleSources?: () => void;
  showSourcesToggle?: boolean;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
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
        <button className="tbtn icon" title="Toggle dark mode" onClick={onToggleTheme}>
          {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
        </button>
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
