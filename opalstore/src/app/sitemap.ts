import { MetadataRoute } from "next";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://opalstore.id";

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  // Dynamic product pages
  try {
    await connectDB();
    const products = await Product.find({ isActive: true }).select("slug updatedAt").lean();
    const productPages: MetadataRoute.Sitemap = products.map((p: any) => ({
      url: `${baseUrl}/dashboard/${p.slug}`,
      lastModified: p.updatedAt || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
