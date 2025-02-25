import { Code } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CodeBlock } from "@/components/ui/code-block";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Typography } from "@/components/ui/typography";
import { getSnippetHowToUse } from "@/utils";

const BlockDocs = () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <section className="container max-w-screen-lg py-8 sm:py-16">
      <div className="mb-8 flex items-center justify-center gap-2">
        <Code className="h-8 w-8 text-primary" />
        <Typography variant="h1" className="text-center">
          API Documentation
        </Typography>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <Typography variant="h2">Getting Started</Typography>
        </CardHeader>
        <CardContent>
          <Typography>
            SnapOG provides a simple API to generate Open Graph images for your
            web pages. To get started, you'll need an API key which you can
            obtain from your dashboard after signing up.
          </Typography>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <Typography variant="h3" className="text-primary">
            Base URL
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography className="mb-4">
            All API requests should be made to:
          </Typography>
          <CodeBlock
            language="bash"
            filename="Base URL"
            code={`https://${domain}`}
          />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <Typography variant="h3" className="text-primary">
            Authentication
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography className="mb-4">
            All API requests require an API key which should be included in the
            URL path.
          </Typography>
          <CodeBlock
            language="bash"
            filename="Authentication"
            code={`/api/{apiKey}?url=your-url`}
          />
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <Typography variant="h3" className="text-primary">
            Endpoints
          </Typography>
        </CardHeader>
        <CardContent>
          <Typography className="mb-4">
            Generate an Open Graph image for a specific URL.
          </Typography>

          {/* HTTP Request */}
          <div className="mb-6">
            <Typography variant="h4" className="mb-2 text-primary/80">
              HTTP Request
            </Typography>
            <CodeBlock
              language="bash"
              filename="HTTP Request"
              code={`GET /api/{apiKey}`}
            />
          </div>

          {/* Parameters */}
          <div className="mb-6">
            <Typography variant="h4" className="mb-2 text-primary/80">
              Parameters
            </Typography>
            <div className="overflow-hidden rounded-md border">
              <Table>
                <TableHeader className="bg-muted/50 font-semibold">
                  <TableRow>
                    <TableHead>Parameter</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Required</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Typography variant="code">url</Typography>
                    </TableCell>
                    <TableCell>Query Parameter</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>The URL to generate an OG image for</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Example Request */}
          <div className="mb-6">
            <Typography variant="h4" className="mb-2 text-primary/80">
              Example Request
            </Typography>
            <CodeBlock
              language="bash"
              filename="Example Request"
              code={`curl -X GET "https://${domain}/api/{apiKey}?url=example.com/page" -H "Accept: image/png"`}
            />
          </div>

          {/* Example Usage in HTML */}
          <div className="mb-6">
            <Typography variant="h4" className="mb-2 text-primary/80">
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
            <Typography variant="h4" className="mb-2 text-primary/80">
              Response
            </Typography>
            <Typography>
              The API returns a PNG image if successful. In case of an error, it
              returns a JSON response with an error message.
            </Typography>
          </div>
        </CardContent>
      </Card>

      {/* Integration Examples */}
      <div className="mb-8">
        <Typography variant="h2" className="mb-4 pb-4">
          Integration Examples
        </Typography>

        {/* Next.js Integration */}
        <Card className="mb-8">
          <CardHeader>
            <Typography
              variant="h4"
              className="flex items-center gap-2 text-primary"
            >
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              Next.js
            </Typography>
          </CardHeader>
          <CardContent>
            <Typography className="mb-4">
              For detailed instructions on setting up Open Graph images in
              Next.js, refer to the official documentation:{" "}
              <a
                className="text-primary underline underline-offset-4 hover:text-primary/90"
                href="https://nextjs.org/docs/14/app/building-your-application/optimizing/metadata"
                target="_blank"
                rel="noopener noreferrer"
              >
                Next.js Metadata
              </a>
            </Typography>

            <div className="space-y-4">
              {/* Step 1 */}
              <div>
                <Typography
                  variant="h5"
                  className="mb-2 text-sm font-medium text-muted-foreground"
                >
                  Step 1: Set up middleware to track current path
                </Typography>
                <CodeBlock
                  language="typescript"
                  filename="src/middleware.ts"
                  code={`import { NextRequest, NextResponse } from "next/server";
              
export default function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("x-current-path", request.nextUrl.pathname);

  return response;
}
                `}
                />
              </div>

              {/* Step 2 */}
              <div>
                <Typography
                  variant="h5"
                  className="mb-2 text-sm font-medium text-muted-foreground"
                >
                  Step 2: Configure Open Graph metadata
                </Typography>
                <CodeBlock
                  language="typescript"
                  filename="src/app/layout.tsx"
                  code={`export async function generateMetadata() {
  const headersList = headers();
  const pathname = headersList.get("x-current-path");
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN;
  const apiKey = process.env.SNAP_OG_API_KEY;

  return {
    ...,
    openGraph: {
      ...,
      images: [
        {
          url: 'https://${domain}/api/\${apiKey}?url=\${domain}\${pathname}',
          width: 1200,
          height: 630,
        },
      ],
    },
  }
}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <Typography
              variant="h4"
              className="flex items-center gap-2 text-primary"
            >
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              WordPress
            </Typography>
          </CardHeader>
          <CardContent>
            <Typography className="mb-4">
              There are two ways to integrate SnapOG with WordPress: using an
              SEO plugin or manually adding the code to your theme.
            </Typography>

            <div className="space-y-6">
              {/* Method 1 */}
              <div>
                <Typography variant="h5" className="mb-2 text-primary/80">
                  Method 1: Using an SEO Plugin
                </Typography>
                <div className="mb-4 rounded-md bg-muted/30 p-4">
                  <Typography className="text-sm text-muted-foreground">
                    Add this code to your theme's functions.php file to
                    integrate with Yoast SEO or Rank Math
                  </Typography>
                </div>
                <CodeBlock
                  language="php"
                  filename="functions.php"
                  code={`/**
 * Override OpenGraph image URLs with SnapOG API
 */
function snapog_override_opengraph($og_tags) {
    // Get current page URL path
    $current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
    
    // API configuration
    $domain = $_SERVER['HTTP_HOST'];
    $api_key = defined('SNAP_OG_API_KEY') ? SNAP_OG_API_KEY : 'YOUR_API_KEY';
    
    // Generate the OG image URL
    $og_image_url = "https://${domain}/api/{$api_key}?url={$domain}{$current_path}";
    
    // For Yoast SEO
    if (function_exists('wpseo_init')) {
        add_filter('wpseo_opengraph_image', function() use ($og_image_url) {
            return $og_image_url;
        });
        add_filter('wpseo_opengraph_image_size', function() {
            return ['width' => 1200, 'height' => 630];
        });
    }
    
    // For Rank Math
    if (class_exists('RankMath')) {
        add_filter('rank_math/opengraph/facebook/image', function() use ($og_image_url) {
            return $og_image_url;
        });
        add_filter('rank_math/opengraph/twitter/image', function() use ($og_image_url) {
            return $og_image_url;
        });
    }
    
    return $og_tags;
}
add_action('wp_head', 'snapog_override_opengraph', 9);
`}
                />
                <div className="mt-4">
                  <Typography className="mb-2 text-sm font-medium">
                    Security Tip: Add your API key to wp-config.php
                  </Typography>
                  <CodeBlock
                    language="php"
                    filename="wp-config.php"
                    code={`define('SNAP_OG_API_KEY', 'your-api-key-here');`}
                  />
                </div>
              </div>

              {/* Method 2 */}
              <div>
                <Typography variant="h5" className="mb-2 text-primary/80">
                  Method 2: Manual Integration
                </Typography>
                <div className="mb-4 rounded-md bg-muted/30 p-4">
                  <Typography className="text-sm text-muted-foreground">
                    Add this code to your theme's header.php file within the
                    &lt;head&gt; section
                  </Typography>
                </div>
                <CodeBlock
                  language="php"
                  filename="header.php"
                  code={`<?php
// Get current page URL path
$current_path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$domain = $_SERVER['HTTP_HOST'];
$api_key = defined('SNAP_OG_API_KEY') ? SNAP_OG_API_KEY : 'YOUR_API_KEY';

// Generate the OG image URL
$og_image_url = "https://${domain}/api/{$api_key}?url={$domain}{$current_path}";
?>

<!-- OpenGraph Tags -->
<meta property="og:image" content="<?php echo esc_url($og_image_url); ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shopify Integration (hidden by default with display:none) */}
        <Card>
          <CardHeader>
            <Typography
              variant="h4"
              className="flex items-center gap-2 text-primary"
            >
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              Shopify
            </Typography>
          </CardHeader>
          <CardContent>
            <Typography className="mb-4">
              Integrate SnapOG into your Shopify store by editing your theme.
            </Typography>

            <div className="space-y-6">
              {/* Theme Edit Instructions */}
              <div>
                <Typography variant="h5" className="mb-2 text-primary/80">
                  Edit Your Theme's Layout File
                </Typography>
                <div className="mb-4 rounded-md bg-muted/30 p-4">
                  <ol className="list-inside list-decimal space-y-2 text-sm">
                    <li>
                      From your Shopify admin, go to{" "}
                      <strong>Online Store</strong> &gt; <strong>Themes</strong>
                    </li>
                    <li>
                      Click <strong>Actions</strong> &gt;{" "}
                      <strong>Edit code</strong> for your active theme
                    </li>
                    <li>
                      Under the Layout directory, open{" "}
                      <strong>theme.liquid</strong>
                    </li>
                    <li>
                      Find the <code>&lt;head&gt;</code> section and add the
                      code below
                    </li>
                  </ol>
                </div>
                <CodeBlock
                  language="liquid"
                  filename="theme.liquid"
                  code={`{% assign current_path = request.path %}
{% assign domain = shop.domain %}
{% assign api_key = 'YOUR_SNAP_OG_API_KEY' %}
{% assign og_image_url = 'https://${domain}/api/' | append: api_key | append: '?url=' | append: domain | append: current_path %}

<meta property="og:image" content="{{ og_image_url }}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`}
                />
              </div>

              {/* Security Instructions */}
              <div>
                <Typography variant="h5" className="mb-2 text-primary/80">
                  Store Your API Key Securely
                </Typography>
                <div className="mb-4 rounded-md bg-muted/30 p-4">
                  <Typography className="text-sm text-muted-foreground">
                    For better security, use Shopify theme settings to store
                    your API key
                  </Typography>
                </div>
                <Typography className="mb-2 text-sm">
                  1. Create settings schema in your config file:
                </Typography>
                <CodeBlock
                  language="json"
                  filename="config/settings_schema.json"
                  code={`{
  "name": "API Settings",
  "settings": [
    {
      "type": "text",
      "id": "snap_og_api_key",
      "label": "SnapOG API Key"
    }
  ]
}`}
                />
                <Typography className="!mt-4 mb-2 text-sm">
                  2. Update your Liquid code to use the theme setting:
                </Typography>
                <CodeBlock
                  language="liquid"
                  filename="theme.liquid"
                  code={`{% assign api_key = settings.snap_og_api_key %}`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Typography variant="h3" className="text-primary">
              Legacy Endpoint
            </Typography>
          </CardHeader>
          <CardContent>
            <Typography className="mb-4">
              For backward compatibility, the old endpoint{" "}
              <Typography variant="code">/api/get</Typography> is still
              supported but we recommend using the new endpoint for new
              integrations.
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Typography variant="h3" className="text-primary">
              Best Practices
            </Typography>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></div>
                <span>
                  Always URL encode the url parameter to ensure proper handling
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></div>
                <span>
                  Consider caching the generated images on your end for better
                  performance
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></div>
                <span>
                  Test your OpenGraph images with the{" "}
                  <a
                    href="https://developers.facebook.com/tools/debug/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Facebook Sharing Debugger
                  </a>{" "}
                  and{" "}
                  <a
                    href="https://cards-dev.twitter.com/validator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline underline-offset-2"
                  >
                    Twitter Card Validator
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <div className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary"></div>
                <span>
                  Ensure your platform is configured to use the proper meta tags
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Error Codes */}
      <Card className="mb-8">
        <CardHeader>
          <Typography variant="h2" className="text-primary">
            Error Codes
          </Typography>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader className="bg-muted/50 font-semibold">
                <TableRow>
                  <TableHead>Error code</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="code"
                      className="bg-destructive/10 text-destructive"
                    >
                      400
                    </Typography>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <span className="text-destructive">
                      Missing URL or API key
                    </span>
                    <span className="text-muted-foreground">or</span>
                    <span className="text-destructive">
                      Insufficient credits
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="code"
                      className="bg-destructive/10 text-destructive"
                    >
                      401
                    </Typography>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <span className="text-destructive">Invalid API key</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="code"
                      className="bg-destructive/10 text-destructive"
                    >
                      404
                    </Typography>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <span className="text-destructive">Invalid URL</span>
                    <span className="text-muted-foreground">or</span>
                    <span className="text-destructive">Domain not found</span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>
                    <Typography
                      variant="code"
                      className="bg-destructive/10 text-destructive"
                    >
                      500
                    </Typography>
                  </TableCell>
                  <TableCell className="flex flex-wrap gap-2">
                    <span className="text-destructive">
                      Internal server error
                    </span>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default BlockDocs;
