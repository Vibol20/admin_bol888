import Hero from "@/components/home/Hero";
import TrendingNews from "@/components/home/TrendingNews";
import TodayMatches from "@/components/home/TodayMatches";
import TopLeagues from "@/components/home/TopLeagues";
import FeaturedPredictions from "@/components/home/FeaturedPredictions";
import AIAssistantCard from "@/components/home/AIAssistantCard";
import PopularTeams from "@/components/home/PopularTeams";

export default function HomePage() {
  return (
    <div>
      <Hero />
      <TodayMatches />
      <TopLeagues />
      <TrendingNews />
      <FeaturedPredictions />
      <AIAssistantCard />
      <PopularTeams />
    </div>
  );
}
