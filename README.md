# eckard.ai

A Socratic RAG tutor for introductory Computer Science, built for UMD's CMSC 131/132 courses.

Instead of giving direct answers, eckard.ai guides students through problems with guiding questions — always grounded in the actual course material, never general-knowledge hallucinations.

---

## How It Works

eckard.ai uses a Retrieval-Augmented Generation (RAG) pipeline:

1. **PDF Ingest** — Lecture PDFs are parsed into Markdown using Docling, preserving the structure of each lecture's headings and sections.
2. **Chunk & Embed** — Markdown is split by `##` headers using LangChain's `MarkdownHeaderTextSplitter`, then each chunk is embedded into a 384-dimensional vector using `all-MiniLM-L6-v2` (SentenceTransformers).
3. **Store** — Chunks and their embeddings are stored in a Supabase PostgreSQL database with the `pgvector` extension.
4. **Hybrid Search** — At query time, the user's question is embedded and passed to a `hybrid_search` Supabase RPC function that combines semantic similarity (pgvector cosine) with keyword full-text search (BM25). The top 5 ranked chunks are returned.
5. **Augment & Generate** — The retrieved chunks are injected into Gemini's system prompt as grounded course context. Gemini then generates a Socratic response — asking questions, surfacing friction points, and guiding the student without giving away the answer.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), TypeScript, Tailwind CSS |
| Streaming | Vercel AI SDK (`streamText`) |
| LLM | Gemini via Google AI SDK (`gemini-2.5-flash-preview`) |
| Backend API | FastAPI (Python) |
| Embeddings | `all-MiniLM-L6-v2` (SentenceTransformers, 384-dim) |
| Vector Store | Supabase PostgreSQL + pgvector |
| PDF Parsing | Docling |
| Chunking | LangChain `MarkdownHeaderTextSplitter` |
| Evaluation | RAGAS (faithfulness, context_precision) |
| Eval LLM | `google/gemma-3-12b-it` via OpenRouter |

---

## Project Structure

```
Appdev-ML/
├── backend/
│   ├── main.py              # FastAPI server — /retrieve endpoint
│   ├── ragas_eval.py        # RAGAS evaluation script
│   ├── requirements.txt
│   └── scripts/
│       ├── 01_extract.py    # PDF → Markdown (Docling)
│       └── 02_embed.py      # Markdown → embeddings → Supabase
└── frontend/
    ├── app/
    │   ├── page.tsx          # Main app shell
    │   ├── globals.css       # Design system (eckard.ai aesthetic)
    │   └── api/
    │       ├── chat/route.ts     # Gemini streaming endpoint
    │       ├── notes/route.ts    # Course notes endpoint
    │       └── sources/route.ts  # RAG retrieval proxy
    └── components/
        ├── Sidebar.tsx       # Chat history + navigation
        ├── Thread.tsx        # Message thread
        ├── Composer.tsx      # Input box
        ├── SourcesPanel.tsx  # Retrieved chunks panel
        └── CourseNotes.tsx   # Indexed topics browser
```

---

## Setup

### Prerequisites

- Node.js 18+
- Python 3.12+
- A Supabase project with pgvector enabled
- A Google AI Studio API key
- An OpenRouter API key (for RAGAS evaluation only)

### Backend

```bash
cd backend
pip install -r requirements.txt
```

Fill in `backend/.env`:
```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_secret_key
OPENROUTER_API_KEY=your_openrouter_key
```

```bash
# 1. Place PDFs in backend/data/raw_pdfs/cmsc_131/ then ingest
python scripts/01_extract.py

# 2. Embed chunks into Supabase
python scripts/02_embed.py

# 3. Start the FastAPI server
py -3.12 -m uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
```

Fill in `frontend/.env.local`:
```
GOOGLE_API_KEY=your_google_ai_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_secret_key
```

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## RAGAS Evaluation

The `ragas_eval.py` script evaluates the RAG pipeline across 10 Java/OOP test questions using `gemma-3-12b-it` (via OpenRouter) as the judge model.

**Metrics:**
- **Faithfulness** — are answers supported by the retrieved context?
- **Context Precision** — are the retrieved chunks ranked and selected correctly?

```bash
cd backend
# Make sure FastAPI server is running on localhost:8000
python ragas_eval.py
```

Results are printed to stdout. Note: the script applies a 20-second delay between queries to stay within OpenRouter rate limits.

---

## Socratic Design

eckard.ai uses a carefully engineered system prompt that instructs Gemini to:

- Never give direct answers to homework or problem-solving questions
- Ask guiding questions to help students find the friction point themselves
- Always ground responses in the provided course context — if the answer isn't in the retrieved chunks, it says so
- Format math and code using standard LaTeX and code blocks

---

## Contributors

- Shreyas Immadi
- Ajay Cunanne
