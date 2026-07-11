export type Theme = "light" | "dark";

export type GeminiModel =
  | "gemini-3.5-flash"
  | "gemini-3.1-flash-lite"
  | "gemini-3.1-pro-preview";

export interface AppSettings {
  theme: Theme;
  language: "en" | "km";
  model: GeminiModel;
  temperature: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export type NewsCategory =
  | "breaking"
  | "transfer"
  | "preview"
  | "report"
  | "injury"
  | "manager"
  | "international"
  | "women"
  | "youth";

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: NewsCategory;
  image: string;
  publishedAt: number;
  source: string;
  aiGenerated?: boolean;
}

export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoff: string;
  homeLogo: string;
  awayLogo: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo: string;
}

export interface Team {
  id: string;
  name: string;
  league: string;
  logo: string;
}

export interface MatchAnalysisInput {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  odds?: string;
}

export interface MatchAnalysisResult {
  preview: string;
  homeForm: string;
  awayForm: string;
  homeStrengths: string[];
  homeWeaknesses: string[];
  awayStrengths: string[];
  awayWeaknesses: string[];
  keyPlayers: { team: string; player: string; note: string }[];
  expectedGoals: { home: number; away: number };
  winProbability: { home: number; draw: number; away: number };
  correctScore: string;
  asianHandicap: string;
  overUnder: string;
  btts: string;
  riskLevel: "Low" | "Medium" | "High";
  confidenceScore: number;
  importantFactors: string[];
  finalVerdict: string;
}

export interface BettingHelperInput {
  homeTeam: string;
  awayTeam: string;
  competition: string;
  odds?: string;
}

export interface BettingSuggestion {
  type: string;
  suggestion: string;
  reasoning: string;
  riskLevel: "Low" | "Medium" | "High";
}

export interface BettingHelperResult {
  valueBets: BettingSuggestion[];
  saferPicks: BettingSuggestion[];
  accumulator: BettingSuggestion[];
  overUnder: BettingSuggestion[];
  btts: BettingSuggestion[];
  doubleChance: BettingSuggestion[];
  disclaimer: string;
}

export interface FavoriteItem {
  id: string;
  type: "news" | "team" | "prediction";
  refId: string;
  label: string;
  savedAt: number;
  data?: unknown;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
}
