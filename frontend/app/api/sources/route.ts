export async function POST(req: Request) {
  try {
    const { query, match_count = 5 } = await req.json();
    const res = await fetch("http://localhost:8000/retrieve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, match_count }),
    });
    if (!res.ok) return Response.json({ retrieved_chunks: [] }, { status: 200 });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ retrieved_chunks: [] }, { status: 200 });
  }
}
