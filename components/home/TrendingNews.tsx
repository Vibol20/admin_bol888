import NewsGrid from "@/components/news/NewsGrid";

export default function TrendingNews() {
  return (
    <section className="px-4 py-10 md:px-8">
      <div className="mx-auto max-w-6xl">
        <NewsGrid category="all" count={6} title="Trending News" />
      </div>
    </section>
  );
}
