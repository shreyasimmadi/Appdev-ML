"use client";
import { ChatI, Library, Plus, X } from "./icons";

export type View = "empty" | "chat" | "notes";

export interface ChatSummary {
  id: string;
  title: string;
  updatedAt: number;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d}d`;
  return `${Math.floor(d / 7)}w`;
}

export function Sidebar({
  view, setView, activeId,
  chats, onNewChat, onSelectChat, onDeleteChat,
}: {
  view: View;
  setView: (v: View) => void;
  activeId: string;
  chats: ChatSummary[];
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}) {
  return (
    <aside className="nav">
      <div className="nav-brand">
        <div className="nav-mark">e</div>
        <div className="nav-brand-text">eckard<em>.ai</em></div>
      </div>

      <button className="nav-cta" onClick={onNewChat}>
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
        </button>
      </div>

      <div className="nav-section" style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div className="nav-section-label">
          <span>Recent</span>
        </div>
        <div style={{ overflowY: "auto", flex: 1, paddingRight: 2 }}>
          {chats.length === 0 && (
            <div style={{ padding: "6px 10px", fontSize: 13, color: "var(--ink-4)" }}>
              No conversations yet
            </div>
          )}
          {chats.map((c) => (
            <div
              key={c.id}
              className={`nav-item ${view === "chat" && activeId === c.id ? "active" : ""}`}
              style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
              onClick={() => onSelectChat(c.id)}
            >
              <ChatI className="nav-item-icon" style={{ flex: "none" }} />
              <span className="nav-item-label" style={{ flex: 1 }}>{c.title}</span>
              <span className="nav-item-meta">{timeAgo(c.updatedAt)}</span>
              <button
                style={{ background: "none", border: "none", padding: "2px 2px", borderRadius: 4, color: "var(--ink-4)", opacity: 0, cursor: "pointer" }}
                className="chat-delete-btn"
                onClick={(e) => { e.stopPropagation(); onDeleteChat(c.id); }}
                title="Delete"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="nav-foot">
        <div className="nav-avatar">A</div>
        <div className="nav-foot-text">
          Ajay
          <small>UMD</small>
        </div>
      </div>
    </aside>
  );
}
