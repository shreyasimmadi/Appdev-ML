"use client";
import * as React from "react";
import { courseNotes } from "./data";
import { File } from "./icons";

export function CourseNotes() {
  const groups: Record<string, typeof courseNotes> = {};
  for (const n of courseNotes) {
    (groups[n.course] = groups[n.course] || []).push(n);
  }
  const courses = Object.keys(groups);

  return (
    <div className="checklist">
      <div className="checklist-inner">
        <div className="checklist-head">
          <h1>Course notes <em>— indexed</em></h1>
          <p>
            {courseNotes.length} documents across {courses.length} courses.
            Click any note to open it in the chat as context.
          </p>
        </div>

        {courses.map((course) => {
          const notes = groups[course];
          const totalChunks = notes.reduce((a, n) => a + n.chunks, 0);
          return (
            <div key={course} className="cl-section">
              <div className="cl-section-head">
                <div className="cl-section-title">
                  {course} <span className="count">{notes.length}</span>
                </div>
                <div className="cl-section-meta">{totalChunks} chunks</div>
              </div>
              <div className="cl-list">
                {notes.map((n) => (
                  <div key={n.id} className="note-item">
                    <div className="note-icon"><File size={15} /></div>
                    <div className="note-text">
                      <div className="note-title">{n.title}</div>
                      <div className="note-path">{n.path}</div>
                    </div>
                    <div className="note-meta">
                      <span>{n.pages}p</span>
                      <span>{n.chunks} chunks</span>
                      <span>{n.updated}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
