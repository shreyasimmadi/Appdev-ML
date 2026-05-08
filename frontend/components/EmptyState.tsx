"use client";
import * as React from "react";
import { starters } from "./data";
import { Brain, Mic, Send } from "./icons";

const steps = [
  {
    num: "01",
    label: "Retrieve",
    color: "var(--sage)",
    soft: "var(--sage-soft)",
    border: "oklch(0.86 0.05 155)",
    desc: "Your question is embedded into a vector and run through hybrid search — combining semantic similarity and keyword matching against your indexed course notes in Supabase.",
  },
  {
    num: "02",
    label: "Augment",
    color: "var(--terra)",
    soft: "var(--terra-soft)",
    border: "oklch(0.85 0.06 235)",
    desc: "The top-ranked chunks are injected into the system prompt as grounded context, so the tutor's responses are always anchored to your actual course material — not general knowledge.",
  },
  {
    num: "03",
    label: "Generate",
    color: "var(--plum)",
    soft: "var(--plum-soft)",
    border: "oklch(0.86 0.04 320)",
    desc: "Gemini generates a Socratic response — guiding you through the problem with questions rather than direct answers, using only the retrieved context as its source of truth.",
  },
];

export function EmptyState({ onPickPrompt }: { onPickPrompt?: (text: string) => void }) {
  const [value, setValue] = React.useState("");
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(180, ta.scrollHeight) + "px";
  }, [value]);

  const submit = () => {
    if (!value.trim()) return;
    onPickPrompt?.(value);
    setValue("");
  };

  return (
    <div className="empty">
      <div className="empty-inner">
        <div className="empty-greet">Hi, Ajay</div>
        <h1 className="empty-hello"><em>What are we figuring out today?</em></h1>

        <div className="composer empty-composer">
          <textarea
            ref={taRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Ask eckard anything from your notes…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
          />
          <div className="composer-row">
            <button className="composer-pill on" type="button">
              <Brain size={13} /> Socratic
            </button>
            <span className="composer-spacer" />
            <button className="composer-pill icon" type="button"><Mic size={13} /></button>
            <button className="composer-send" disabled={!value.trim()} onClick={submit}>
              Send <Send size={13} />
            </button>
          </div>
        </div>

        <div className="starter-row centered">
          {starters.map((s) => (
            <button key={s} className="starter" onClick={() => onPickPrompt?.(s)}>
              {s}
            </button>
          ))}
        </div>

        {/* RAG Pipeline */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-4)" }}>
              How it works
            </span>
            <span style={{ flex: "none", height: 1, width: 40, background: "var(--line)" }} />
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink-4)" }}>RAG pipeline</span>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
            {steps.map((s, i) => (
              <React.Fragment key={s.num}>
                <div style={{
                  flex: 1,
                  background: s.soft,
                  border: `1px solid ${s.border}`,
                  borderRadius: "var(--r-lg)",
                  padding: "16px 18px",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <span style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      fontWeight: 700,
                      color: s.color,
                      background: "var(--bg-elev)",
                      border: `1px solid ${s.border}`,
                      borderRadius: 4,
                      padding: "2px 6px",
                    }}>{s.num}</span>
                    <span style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 500,
                      fontSize: 15,
                      color: s.color,
                    }}>{s.label}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--ink-2)" }}>
                    {s.desc}
                  </p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{ display: "flex", alignItems: "center", color: "var(--ink-4)", fontSize: 18, flex: "none" }}>→</div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
