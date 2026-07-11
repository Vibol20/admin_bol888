import { streamText, convertToCoreMessages } from "ai";
import { getGemini, sanitizeModel, sanitizeTemperature } from "@/lib/gemini";

export const runtime = "edge";

const SYSTEM_PROMPT = `You are the AI Football Assistant inside "Football AI Hub".
You are a knowledgeable, friendly football (soccer) expert. You help users with:
- Match analysis, team form, tactics, and history
- Explaining rules, competitions, and terminology
- General football trivia, stats reasoning, and news context

Guidelines:
- Keep answers well-structured with markdown (headings, bold, bullet lists, tables when useful).
- Use code blocks only for things like stat tables or formulas, when helpful.
- If asked about betting odds or predictions, remind users this is for entertainment/education only,
  never guarantee outcomes, and encourage responsible gambling.
- Be concise but insightful. Prefer bullet points over long paragraphs.
- If you don't have live/real-time data, say so honestly rather than inventing exact current scores.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, model, temperature } = body ?? {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const google = getGemini();
    const selectedModel = sanitizeModel(model);
    const temp = sanitizeTemperature(temperature);

    const result = await streamText({
      model: google(selectedModel),
      system: SYSTEM_PROMPT,
      messages: convertToCoreMessages(messages),
      temperature: temp,
    });

    return result.toDataStreamResponse();
  } catch (err: any) {
    console.error("[/api/chat] error", err);
    return new Response(
      JSON.stringify({
        error:
          err?.message ||
          "Something went wrong contacting the AI model. Check your GEMINI_API_KEY.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
