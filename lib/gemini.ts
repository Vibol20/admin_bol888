import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Server-only Gemini client factory.
 * This file must NEVER be imported from a "use client" component.
 * The API key is read from process.env and never sent to the browser.
 */
export function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not set. Add it to your .env.local file."
    );
  }
  return createGoogleGenerativeAI({ apiKey });
}

export const DEFAULT_MODEL = "gemini-3.1-flash-lite";

export const ALLOWED_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.1-pro-preview",
] as const;

export type AllowedModel = (typeof ALLOWED_MODELS)[number];

export function sanitizeModel(model: unknown): AllowedModel {
  if (typeof model === "string" && (ALLOWED_MODELS as readonly string[]).includes(model)) {
    return model as AllowedModel;
  }
  return DEFAULT_MODEL;
}

export function sanitizeTemperature(temp: unknown): number {
  const n = typeof temp === "number" ? temp : parseFloat(String(temp));
  if (Number.isNaN(n)) return 0.7;
  return Math.min(1, Math.max(0, n));
}

/** Strip markdown code fences from a model's JSON response before parsing. */
export function cleanJsonResponse(text: string): string {
  return text
    .trim()
    .replace(/^```json/i, "")
    .replace(/^```/, "")
    .replace(/```$/, "")
    .trim();
}
