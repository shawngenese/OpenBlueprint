import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = "https://project-consultant.vercel.app";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/project/"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
