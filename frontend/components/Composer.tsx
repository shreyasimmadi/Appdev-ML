"use client";
import * as React from "react";
import { Paperclip, Mic, Send, Brain, Bulb } from "./icons";

export function Composer({
  onSend,
  placeholder = "Ask a question, or paste a problem from your notes…",
}: {
  onSend?: (text: string) => void;
  placeholder?: string;
}) {
  const [value, setValue] = React.useState("");
  const [socratic, setSocratic] = React.useState(true);
  const [hint, setHint] = React.useState(false);
  const taRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(180, ta.scrollHeight) + "px";
  }, [value]);

  const submit = () => {
    if (!value.trim()) return;
    onSend?.(value);
    setValue("");
  };

  return (
    <div className="composer-wrap">
      <div className="composer">
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className="composer-row">
          <button className="composer-pill" title="Attach a note">
            <Paperclip size={13} /> Attach
          </button>
          <button
            className={`composer-pill ${socratic ? "on" : ""}`}
            onClick={() => setSocratic((s) => !s)}
            title="Socratic mode — guides instead of answering"
          >
            <Brain size={13} /> Socratic
          </button>
          <button
            className={`composer-pill ${hint ? "on" : ""}`}
            onClick={() => setHint((h) => !h)}
            title="Hint level"
          >
            <Bulb size={13} /> Light hints
          </button>
          <span className="composer-spacer" />
          <span className="kbd-tip"><kbd>⏎</kbd> send · <kbd>⇧⏎</kbd> newline</span>
          <button className="composer-pill icon" title="Voice"><Mic size={13} /></button>
          <button className="composer-send" disabled={!value.trim()} onClick={submit}>
            Send <Send size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
