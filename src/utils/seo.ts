import { type Metadata } from "next";

import { APP_URL } from "./constants";

export function constructMetadata({
  title = `Reetcode - Leetcode for real world engineering problem solving.`,
  description = `Leetcode is the best resource to prepare for day to day software engineering problem solving. 50+ practical problems to solve (with solutions and explanations) from the best companies in the world.`,
  //   image = "https://dub.co/_static/thumbnail.png",
  icons = [
    {
      rel: "apple-touch-icon",
      sizes: "32x32",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon-32x32.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon-16x16.png",
    },
  ],
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: Metadata["icons"];
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        // {
        //   url: image,
        // },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      //   images: [image],
      creator: "@reetcode",
    },
    icons,
    metadataBase: new URL(APP_URL),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
