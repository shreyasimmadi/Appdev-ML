eckard.ai
A Socratic RAG tutor for introductory Computer Science, built for UMD's CMSC 131/132 courses.
Instead of giving direct answers, EckardAI guides students through problems with guiding questions — always grounded in the actual course material, never general-knowledge hallucinations.

How It Works
EckardAI uses a Retrieval-Augmented Generation (RAG) pipeline:

PDF Ingest — Lecture PDFs are parsed into Markdown using Docling, preserving the structure of each lecture's headings and sections.
Chunk & Embed — Markdown is split by ## headers using LangChain's MarkdownHeaderTextSplitter, then each chunk is embedded into a 384-dimensional vector using all-MiniLM-L6-v2 (SentenceTransformers).
Store — Chunks and their embeddings are stored in a Supabase PostgreSQL database with the pgvector extension.
Hybrid Search — At query time, the user's question is embedded and passed to a hybrid_search Supabase RPC function that combines semantic similarity (pgvector cosine) with keyword full-text search (PostgreSQL BM25). The top 5 ranked chunks are returned.
Augment & Generate — The retrieved chunks are injected into Gemini's system prompt as grounded course context. Gemini then generates a Socratic response — asking questions, surfacing friction points, and guiding the student without giving away the answer.


Tech Stack
LayerTechnologyFrontendNext.js 14 (App Router), TypeScript, Tailwind CSSStreamingVercel AI SDK (streamText)LLMGemini via Google AI SDK (gemini-3-flash-preview)Backend APIFastAPI (Python)Embeddingsall-MiniLM-L6-v2 (SentenceTransformers, 384-dim)Vector StoreSupabase PostgreSQL + pgvectorPDF ParsingDoclingChunkingLangChain MarkdownHeaderTextSplitterEvaluationRAGAS (faithfulness, context_precision)Eval LLMgoogle/gemma-3-12b-it via OpenRouter

Project Structure
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
    │   ├── globals.css       # Design system (eckard.ai warm aesthetic)
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

Setup
Prerequisites

Node.js 18+
Python 3.10+
A Supabase project with pgvector enabled
A Google AI Studio API key
An OpenRouter API key (for RAGAS evaluation)

Backend
bashcd backend
pip install -r requirements.txt

# Copy your .env
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_KEY

# 1. Ingest PDFs (place them in backend/data/raw_pdfs/cmsc_131/)
python scripts/01_extract.py

# 2. Embed chunks into Supabase
python scripts/02_embed.py

# 3. Start the FastAPI server
uvicorn main:app --reload
Frontend
bashcd frontend
npm install

# Copy your .env.local
cp .env.local.example .env.local
# Fill in GOOGLE_API_KEY

npm run dev
The app will be available at http://localhost:3000.

RAGAS Evaluation
The ragas_eval.py script evaluates the RAG pipeline across 10 Java/OOP test questions using Gemma-3-12b-it (via OpenRouter) as the judge model.
Metrics evaluated:

Faithfulness — are answers supported by the retrieved context?
Context Precision — are the retrieved chunks ranked and selected correctly?

bashcd backend
# Make sure FastAPI server is running on localhost:8000
python ragas_eval.py
Results are printed to stdout. Note: the script applies a 20-second delay between queries to stay within OpenRouter rate limits.

Socratic Design
EckardAI uses a carefully engineered system prompt that instructs Gemini to:

Never give direct answers to homework or problem-solving questions
Ask guiding questions to help students find the friction point themselves
Always ground responses in the provided course context — if the answer isn't in the retrieved chunks, it says so
Format math and code using standard LaTeX and code blocks


Contributors
Shreyas Immadi
Ajay Cunanne