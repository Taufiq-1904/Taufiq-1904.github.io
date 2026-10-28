import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/site";

// One page, so one entry. Sections are anchors (#about, #projects, ...) and are not separate URLs.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${getSiteUrl()}/`, changeFrequency: "monthly", priority: 1 }];
}
