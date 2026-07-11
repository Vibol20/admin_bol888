import { generateText } from "ai";
import {
  getGemini,
  sanitizeModel,
  sanitizeTemperature,
  cleanJsonResponse,
} from "@/lib/gemini";
import { BettingHelperInput } from "@/types";

export const runtime = "edge";

function buildPrompt(input: BettingHelperInput) {
  return `You are an EDUCATIONAL football betting helper AI. You never guarantee outcomes.
Given the match below, respond with STRICT JSON ONLY (no markdown fences) matching exactly:

{
  "valueBets": { "type": string, "suggestion": string, "reasoning": string, "riskLevel": "Low"|"Medium"|"High" }[],
  "saferPicks": { "type": string, "suggestion": string, "reasoning": string, "riskLevel": "Low"|"Medium"|"High" }[],
  "accumulator": { "type": string, "suggestion": string, "reasoning": string, "riskLevel": "Low"|"Medium"|"High" }[],
  "overUnder": { "type": string, "suggestion": string, "reasoning": string, "riskLevel": "Low"|"Medium"|"High" }[],
  "btts": { "type": string, "suggestion": string, "reasoning": string, "riskLevel": "Low"|"Medium"|"High" }[],
  "doubleChance": { "type": string, "suggestion": string, "reasoning": string, "riskLevel": "Low"|"Medium"|"High" }[],
  "disclaimer": string
}

Rules:
- 2 items per array (keep it concise).
- Each "reasoning" must be 1 short sentence explaining WHY, referencing form, matchup context, or statistical reasoning (invent plausible, clearly-labeled illustrative reasoning since you have no live data feed).
- The "disclaimer" must clearly state that predictions are uncertain, this is for entertainment/educational purposes only, and never guarantees winnings. Encourage responsible gambling.
- Never use absolute words like "guaranteed", "sure win", "lock".

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

    if (!parsed.disclaimer) {
      parsed.disclaimer =
        "Football predictions are inherently uncertain. These suggestions are for educational and entertainment purposes only and do not guarantee any winnings. Please gamble responsibly.";
    }

    return new Response(JSON.stringify(parsed), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[/api/predictions] error", err);
    return new Response(
      JSON.stringify({
        error: err?.message || "Failed to generate betting suggestions.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
