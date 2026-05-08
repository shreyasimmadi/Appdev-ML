import os
import time
import requests
from dotenv import load_dotenv
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import faithfulness, context_precision
from ragas.llms import LangchainLLMWrapper
from langchain_openai import ChatOpenAI
from openai import OpenAI

load_dotenv()

# ── Clients ───────────────────────────────────────────────────────────────────
gemini_client = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

langchain_llm = ChatOpenAI(
    model="google/gemma-3-12b-it",
    openai_api_key=os.getenv("OPENROUTER_API_KEY"),
    openai_api_base="https://openrouter.ai/api/v1",
)
ragas_llm = LangchainLLMWrapper(langchain_llm)

faithfulness.llm = ragas_llm
context_precision.llm = ragas_llm

# ── Test questions (covers key subtopics from your Supabase table) ────────────
TEST_QUESTIONS = [
    "What is the difference between a while loop and a for loop?",
    "How does inheritance work in Java?",
    "What is polymorphism?",
    "What is the purpose of the super keyword?",
    "What is downcasting?",
    "How does late binding work in Java?",
    "What is the difference between a superclass and a subclass?",
    "What is the instanceof operator used for?",
    "What is object binding?",
    "What is the Object class in Java?",
]

# ── Step 1: Retrieve chunks via your FastAPI backend ──────────────────────────
def retrieve_chunks(question: str) -> list[str]:
    response = requests.post(
        "http://localhost:8000/retrieve",
        json={"query": question, "match_count": 5}
    )
    data = response.json()
    chunks = data.get("retrieved_chunks", [])
    return [c["content"] for c in chunks]

# ── Step 2: Generate a direct answer using OpenRouter + retrieved chunks ───────
def generate_answer(question: str, chunks: list[str]) -> str:
    context = "\n\n---\n\n".join(chunks)
    prompt = f"""You are a helpful CS teaching assistant.
Using ONLY the context below, answer the question directly and concisely.
If the context doesn't contain the answer, say "I don't know."

Context:
{context}

Question: {question}
Answer:"""

    response = gemini_client.chat.completions.create(
        model="google/gemma-3-12b-it",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=512
    )
    return response.choices[0].message.content.strip()

# ── Step 3: Build the RAGAS dataset ──────────────────────────────────────────
print("Building evaluation dataset from your RAG pipeline...")
print("(Make sure your FastAPI server is running on localhost:8000)\n")

questions, answers, contexts = [], [], []

for i, question in enumerate(TEST_QUESTIONS):
    print(f"[{i+1}/{len(TEST_QUESTIONS)}] {question}")
    
    chunks = retrieve_chunks(question)
    answer = generate_answer(question, chunks)
    
    questions.append(question)
    answers.append(answer)
    contexts.append(chunks)
    
    if i < len(TEST_QUESTIONS) - 1:
        time.sleep(20)

dataset = Dataset.from_dict({
    "question": questions,
    "answer": answers,
    "contexts": contexts,
    "reference": answers,
})

# ── Step 4: Evaluate ──────────────────────────────────────────────────────────
print("\nRunning RAGAS evaluation...")

results = evaluate(
    dataset=dataset,
    metrics=[faithfulness, context_precision]
)

print("\n--- FINAL METRICS ---")
print(results)