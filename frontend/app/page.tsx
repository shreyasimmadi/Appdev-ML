"use client";
import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css"; 

export default function ChatPage() {
  const [messages, setMessages] = useState<{role: string, content: string}[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when a new message streams in
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    // 1. Add user message to the UI
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Hit the Next.js API route directly
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("API Route Failed");

      // 3. Manually decode the raw text stream coming from toTextStreamResponse()
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiText = "";

      // Add a blank placeholder for the Socratic tutor's incoming response
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (reader && !done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          aiText += decoder.decode(value, { stream: true });
          // Update the UI character-by-character as the stream arrives
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1].content = aiText;
            return updated;
          });
        }
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="main">
        {/* Topbar matching Eckard AI Styles */}
        <div className="topbar">
          <div className="topbar-title">
            <h2>Study-Buddy Socratic Tutor</h2>
            <span className="crumb">/ CS & Robotics</span>
          </div>
        </div>

        {/* Chat Thread */}
        <div className="thread">
          <div className="thread-inner">
            {messages.length === 0 ? (
              <div className="empty" style={{ textAlign: "center", marginTop: "40px" }}>
                <h1 className="empty-hello"><em>What are we figuring out today?</em></h1>
                <p style={{ color: "var(--ink-3)" }}>Ask a question about your CS or Robotics notes...</p>
              </div>
            ) : (
              messages.map((m, idx) => (
                <div key={idx} className={`msg ${m.role === "user" ? "is-user" : ""}`}>
                  <div className={`msg-avatar ${m.role === "user" ? "user" : "bot"}`}>
                    {m.role === "user" ? "U" : "SB"}
                  </div>
                  <div className="msg-body">
                    <div className="msg-meta">
                      <span className="msg-name">
                        {m.role === "user" ? "Student" : "Study-Buddy"}
                      </span>
                    </div>
                    <div className="msg-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                        components={{
                          // Map block-level math to your custom CSS .formula box
                          div({ className, children, ...props }) {
                            if (className && className.includes("math-display")) {
                              return (
                                <div className={`formula ${className}`} {...props}>
                                  {children}
                                </div>
                              );
                            }
                            return <div className={className} {...props}>{children}</div>;
                          }
                        }}
                      >
                        {m.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {/* Pulsing Typing Indicator */}
            {isLoading && (
              <div className="typing">
                <span></span><span></span><span></span>
              </div>
            )}
            <div ref={endOfMessagesRef} />
          </div>
        </div>

        {/* Text Composer Box */}
        <div className="composer-wrap">
          <div className="composer">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your tutor anything from your notes..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <div className="composer-row">
              <span className="composer-spacer" />
              <button className="composer-send" onClick={handleSend} disabled={!input.trim() || isLoading}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}