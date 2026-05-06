"use client";
import * as React from "react";
import { Sidebar, type View } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { Thread } from "../components/Thread";
import { Composer } from "../components/Composer";
import { SourcesPanel } from "../components/SourcesPanel";
import { EmptyState } from "../components/EmptyState";
import { CourseNotes } from "../components/CourseNotes";
import { sampleThread } from "../components/data";
import type { ChatMessage } from "../lib/types";

export default function Home() {
  const [view, setView] = React.useState<View>("chat");
  const [activeId, setActiveId] = React.useState("t1");
  const [sourcesOpen, setSourcesOpen] = React.useState(true);
  const [messages, setMessages] = React.useState<ChatMessage[]>(sampleThread.messages);
  const [typing, setTyping] = React.useState(false);

  const handleSend = (text: string) => {
    const userMsg: ChatMessage = {
      id: "u" + Date.now(),
      role: "user",
      name: "You",
      time: "now",
      blocks: [{ type: "text", html: text.replace(/</g, "&lt;") }],
    };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        {
          id: "a" + Date.now(),
          role: "assistant",
          name: "eckard",
          badge: "Socratic",
          time: "now",
          citations: [1, 3],
          blocks: [
            {
              type: "text",
              html: "Good — let's <em>not</em> answer that yet. Before we dive in, what part of the question do you find slipperiest? Naming the friction usually melts it.",
            },
            {
              type: "callout",
              kind: "question",
              title: "Your turn",
              html: "If you had to teach this idea to a classmate in one sentence, where would you start? Type that and we'll build from it.",
            },
          ],
        },
      ]);
    }, 1100);
  };

  const handlePickPrompt = (text: string) => {
    setView("chat");
    setActiveId("t1");
    setTimeout(() => handleSend(text), 50);
  };

  return (
    <div className="app">
      <Sidebar view={view} setView={setView} activeId={activeId} setActiveId={setActiveId} />
      <main className="main">
        {view === "empty" && (
          <>
            <Topbar title="New conversation" crumb="untitled" showSourcesToggle={false} />
            <EmptyState onPickPrompt={handlePickPrompt} />
          </>
        )}
        {view === "chat" && (
          <>
            <Topbar
              title={sampleThread.title}
              crumb="ENPM662 · Robotics"
              sourcesOpen={sourcesOpen}
              onToggleSources={() => setSourcesOpen((s) => !s)}
            />
            <Thread messages={messages} typing={typing} />
            <Composer onSend={handleSend} />
          </>
        )}
        {view === "notes" && (
          <>
            <Topbar title="Course notes" crumb="indexed corpus" showSourcesToggle={false} />
            <CourseNotes />
          </>
        )}
      </main>
      {view === "chat" && (
        <SourcesPanel
          sources={sampleThread.sources}
          open={sourcesOpen}
          onClose={() => setSourcesOpen(false)}
        />
      )}
    </div>
  );
}
