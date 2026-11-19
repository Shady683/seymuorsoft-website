import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Seymour Soft Solution",
    short_name: "Seymo Soft",
    description: "نبني تطبيقات موبايل وبرامج مخصصة للمحلات والشركات",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#4A6CF7",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
