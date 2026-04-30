import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://vortsignal.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/pricing",
        "/signals",
        "/market",
        "/disclaimer",
        "/terms",
        "/privacy",
        "/contact",
      ],
      disallow: [
        "/dashboard",
        "/account",
        "/alerts",
        "/watchlist",
        "/admin",
        "/api/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}