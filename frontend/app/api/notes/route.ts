export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    return Response.json({ notes: [] });
  }

  try {
    const res = await fetch(`${url}/rest/v1/documents?select=metadata`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return Response.json({ notes: [] });

    const rows: { metadata: Record<string, string> }[] = await res.json();

    // Aggregate by topic (H1 header from the markdown)
    const topicMap = new Map<string, number>();
    for (const row of rows) {
      const topic = row.metadata?.topic ?? "Untitled";
      topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
    }

    const notes = Array.from(topicMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([topic, chunks], i) => ({
        id: `n${i}`,
        title: topic,
        chunks,
      }));

    return Response.json({ notes });
  } catch {
    return Response.json({ notes: [] });
  }
}
