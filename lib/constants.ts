import { League, Team, NewsCategory } from "@/types";

export const APP_NAME = "Football AI Hub";

export const TOP_LEAGUES: League[] = [
  { id: "epl", name: "Premier League", country: "England", logo: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { id: "laliga", name: "La Liga", country: "Spain", logo: "🇪🇸" },
  { id: "seriea", name: "Serie A", country: "Italy", logo: "🇮🇹" },
  { id: "bundesliga", name: "Bundesliga", country: "Germany", logo: "🇩🇪" },
  { id: "ligue1", name: "Ligue 1", country: "France", logo: "🇫🇷" },
  { id: "ucl", name: "Champions League", country: "Europe", logo: "⭐" },
];

export const POPULAR_TEAMS: Team[] = [
  { id: "real-madrid", name: "Real Madrid", league: "La Liga", logo: "⚪" },
  { id: "man-city", name: "Manchester City", league: "Premier League", logo: "🔵" },
  { id: "barcelona", name: "Barcelona", league: "La Liga", logo: "🔴" },
  { id: "liverpool", name: "Liverpool", league: "Premier League", logo: "🔴" },
  { id: "bayern", name: "Bayern Munich", league: "Bundesliga", logo: "🔴" },
  { id: "psg", name: "Paris Saint-Germain", league: "Ligue 1", logo: "🔵" },
  { id: "arsenal", name: "Arsenal", league: "Premier League", logo: "🔴" },
  { id: "inter-milan", name: "Inter Milan", league: "Serie A", logo: "⚫" },
];

export const NEWS_CATEGORIES: { value: NewsCategory; label: string }[] = [
  { value: "breaking", label: "Breaking" },
  { value: "transfer", label: "Transfers" },
  { value: "preview", label: "Match Previews" },
  { value: "report", label: "Match Reports" },
  { value: "injury", label: "Injuries" },
  { value: "manager", label: "Manager News" },
  { value: "international", label: "International" },
  { value: "women", label: "Women's Football" },
  { value: "youth", label: "Youth Football" },
];

export const SUGGESTED_PROMPTS = [
  "Compare Real Madrid and Man City's current form",
  "Explain the offside rule like I'm new to football",
  "Who are the top scorers in Europe's top 5 leagues this season?",
  "What tactical system suits a fast counter-attacking team?",
  "Give me 3 storylines to watch this weekend",
];

export const COMPETITIONS = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Champions League",
  "Europa League",
  "World Cup",
  "AFCON",
  "Copa America",
  "Other",
];

export const LOCAL_STORAGE_KEYS = {
  settings: "fah_settings",
  favorites: "fah_favorites",
  chatSessions: "fah_chat_sessions",
  activeChatId: "fah_active_chat",
};

export const DEFAULT_SETTINGS = {
  theme: "dark" as const,
  language: "en" as const,
  model: "gemini-3.1-flash-lite" as const,
  temperature: 0.7,
};
