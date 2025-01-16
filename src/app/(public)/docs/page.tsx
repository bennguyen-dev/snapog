import { Code } from "lucide-react";

import dynamic from "next/dynamic";

import { CodeBlock } from "@/components/ui/code-block";
import { Typography } from "@/components/ui/typography";
import { generateSchema, getMetadata } from "@/utils/metadata";

export const runtime = "edge";

const DynamicBlockGetStartedNow = dynamic(
  () => import("@/components/block/BlockGetStartedNow"),
);

export async function generateMetadata() {
  return getMetadata({
    title: "API Documentation - SnapOG",
    description:
      "Learn how to use SnapOG's API to generate dynamic Open Graph images for your website. Simple integration with just a URL parameter.",
    path: "/docs",
    keywords: [
      "SnapOG API",
      "API documentation",
      "OG image API",
      "integration guide",
      "API reference",
    ],
  });
}

const schema = generateSchema({
  type: "WebPage",
  title: "API Documentation - SnapOG",
  description:
    "Learn how to use SnapOG's API to generate dynamic Open Graph images for your website. Simple integration with just a URL parameter.",
  path: "/docs",
});

export default function DocsPage() {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <main className="container max-w-screen-lg py-8 sm:py-16">
        <div className="mb-12 flex items-center justify-center gap-2">
          <Code className="h-8 w-8 text-primary" />
          <Typography variant="h1" className="text-center">
            API Documentation
          </Typography>
        </div>

        {/* Getting Started */}
        <section className="mb-12">
          <Typography variant="h2" className="mb-4">
            Getting Started
          </Typography>
          <Typography className="mb-4">
            SnapOG provides a simple API to generate Open Graph images for your
            web pages. To get started, you'll need an API key which you can
            obtain from your dashboard after signing up.
          </Typography>
        </section>

        {/* Base URL */}
        <section className="mb-8">
          <Typography variant="h3" className="mb-4">
            Base URL
          </Typography>
          <Typography className="mb-4">
            All API requests should be made to:
          </Typography>
          <CodeBlock
            language="bash"
            filename="Base URL"
            code={`https://${domain}`}
          />
        </section>

        {/* Authentication */}
        <section className="mb-8">
          <Typography variant="h3" className="mb-4">
            Authentication
          </Typography>
          <Typography className="mb-4">
            All API requests require an API key which should be included in the
            URL path.
          </Typography>
          <CodeBlock
            language="bash"
            filename="Authentication"
            code={`/api/{apiKey}?url=your-url`}
          />
        </section>

        {/* Endpoints */}
        <section className="mb-8">
          <Typography variant="h3" className="mb-4">
            Endpoints
          </Typography>
          <Typography className="mb-4">
            Generate an Open Graph image for a specific URL.
          </Typography>
          <div className="mb-4">
            <Typography variant="h4" className="mb-2">
              HTTP Request
            </Typography>
            <CodeBlock
              language="bash"
              filename="HTTP Request"
              code={`GET /api/{apiKey}`}
            />
          </div>

          <div className="mb-4">
            <Typography variant="h4" className="mb-2">
              Parameters
            </Typography>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="border-b p-2 text-left">Parameter</th>
                    <th className="border-b p-2 text-left">Type</th>
                    <th className="border-b p-2 text-left">Required</th>
                    <th className="border-b p-2 text-left">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">
                      <Typography variant="code">url</Typography>
                    </td>
                    <td className="py-2">Query Parameter</td>
                    <td className="py-2">Yes</td>
                    <td className="py-2">
                      The URL to generate an OG image for
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-4">
            <Typography variant="h4" className="mb-2">
              Example Request
            </Typography>
            <CodeBlock
              language="bash"
              filename="cURL Example"
              code={`curl -X GET "https://${domain}/api/{apiKey}?url=example.com/page" -H "Accept: image/png"`}
            />
          </div>

          <div className="mb-4">
            <Typography variant="h4" className="mb-2">
              Example Usage in HTML
            </Typography>
            <CodeBlock
              language="html"
              filename="HTML Example"
              code={`<meta property="og:image" content="https://${domain}/api/{apiKey}?url=example.com/page" />`}
            />
          </div>

          <div>
            <Typography variant="h4" className="mb-2">
              Response
            </Typography>
            <Typography className="mb-4">
              The API returns a PNG image if successful. In case of an error, it
              returns a JSON response with an error message.
            </Typography>
          </div>
        </section>

        {/* Legacy Endpoint */}
        <section className="mb-8">
          <Typography variant="h3" className="mb-4">
            Legacy Endpoint
          </Typography>
          <Typography className="mb-4">
            For backward compatibility, the old endpoint{" "}
            <Typography variant="code">/api/get</Typography> is still supported
            but we recommend using the new endpoint for new integrations.
          </Typography>
        </section>

        {/* Best Practices */}
        <section className="mb-8">
          <Typography variant="h3" className="mb-4">
            Best Practices
          </Typography>
          <ul className="list-inside list-disc space-y-2">
            <li>
              Always URL encode the url parameter to ensure proper handling
            </li>
            <li>
              Consider caching the generated images on your end for better
              performance
            </li>
          </ul>
        </section>

        {/* Error Codes */}
        <section className="mb-12">
          <Typography variant="h2" className="mb-4">
            Error Codes
          </Typography>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Status Code</th>
                  <th className="py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2">400</td>
                  <td className="py-2">Missing URL or API key</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">401</td>
                  <td className="py-2">Invalid API key</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">404</td>
                  <td className="py-2">URL not found or inaccessible</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2">500</td>
                  <td className="py-2">Internal server error</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <DynamicBlockGetStartedNow />
    </>
  );
}
