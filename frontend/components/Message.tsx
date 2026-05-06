"use client";
import * as React from "react";
import type { ChatMessage } from "../lib/types";
import { Citation } from "./Citation";
import { Formula } from "./Formula";
import { CodeBlock } from "./CodeBlock";
import { Copy, Refresh, ThumbsUp, ThumbsDown, Bulb, Question, Brain } from "./icons";

const calloutIcon = (kind: string) => {
  if (kind === "hint") return <Bulb size={11} />;
  if (kind === "question") return <Question size={11} />;
  return <Brain size={11} />;
};

export function MessageView({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === "user";
  return (
    <div className={`msg ${isUser ? "is-user" : ""}`}>
      <div className={`msg-avatar ${isUser ? "user" : "bot"}`}>
        {isUser ? "A" : "e"}
      </div>
      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-name">
            {msg.name}
            {msg.badge && <span className="badge">{msg.badge}</span>}
          </span>
          <span className="msg-time">{msg.time}</span>
        </div>
        <div className="msg-content">
          {msg.blocks.map((b, i) => {
            if (b.type === "text") {
              const isLast = i === msg.blocks.length - 1;
              return (
                <p key={i}>
                  <span dangerouslySetInnerHTML={{ __html: b.html }} />
                  {!isUser && isLast && msg.citations && msg.citations.length > 0 && (
                    <span style={{ marginLeft: 4 }}>
                      {msg.citations.map((n) => <Citation key={n} n={n} />)}
                    </span>
                  )}
                </p>
              );
            }
            if (b.type === "callout") {
              return (
                <div key={i} className={`callout ${b.kind}`}>
                  <div className="callout-label">
                    {calloutIcon(b.kind)} {b.title}
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: b.html }} />
                </div>
              );
            }
            if (b.type === "formula") {
              return <Formula key={i} tex={b.tex} tag={b.tag} />;
            }
            if (b.type === "code") {
              return <CodeBlock key={i} language={b.language} lines={b.lines} />;
            }
            if (b.type === "list") {
              const Tag = b.ordered ? "ol" : "ul";
              return (
                <Tag key={i}>
                  {b.items.map((it, j) => (
                    <li key={j} dangerouslySetInnerHTML={{ __html: it }} />
                  ))}
                </Tag>
              );
            }
            return null;
          })}
        </div>
        {!isUser && (
          <div className="msg-actions">
            <button className="act"><Copy size={12} /> Copy</button>
            <button className="act"><Refresh size={12} /> Try again</button>
            <button className="act"><ThumbsUp size={12} /></button>
            <button className="act"><ThumbsDown size={12} /></button>
          </div>
        )}
      </div>
    </div>
  );
}
