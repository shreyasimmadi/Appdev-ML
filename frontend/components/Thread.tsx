"use client";
import * as React from "react";
import type { ChatMessage } from "../lib/types";
import { MessageView } from "./Message";

export function Thread({ messages, typing }: { messages: any[]; typing?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = ref.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, typing]);

  return (
    <div className="thread" ref={ref}>
      <div className="thread-inner">
        {messages.map((m) => <MessageView key={m.id} msg={m} />)}
        {typing && (
          <div className="msg">
            <div className="msg-avatar bot">e</div>
            <div className="msg-body">
              <div className="msg-meta">
                <span className="msg-name">eckard <span className="badge">Socratic</span></span>
                <span className="msg-time">just now</span>
              </div>
              <div className="typing"><span /><span /><span /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
