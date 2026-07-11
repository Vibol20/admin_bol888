import { generateText } from "ai";
import {
  getGemini,
  sanitizeModel,
  sanitizeTemperature,
  cleanJsonResponse,
} from "@/lib/gemini";
import { NewsCategory } from "@/types";

export const runtime = "edge";

const CATEGORY_HINTS: Record<NewsCategory, string> = {
  breaking: "urgent breaking football news of any kind",
  transfer: "player transfer rumors, deals, and signings",
  preview: "upcoming match previews with context and storylines",
  report: "recaps and reports of recently completed matches",
  injury: "player injury updates and expected return timelines",
  manager: "manager appointments, sackings, and tactical decisions",
  international: "international football, national teams, and tournaments",
  women: "women's football leagues, players, and competitions",
  youth: "youth academies, youth international tournaments, wonderkids",
};

function buildPrompt(category: NewsCategory | "all", count: number) {
  const focus =
    category === "all"
      ? "a healthy mix across all categories: breaking, transfer, preview, report, injury, manager, international, women, youth"
      : CATEGORY_HINTS[category];

  return `You are a football news generator for a demo app called "Football AI Hub".
Generate ${count} realistic-sounding, CLEARLY FICTIONAL/ILLUSTRATIVE football news items focused on: ${focus}.
Use plausible but GENERIC club/player names or well-known historically-accurate football entities only in a general, non-defamatory, non-fabricated-quote way.
Respond with STRICT JSON ONLY (no markdown fences), an array of objects matching exactly:

[
  {
    "title": string,
    "summary": string (2-3 sentences),
    "category": "breaking"|"transfer"|"preview"|"report"|"injury"|"manager"|"international"|"women"|"youth",
    "source": string (a plausible outlet-style name, e.g. "Football AI Wire")
  }
]

Keep titles punchy and under 90 characters. Do not include real quotes attributed to real people.`;
}

const PLACEHOLDER_IMAGES = [
  "https://picsum.photos/seed/fah-stadium/800/450",
  "https://picsum.photos/seed/fah-pitch/800/450",
  "https://picsum.photos/seed/fah-crowd/800/450",
  "https://picsum.photos/seed/fah-goal/800/450",
  "https://picsum.photos/seed/fah-ball/800/450",
  "https://picsum.photos/seed/fah-training/800/450",
  "https://picsum.photos/seed/fah-trophy/800/450",
  "https://picsum.photos/seed/fah-night/800/450",
];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const category = (body?.category as NewsCategory | "all") || "all";
    const count = Math.min(Math.max(Number(body?.count) || 9, 3), 12);
    const model = body?.model;
    const temperature = body?.temperature;

    const google = getGemini();
    const selectedModel = sanitizeModel(model);
    const temp = sanitizeTemperature(temperature ?? 0.9);

    const { text } = await generateText({
      model: google(selectedModel),
      prompt: buildPrompt(category, count),
      temperature: temp,
    });

    const cleaned = cleanJsonResponse(text);
    let items: any[];
    try {
      items = JSON.parse(cleaned);
    } catch {
      return new Response(
        JSON.stringify({ error: "AI returned invalid JSON. Please try again." }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const now = Date.now();
    const enriched = items.map((item, i) => ({
      id: `news_${now}_${i}`,
      title: item.title,
      summary: item.summary,
      category: item.category,
      source: item.source || "Football AI Wire",
      image: PLACEHOLDER_IMAGES[i % PLACEHOLDER_IMAGES.length],
      publishedAt: now - i * 1000 * 60 * (7 + Math.floor(Math.random() * 40)),
      aiGenerated: true,
    }));

    return new Response(JSON.stringify({ items: enriched }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("[/api/news] error", err);
    return new Response(
      JSON.stringify({ error: err?.message || "Failed to generate news." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
