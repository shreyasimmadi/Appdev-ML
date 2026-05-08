"use client";
import * as React from "react";
import { File, ChevR } from "./icons";

interface Subtopic {
  name: string;
  chunks: number;
  snippet: string;
}

interface Topic {
  id: string;
  name: string;
  totalChunks: number;
  subtopics: Subtopic[];
}

export function CourseNotes({ onPickTopic }: { onPickTopic?: (topic: string) => void }) {
  const [topics, setTopics] = React.useState<Topic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => {
        setTopics(data.topics ?? []);
        if (data.topics?.length > 0) {
          setExpanded(new Set([data.topics[0].id]));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="checklist">
      <div className="checklist-inner">
        <div className="checklist-head">
          <h1>Course notes <em>— indexed</em></h1>
          <p>
            {loading
              ? "Loading from Supabase…"
              : topics.length === 0
              ? "No documents indexed yet. Run the embed pipeline to add your PDFs."
              : `${topics.length} topic${topics.length !== 1 ? "s" : ""} · ${topics.reduce((s, t) => s + t.totalChunks, 0)} chunks total`}
          </p>
        </div>

        {loading && (
          <div style={{ color: "var(--ink-3)", fontSize: 14, padding: "8px 4px" }}>
            Fetching indexed content…
          </div>
        )}

        {!loading && topics.map((topic) => {
          const open = expanded.has(topic.id);
          return (
            <div key={topic.id} className="cl-section">
              <div
                className="cl-section-head"
                style={{ cursor: "pointer", userSelect: "none" }}
                onClick={() => toggle(topic.id)}
              >
                <div className="cl-section-title" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <ChevR
                    size={14}
                    style={{
                      color: "var(--ink-3)",
                      transform: open ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.15s",
                      flex: "none",
                    }}
                  />
                  {topic.name || "Untitled"}
                  <span className="count">{topic.subtopics.length} subtopics</span>
                </div>
                <div className="cl-section-meta">{topic.totalChunks} chunks</div>
              </div>

              {open && (
                <div className="cl-list">
                  {topic.subtopics.map((sub, i) => (
                    <div
                      key={i}
                      className="note-item"
                      style={{ cursor: onPickTopic ? "pointer" : "default" }}
                      onClick={() => onPickTopic?.(sub.name || topic.name)}
                      title={onPickTopic ? `Chat about: ${sub.name || topic.name}` : undefined}
                    >
                      <div className="note-icon"><File size={15} /></div>
                      <div className="note-text">
                        <div className="note-title">{sub.name || "(no subtopic)"}</div>
                        {sub.snippet && (
                          <div className="note-path" style={{ fontFamily: "var(--font-sans)", fontSize: 12, color: "var(--ink-3)", marginTop: 2, whiteSpace: "normal", lineHeight: 1.4 }}>
                            {sub.snippet}…
                          </div>
                        )}
                      </div>
                      <div className="note-meta">
                        <span>{sub.chunks} chunks</span>
                      </div>
                    </div>
                  ))}

                  {onPickTopic && (
                    <div
                      className="note-item"
                      style={{ cursor: "pointer", borderTop: "1px dashed var(--line)" }}
                      onClick={() => onPickTopic(topic.name)}
                    >
                      <div className="note-icon" style={{ color: "var(--terra)" }}>→</div>
                      <div className="note-text">
                        <div className="note-title" style={{ color: "var(--terra)" }}>
                          Ask about {topic.name}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
