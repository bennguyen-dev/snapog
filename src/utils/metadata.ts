import { Metadata } from "next";

interface GenerateMetadataProps {
  title?: string;
  description?: string;
  path?: string;
  host?: string | null;
  keywords?: string[];
}

interface GenerateSchemaProps extends GenerateMetadataProps {
  type?: "WebPage" | "Article" | "Organization" | "FAQPage";
  datePublished?: string;
  dateModified?: string;
  author?: string;
  mainEntity?: Array<{
    "@type": "Question";
    name: string;
    acceptedAnswer: {
      "@type": "Answer";
      text: string;
    };
  }>;
}

const defaultMetadata = {
  siteName: "SnapOG",
  baseTitle: "Automate your open-graph: Dynamic screenshots by URL, zero code",
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
  keywords = [],
}: GenerateMetadataProps): Metadata {
  const finalTitle = title
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.baseTitle;
  const finalDescription = description || defaultMetadata.baseDescription;
  const finalKeywords = [...defaultMetadata.baseKeywords, ...keywords];
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

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
          url: `https://${domain}/api/${process.env.SNAP_OG_API_KEY}?url=${domain}${path}&time=${Date.now()}`,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      url: `https://${domain}${path}`,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: finalDescription,
      creator: "@snapog_official",
    },
    alternates: {
      canonical: `https://${domain}${path}`,
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

export function generateSchema({
  title,
  description,
  path = "",
  type = "WebPage",
  datePublished,
  dateModified = new Date().toISOString(),
  author,
  mainEntity,
}: GenerateSchemaProps) {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";
  const finalTitle = title
    ? `${title} | ${defaultMetadata.siteName}`
    : defaultMetadata.baseTitle;
  const finalDescription = description || defaultMetadata.baseDescription;
  const url = `https://${domain}${path}`;

  const baseSchema = {
    "@context": "https://schema.org",
    "@type": type,
    name: finalTitle,
    description: finalDescription,
    url,
    image: `https://${domain}/api/${process.env.SNAP_OG_API_KEY}?url=${domain}${path}&time=${Date.now()}`,
  };

  if (type === "WebPage" || type === "Article") {
    return {
      ...baseSchema,
      ...(datePublished && { datePublished }),
      ...(dateModified && { dateModified }),
      ...(author && {
        author: {
          "@type": "Person",
          name: author,
        },
      }),
      publisher: {
        "@type": "Organization",
        name: defaultMetadata.siteName,
        url: `https://${domain}`,
      },
    };
  }

  if (type === "Organization") {
    return {
      ...baseSchema,
      logo: `https://${domain}/logo.png`,
      sameAs: [
        "https://twitter.com/snapog_official",
        "https://facebook.com/snapog.official",
        "https://instagram.com/snapog.official",
        // Add other social media URLs here
      ],
    };
  }

  if (type === "FAQPage") {
    return {
      ...baseSchema,
      mainEntity: mainEntity || [],
      ...(dateModified && { dateModified }),
      publisher: {
        "@type": "Organization",
        name: defaultMetadata.siteName,
        url: `https://${domain}`,
      },
    };
  }

  return baseSchema;
}
