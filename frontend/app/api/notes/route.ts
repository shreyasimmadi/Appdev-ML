export async function GET() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_KEY;

  if (!url || !key) {
    console.log("[notes] missing SUPABASE_URL or SUPABASE_KEY");
    return Response.json({ topics: [], debug: "missing env vars" });
  }

  try {
    const endpoint = `${url}/rest/v1/documents?select=metadata,content`;
    console.log("[notes] fetching", endpoint);
    const res = await fetch(endpoint, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[notes] status", res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log("[notes] error body", text);
      return Response.json({ topics: [], debug: `supabase ${res.status}: ${text}` });
    }

    const rows: { metadata: Record<string, string>; content: string }[] = await res.json();

    const cleanName = (s: string) =>
      s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // strip markdown links
       .replace(/^[•\-\*]\s+/, "")              // strip bullet prefix
       .replace(/^\d+\.\s+/, "")               // strip "1. " numbering
       .replace(/:$/, "")                       // strip trailing colon
       .trim();

    // Build topic → subtopics nested map
    const topicMap = new Map<string, Map<string, { count: number; snippet: string }>>();

    for (const row of rows) {
      const rawTopic = row.metadata?.topic;
      const topic = rawTopic ? cleanName(rawTopic) : "CMSC132 Material";
      const subtopic = row.metadata?.subtopic ? cleanName(row.metadata.subtopic) : "";

      if (!topicMap.has(topic)) topicMap.set(topic, new Map());
      const subMap = topicMap.get(topic)!;

      if (!subMap.has(subtopic)) {
        subMap.set(subtopic, {
          count: 0,
          snippet: row.content?.slice(0, 120).replace(/\n/g, " ") ?? "",
        });
      }
      subMap.get(subtopic)!.count += 1;
    }

    const topics = Array.from(topicMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([name, subMap], i) => {
        const subtopics = Array.from(subMap.entries())
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([subName, data]) => ({
            name: subName,
            chunks: data.count,
            snippet: data.snippet,
          }));
        return {
          id: `t${i}`,
          name,
          totalChunks: subtopics.reduce((s, st) => s + st.chunks, 0),
          subtopics,
        };
      });

    return Response.json({ topics });
  } catch {
    return Response.json({ topics: [] });
  }
}
