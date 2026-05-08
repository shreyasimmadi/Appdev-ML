"use client";
import * as React from "react";
import { File } from "./icons";

interface Note {
  id: string;
  title: string;
  chunks: number;
}

export function CourseNotes() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => setNotes(data.notes ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="checklist">
      <div className="checklist-inner">
        <div className="checklist-head">
          <h1>Course notes <em>— indexed</em></h1>
          <p>
            {loading
              ? "Loading indexed documents…"
              : notes.length === 0
              ? "No documents indexed yet. Run the embed script to add your PDFs."
              : `${notes.length} document${notes.length !== 1 ? "s" : ""} indexed in Supabase.`}
          </p>
        </div>

        {loading && (
          <div style={{ color: "var(--ink-3)", fontSize: 14, padding: "8px 4px" }}>
            Fetching from Supabase…
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div className="cl-section">
            <div className="cl-list">
              {notes.map((n) => (
                <div key={n.id} className="note-item">
                  <div className="note-icon"><File size={15} /></div>
                  <div className="note-text">
                    <div className="note-title">{n.title}</div>
                  </div>
                  <div className="note-meta">
                    <span>{n.chunks} chunks</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
