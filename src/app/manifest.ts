import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} | ${site.titleSuffix}`,
    short_name: site.name,
    description: site.description.en,
    start_url: "/",
    display: "browser",
    background_color: "#05040a",
    theme_color: "#05040a",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
