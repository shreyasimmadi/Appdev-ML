"use client";
import * as React from "react";
import { Sidebar, type View, type ChatSummary } from "../components/Sidebar";
import { Topbar } from "../components/Topbar";
import { Thread } from "../components/Thread";
import { Composer } from "../components/Composer";
import { SourcesPanel } from "../components/SourcesPanel";
import { EmptyState } from "../components/EmptyState";
import { CourseNotes } from "../components/CourseNotes";
import type { Source } from "../lib/types";

const CHAT_LIST_KEY = "eckard_chat_list";
const chatKey = (id: string) => `eckard_chat_${id}`;

function loadChatList(): ChatSummary[] {
  try { return JSON.parse(localStorage.getItem(CHAT_LIST_KEY) ?? "[]"); }
  catch { return []; }
}

function loadChatMessages(id: string): any[] {
  try { return JSON.parse(localStorage.getItem(chatKey(id)) ?? "[]"); }
  catch { return []; }
}

function saveChatMessages(id: string, messages: any[]) {
  localStorage.setItem(chatKey(id), JSON.stringify(messages));
}

function saveChatList(list: ChatSummary[]) {
  localStorage.setItem(CHAT_LIST_KEY, JSON.stringify(list));
}

export default function Home() {
  const [view, setView] = React.useState<View>("empty");
  const [activeId, setActiveId] = React.useState("");
  const [sourcesOpen, setSourcesOpen] = React.useState(true);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [sources, setSources] = React.useState<Source[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [chatList, setChatList] = React.useState<ChatSummary[]>([]);
  const [theme, setTheme] = React.useState<"light" | "dark">("light");

  React.useEffect(() => {
    setChatList(loadChatList());
    const saved = localStorage.getItem("eckard_theme") as "light" | "dark" | null;
    if (saved) {
      setTheme(saved);
      document.documentElement.setAttribute("data-theme", saved);
    }
  }, []);

  const handleToggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next === "dark" ? "dark" : "");
    localStorage.setItem("eckard_theme", next);
  };

  const handleNewChat = () => {
    setMessages([]);
    setSources([]);
    setActiveId("");
    setView("empty");
  };

  const handleSelectChat = (id: string) => {
    setMessages(loadChatMessages(id));
    setSources([]);
    setActiveId(id);
    setView("chat");
  };

  const handleDeleteChat = (id: string) => {
    localStorage.removeItem(chatKey(id));
    const updated = chatList.filter((c) => c.id !== id);
    saveChatList(updated);
    setChatList(updated);
    if (activeId === id) handleNewChat();
  };

  const handleSend = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Create a new chat ID on first message
    const chatId = activeId || Date.now().toString();
    if (!activeId) setActiveId(chatId);
    setView("chat");

    const userMsg = {
      id: "u" + Date.now(),
      role: "user",
      name: "You",
      time: "just now",
      content: text,
      blocks: [{ type: "text", html: text }],
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    // Fetch sources in parallel (non-blocking)
    fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: text, match_count: 5 }),
    })
      .then((r) => r.json())
      .then((data) => {
        const chunks: any[] = data.retrieved_chunks || [];
        setSources(
          chunks.map((c, i) => ({
            id: i + 1,
            title: c.title || c.source || `Chunk ${i + 1}`,
            path: c.path || c.source || "course notes",
            score: c.similarity ?? c.score ?? 0,
            chunk: c.chunk_index ?? i,
            snippet: c.content || "",
            tokens: c.tokens,
          }))
        );
      })
      .catch(() => {});

    try {
      const apiMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content ?? (m.blocks?.[0]?.html ?? ""),
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("API Route Failed");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let aiText = "";
      let firstChunk = true;
      let finalMessages = newMessages;

      while (reader && !done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          aiText += decoder.decode(value, { stream: true });
          if (firstChunk) {
            const assistantMsg = {
              id: "a" + Date.now(),
              role: "assistant",
              name: "eckard",
              badge: "Socratic",
              time: "just now",
              content: aiText,
            };
            finalMessages = [...newMessages, assistantMsg];
            setMessages(finalMessages);
            firstChunk = false;
          } else {
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { ...updated[updated.length - 1], content: aiText };
              finalMessages = updated;
              return updated;
            });
          }
        }
      }

      // Save to localStorage after stream completes
      saveChatMessages(chatId, finalMessages);
      const title = text.length > 40 ? text.slice(0, 40) + "…" : text;
      const updatedList = [
        { id: chatId, title, updatedAt: Date.now() },
        ...chatList.filter((c) => c.id !== chatId),
      ];
      saveChatList(updatedList);
      setChatList(updatedList);
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isWaiting =
    isLoading &&
    (messages.length === 0 || messages[messages.length - 1]?.role === "user");

  return (
    <div className="app">
      <Sidebar
        view={view}
        setView={setView}
        activeId={activeId}
        chats={chatList}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />
      <main className="main">
        {view === "empty" && (
          <>
            <Topbar title="eckard.ai" crumb="Socratic tutor" showSourcesToggle={false} theme={theme} onToggleTheme={handleToggleTheme} />
            <EmptyState onPickPrompt={handleSend} />
          </>
        )}
        {view === "chat" && (
          <>
            <Topbar
              title="Study session"
              crumb="CMSC132"
              sourcesOpen={sourcesOpen}
              onToggleSources={() => setSourcesOpen((s) => !s)}
              theme={theme}
              onToggleTheme={handleToggleTheme}
            />
            <Thread messages={messages} typing={isWaiting} />
            <Composer onSend={handleSend} />
          </>
        )}
        {view === "notes" && (
          <>
            <Topbar title="Course notes" crumb="indexed corpus" showSourcesToggle={false} theme={theme} onToggleTheme={handleToggleTheme} />
            <CourseNotes onPickTopic={(topic) => handleSend(`Help me understand: ${topic}`)} />
          </>
        )}
      </main>
      {view === "chat" && (
        <SourcesPanel
          sources={sources}
          open={sourcesOpen}
          onClose={() => setSourcesOpen(false)}
        />
      )}
    </div>
  );
}
