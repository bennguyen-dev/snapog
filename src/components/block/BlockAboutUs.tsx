import Link from "next/link";

import { Typography } from "@/components/ui/typography";

const BlockAboutUs = () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <section className="container flex max-w-screen-md scroll-mt-20 flex-col gap-8 py-8 sm:py-16">
      {/* Header Section */}
      <div className="text-center">
        <Typography variant="h2" className="mb-4">
          About SnapOG
        </Typography>
        <Typography className="text-lg text-muted-foreground">
          Revolutionizing Social Media Presence Through Automated OG Image
          Generation
        </Typography>
      </div>

      {/* Mission Section */}
      <div className="space-y-4">
        <Typography variant="h3">Our Mission</Typography>
        <Typography>
          At SnapOG, we're on a mission to transform how websites appear on
          social media. We believe that every shared link deserves to make a
          powerful first impression, which is why we've built an intelligent
          platform that automatically generates stunning Open Graph images for
          your content.
        </Typography>
      </div>

      {/* What We Do Section */}
      <div className="space-y-4">
        <Typography variant="h3">What We Do</Typography>
        <Typography>
          We specialize in automated Open Graph (OG) image generation, helping
          businesses and developers optimize their social media presence. Our
          platform offers:
        </Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>
              <span className="font-semibold">Automated Generation:</span>{" "}
              Create professional OG images automatically for all your web pages
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">Real-time Updates:</span> Images
              that stay in sync with your content changes
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">Brand Consistency:</span> Maintain
              your brand identity across all social platforms
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">Performance Optimization:</span>{" "}
              Fast generation and delivery through our global CDN
            </Typography>
          </li>
        </ul>
      </div>

      {/* Why Choose Us Section */}
      <div className="space-y-4">
        <Typography variant="h3">Why Choose SnapOG</Typography>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Typography variant="h4" className="text-primary">
              Developer-First
            </Typography>
            <Typography>
              Built by developers for developers, with easy integration and
              comprehensive API documentation.
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="h4" className="text-primary">
              Scalable Solution
            </Typography>
            <Typography>
              Handle millions of image generations with our robust
              infrastructure and global CDN.
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="h4" className="text-primary">
              Customizable
            </Typography>
            <Typography>
              Flexible templates and styling options to match your brand
              perfectly.
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="h4" className="text-primary">
              Cost-Effective
            </Typography>
            <Typography>
              Competitive pricing with plans that scale with your needs.
            </Typography>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-4">
        <Typography variant="h3">Our Team</Typography>
        <Typography>
          Led by experienced developers and designers, our team is passionate
          about creating tools that make web development easier and more
          effective. We're based in Silicon Valley with team members around the
          globe, bringing diverse perspectives to solve complex challenges.
        </Typography>
      </div>

      {/* Contact Section */}
      <div className="space-y-4">
        <Typography variant="h3">Get in Touch</Typography>
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="space-y-2">
            <Typography variant="h4" className="text-primary">
              General Inquiries
            </Typography>
            <Typography>
              <a
                href="mailto:ben.nguyen@snapog.com"
                className="text-primary hover:underline"
              >
                ben.nguyen@snapog.com
              </a>
            </Typography>
          </div>
          <div className="space-y-2">
            <Typography variant="h4" className="text-primary">
              Visit Our Website
            </Typography>
            <Typography>
              <Link
                href={`https://${domain}`}
                className="text-primary hover:underline"
                target="_blank"
              >
                {domain}
              </Link>
            </Typography>
          </div>
        </div>
      </div>

      {/* Social Impact */}
      <div className="space-y-4">
        <Typography variant="h3">Our Impact</Typography>
        <Typography>
          We're proud to help thousands of websites improve their social media
          presence, resulting in increased engagement and better brand
          recognition. Our automated solution has generated millions of OG
          images, saving developers countless hours of manual work.
        </Typography>
      </div>
    </section>
  );
};

export default BlockAboutUs;
