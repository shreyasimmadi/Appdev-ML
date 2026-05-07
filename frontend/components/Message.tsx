"use client";
import * as React from "react";
// Implements the math parsers required by your sprint timeline
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; // Required stylesheet for beautifully rendered math
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

// Expanded to accept the dynamic stream object
export function MessageView({ msg }: { msg: any }) {
  const isUser = msg.role === "user";
  const hasBlocks = msg.blocks && Array.isArray(msg.blocks) && msg.blocks.length > 0;

  return (
    <div className={`msg ${isUser ? "is-user" : ""}`}>
      <div className={`msg-avatar ${isUser ? "user" : "bot"}`}>
        {isUser ? "A" : "e"}
      </div>
      <div className="msg-body">
        <div className="msg-meta">
          <span className="msg-name">
            {msg.name || (isUser ? "You" : "Study-Buddy")}
            {msg.badge && <span className="badge">{msg.badge}</span>}
          </span>
          <span className="msg-time">{msg.time}</span>
        </div>
        
        <div className="msg-content">
          {hasBlocks ? (
            msg.blocks.map((b: any, i: number) => {
              if (b.type === "text") {
                const isLast = i === msg.blocks.length - 1;
                return (
                  <div key={i} className="markdown-body">
                    {/* Intercepts the raw text stream and renders Markdown & LaTeX */ }
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]} 
                      rehypePlugins={[rehypeKatex]}
                    >
                      {b.html}
                    </ReactMarkdown>
                    
                    {!isUser && isLast && msg.citations && msg.citations.length > 0 && (
                      <span style={{ marginLeft: 4 }}>
                        {msg.citations.map((n: number) => <Citation key={n} n={n} />)}
                      </span>
                    )}
                  </div>
                );
              }
              if (b.type === "callout") {
                return (
                  <div key={i} className={`callout ${b.kind}`}>
                    <div className="callout-label">
                      {calloutIcon(b.kind)} {b.title}
                    </div>
                    {/* Render LaTeX inside callouts too */}
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {b.html}
                    </ReactMarkdown>
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
                    {b.items.map((it: string, j: number) => (
                      <li key={j}>
                         <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                           {it}
                         </ReactMarkdown>
                      </li>
                    ))}
                  </Tag>
                );
              }
              return null;
            })
          ) : (
            /* Fallback to msg.content if the blocks array doesn't exist */
            <div className="markdown-body">
              <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                {msg.content || ""}
              </ReactMarkdown>
            </div>
          )}
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
