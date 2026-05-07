import { streamText } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

// Initialize the Gemini API (Requires GOOGLE_API_KEY in your .env.local file)
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY || '',
});

const SYSTEM_PROMPT = `You are a rigorous Socratic tutor for STEM subjects, specifically Computer Science and Robotics. 
You must NOT act as an open-ended chatbot or provide direct answers. 
You must NOT act as a simple calculator. 
Your goal is to guide the student through logical steps. If a student asks a math, physics, or algorithmic question, ask guiding questions to help them find the friction point.
Whenever you write math or physics formulas, you MUST use standard LaTeX formatting.
Always ground your responses in the provided COURSE CONTEXT. If the context does not contain the answer, gently inform the student.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    console.log("--- NEW COMPILE: PLAIN TEXT STREAM ACTIVE ---");

    // 1. Force the array into the strict CoreMessage schema to prevent AI_InvalidPromptError
    const CLEANED_MESSAGES = messages.map((m: any) => {
      let extractedText = "";
      
      if (typeof m.content === "string" && m.content.trim().length > 0) {
        extractedText = m.content;
      } else if (m.parts && Array.isArray(m.parts)) {
        extractedText = m.parts.map((p: any) => p.text || "").join("");
      }
      
      return {
        role: m.role === "assistant" ? "assistant" : "user",
        // Fallback to a single space if empty, as Zod rejects completely undefined content
        content: extractedText || " " 
      };
    });

    const latestMessage = CLEANED_MESSAGES[CLEANED_MESSAGES.length - 1].content;
    const payload = { query: latestMessage, match_count: 5 };

    // 2. Hit your FastAPI backend
    const fastApiResponse = await fetch('http://localhost:8000/retrieve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!fastApiResponse.ok) throw new Error("FastAPI fetch failed");

    const contextData = await fastApiResponse.json();
    const chunks = contextData.retrieved_chunks || [];
    const contextString = chunks.map((c: any) => c.content).join('\n\n---\n\n');
    const finalSystemPrompt = `${SYSTEM_PROMPT}\n\nCOURSE CONTEXT:\n${contextString}`;

    // 3. Call Gemini using ONLY the CLEANED_MESSAGES array
    const result = await streamText({
      model: google('gemini-3-flash-preview'), 
      system: finalSystemPrompt,
      messages: CLEANED_MESSAGES,
    });

    // 4. Stream the raw plain text back to the custom Next.js frontend fetch logic
    return result.toTextStreamResponse();
    
  } catch (error) {
    console.error("Chat API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}

