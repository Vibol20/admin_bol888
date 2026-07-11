import { generateText } from "ai";
import {
  getGemini,
  sanitizeModel,
  sanitizeTemperature,
  cleanJsonResponse,
} from "@/lib/gemini";
import { MatchAnalysisInput } from "@/types";

export const runtime = "edge";

function buildPrompt(input: MatchAnalysisInput) {
  return `You are an expert football analyst AI. Analyze the upcoming match below and
respond with STRICT JSON ONLY (no markdown fences, no commentary) matching exactly this TypeScript shape:

{
  "preview": string,
  "homeForm": string,
  "awayForm": string,
  "homeStrengths": string[],
  "homeWeaknesses": string[],
  "awayStrengths": string[],
  "awayWeaknesses": string[],
  "keyPlayers": { "team": string, "player": string, "note": string }[],
  "expectedGoals": { "home": number, "away": number },
  "winProbability": { "home": number, "draw": number, "away": number },
  "correctScore": string,
  "asianHandicap": string,
  "overUnder": string,
  "btts": string,
  "riskLevel": "Low" | "Medium" | "High",
  "confidenceScore": number,
  "importantFactors": string[],
  "finalVerdict": string
}

Rules:
- winProbability values must sum to approximately 100.
- confidenceScore is 0-100.
- Keep string fields concise (1-2 sentences each), arrays 3 items max.
- This is for educational/entertainment analysis only, never claim certainty.

Match details:
Home Team: ${input.homeTeam}
Away Team: ${input.awayTeam}
Competition: ${input.competition}
${input.odds ? `Known Odds/Context: ${input.odds}` : ""}
`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { homeTeam, awayTeam, competition, odds, model, temperature } = body ?? {};

    if (!homeTeam || !awayTeam || !competition) {
      return new Response(
        JSON.stringify({ error: "homeTeam, awayTeam and competition are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const google = getGemini();
    const selectedModel = sanitizeModel(model);
    const temp = sanitizeTemperature(temperature);

    const { text } = await generateText({
      model: google(selectedModel),
      prompt: buildPrompt({ homeTeam, awayTeam, competition, odds }),
      temperature: temp,
    });

    const cleaned = cleanJsonResponse(text);
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({ error: "AI returned invalid JSON. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[/api/analyze] error", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "Failed to generate match analysis.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
