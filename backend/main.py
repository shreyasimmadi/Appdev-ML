from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from sentence_transformers import SentenceTransformer
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Load Supabase environment variables from backend/.env
load_dotenv()

app = FastAPI()

# Initialize the model for fast, lightweight 384-dimensional vector generation
model = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize the Supabase (PostgreSQL) client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Define the expected structure of the incoming request
class QueryRequest(BaseModel):
    query: str
    match_count: int = 5 

@app.post("/retrieve")
def retrieve_documents(request: QueryRequest):
    try:
        # 1. Generate the vector from the user's string
        query_embedding = model.encode(request.query).tolist()

        # 2. Call the new hybrid_search SQL function
        response = supabase.rpc(
            "hybrid_search",
            {
                "query_text": request.query,         # Keyword search part
                "query_embedding": query_embedding,  # Semantic search part
                "match_count": request.match_count
            }
        ).execute()

        # 3. Return clean JSON with the Markdown chunks for the frontend
        return {
            "status": "success", 
            "retrieved_chunks": response.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))