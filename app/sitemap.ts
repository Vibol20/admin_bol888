import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/chat", "/news", "/analysis", "/betting", "/favorites", "/settings"];
  return routes.map((route) => ({
    url: `https://example.com${route}`,
    lastModified: new Date(),
  }));
}
