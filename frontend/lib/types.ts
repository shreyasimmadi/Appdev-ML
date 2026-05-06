export type Role = "user" | "assistant";

export type CalloutKind = "hint" | "question" | "recall";

export type MessageBlock =
  | { type: "text"; html: string }
  | { type: "callout"; kind: CalloutKind; title: string; html: string }
  | { type: "formula"; tag?: string; tex: string }
  | { type: "code"; language: string; lines: string[] }
  | { type: "list"; ordered?: boolean; items: string[] };

export interface ChatMessage {
  id: string;
  role: Role;
  time: string;
  name: string;
  badge?: string;
  blocks: MessageBlock[];
  citations?: number[];
}

export interface Source {
  id: number;
  title: string;
  path: string;
  score: number;
  pageRange?: string;
  chunk: number;
  snippet: string;
  tokens?: number;
}

export interface ChatThread {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
  sources: Source[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  desc?: string;
  difficulty: "easy" | "medium" | "hard";
  done: boolean;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface CourseNote {
  id: string;
  title: string;
  path: string;
  course: string;
  pages: number;
  chunks: number;
  updated: string;
}
