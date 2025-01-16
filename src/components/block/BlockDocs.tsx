import { Code } from "lucide-react";

import { CodeBlock } from "@/components/ui/code-block";
import { Typography } from "@/components/ui/typography";
import { getSnippetHowToUse } from "@/utils";

const BlockDocs = () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <section className="container max-w-screen-lg py-8 sm:py-16">
      <div className="mb-12 flex items-center justify-center gap-2">
        <Code className="h-8 w-8 text-primary" />
        <Typography variant="h1" className="text-center">
          API Documentation
        </Typography>
      </div>

      <div className="mb-12">
        <Typography variant="h2" className="mb-4">
          Getting Started
        </Typography>
        <Typography className="mb-4">
          SnapOG provides a simple API to generate Open Graph images for your
          web pages. To get started, you'll need an API key which you can obtain
          from your dashboard after signing up.
        </Typography>
      </div>

      <div className="mb-8">
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
      </div>

      <div className="mb-8">
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
      </div>

      <div className="mb-8">
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
                  <td className="py-2">The URL to generate an OG image for</td>
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
            filename="Example Request"
            code={`curl -X GET "https://${domain}/api/{apiKey}?url=example.com/page" -H "Accept: image/png"`}
          />
        </div>

        <div className="mb-4">
          <Typography variant="h4" className="mb-2">
            Example Usage in HTML
          </Typography>
          <CodeBlock
            language="html"
            filename="index.html"
            code={getSnippetHowToUse({
              host: domain,
              domain: "yourwebsite.com",
              apiKey: "{apiKey}",
            })}
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
      </div>

      <div className="mb-8">
        <Typography variant="h3" className="mb-4">
          Legacy Endpoint
        </Typography>
        <Typography className="mb-4">
          For backward compatibility, the old endpoint{" "}
          <Typography variant="code">/api/get</Typography> is still supported
          but we recommend using the new endpoint for new integrations.
        </Typography>
      </div>

      <div className="mb-8">
        <Typography variant="h3" className="mb-4">
          Best Practices
        </Typography>
        <ul className="list-inside list-disc space-y-2">
          <li>Always URL encode the url parameter to ensure proper handling</li>
          <li>
            Consider caching the generated images on your end for better
            performance
          </li>
        </ul>
      </div>

      <div className="mb-12">
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
                <td className="py-2">
                  <Typography
                    variant="code"
                    className="bg-destructive/10 text-destructive"
                  >
                    400
                  </Typography>
                </td>
                <td className="py-2">
                  <Typography className="mr-2 inline text-destructive">
                    Missing URL or API key
                  </Typography>
                  ||
                  <Typography className="ml-2 inline text-destructive">
                    Insufficient credits
                  </Typography>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">
                  <Typography
                    variant="code"
                    className="bg-destructive/10 text-destructive"
                  >
                    401
                  </Typography>
                </td>
                <td className="py-2">
                  <Typography className="text-destructive">
                    Invalid API key
                  </Typography>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">
                  <Typography
                    variant="code"
                    className="bg-destructive/10 text-destructive"
                  >
                    404
                  </Typography>
                </td>
                <td className="py-2">
                  <Typography className="mr-2 inline text-destructive">
                    Invalid URL
                  </Typography>
                  ||
                  <Typography className="ml-2 inline text-destructive">
                    Domain not found
                  </Typography>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">
                  <Typography
                    variant="code"
                    className="bg-destructive/10 text-destructive"
                  >
                    500
                  </Typography>
                </td>
                <td className="py-2">
                  <Typography className="text-destructive">
                    Internal server error
                  </Typography>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BlockDocs;
