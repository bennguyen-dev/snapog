import { Metadata } from "next";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  host?: string | null;
  keywords?: string[];
}

const defaultMetadata = {
  siteName: "Snap OG",
  baseTitle: "Generate social media previews automatically",
  baseDescription:
    "Transform your social media presence with automated OG images. Boost engagement by up to 40% with AI-powered social previews.",
  baseKeywords: [
    "OG image generator",
    "social media preview",
    "automated screenshots",
    "website preview generator",
    "social sharing optimization",
    "meta image generator",
    "social media tools",
    "marketing automation",
    "SEO tools",
    "social preview generator",
    "website screenshot tool",
    "social media marketing",
    "link preview generator",
    "meta tag generator",
  ],
};

export function getMetadata({
  title,
  description,
  path = "",
  host,
  keywords = [],
}: GenerateMetadataProps): Metadata {
  const finalTitle = title
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.baseTitle;
  const finalDescription = description || defaultMetadata.baseDescription;
  const finalKeywords = [...defaultMetadata.baseKeywords, ...keywords];

  return {
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    openGraph: {
      title: finalTitle,
      description: finalDescription,
      type: "website",
      siteName: defaultMetadata.siteName,
      images: [
        {
          url: `https://www.snapog.com/api/get?api_key=${process.env.SNAP_OG_API_KEY}&url=${host}${path}&time=${Date.now()}`,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      creator: "@snapog",
    },
    alternates: {
      canonical: `https://${host}${path}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}
