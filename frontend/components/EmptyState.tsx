"use client";
import * as React from "react";
import { starters } from "./data";
import { Paperclip, Brain, Mic, Send } from "./icons";

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
            <button className="composer-pill" type="button">
              <Paperclip size={13} /> Attach
            </button>
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
      </div>
    </div>
  );
}
