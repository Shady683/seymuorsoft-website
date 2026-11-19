import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: https://seymuorsoft-website.vercel.app,
      lastModified: new Date(),
      changeFrequency: monthly,
      priority: 1,
    },
    {
      url: https://seymuorsoft-website.vercel.app/wizard,
      lastModified: new Date(),
      changeFrequency: monthly,
      priority: 0.8,
    },
    {
      url: https://seymuorsoft-website.vercel.app/stores/giftx,
      lastModified: new Date(),
      changeFrequency: monthly,
      priority: 0.7,
    },
    {
      url: https://seymuorsoft-website.vercel.app/stores/karella,
      lastModified: new Date(),
      changeFrequency: monthly,
      priority: 0.7,
    },
  ];
}

