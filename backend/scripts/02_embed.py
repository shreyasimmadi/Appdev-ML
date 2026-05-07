from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
from langchain_text_splitters import MarkdownHeaderTextSplitter
from dotenv import load_dotenv
import os

load_dotenv()

model = SentenceTransformer('all-MiniLM-L6-v2')

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def push_to_supabase(sections):
    data_to_insert = []
    for section in sections:
        embedding = model.encode(section.page_content).tolist()
        row = {
            "content": section.page_content,
            "metadata": section.metadata,
            "embedding": embedding
        }
        data_to_insert.append(row)
    response = supabase.table("documents").insert(data_to_insert).execute()
    return response

MD_DIR = "data/parsed_md/cmsc_131_parsed"
for filename in os.listdir(MD_DIR):
    if filename.endswith(".md"):
        with open(os.path.join(MD_DIR, filename), "r") as f:
            content = f.read()

        splitter = MarkdownHeaderTextSplitter(headers_to_split_on=[("#", "topic"), ("##", "subtopic")])
        sections = splitter.split_text(content)

        try:
            push_to_supabase(sections)
            print(f"✅ Embedded: {filename} ({len(sections)} chunks)")
        except Exception as e:
            print(f"❌ Failed: {filename} — {e}")