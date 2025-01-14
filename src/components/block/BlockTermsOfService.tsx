import { Typography } from "@/components/ui/typography";

const BlockTermsOfService = () => {
  const effectiveDate = "January 14, 2025";
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";

  return (
    <section className="container flex max-w-screen-md scroll-mt-20 flex-col gap-8 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center">
        <Typography variant="h2" className="mb-2">
          Terms of Service
        </Typography>
        <Typography affects="muted" className="italic">
          Last updated: {effectiveDate}
        </Typography>
      </div>

      {/* Introduction */}
      <div className="space-y-4">
        <Typography variant="h3">1. Introduction</Typography>
        <Typography>
          Welcome to SnapOG. These Terms of Service ("Terms") govern your access
          to and use of SnapOG's website, services, and products. By using our
          services, you agree to be bound by these Terms. If you disagree with
          any part of the Terms, you may not access our services.
        </Typography>
      </div>

      {/* Definitions */}
      <div className="space-y-4">
        <Typography variant="h3">2. Definitions</Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>
              <span className="font-semibold">"Service"</span> refers to the
              SnapOG platform, accessible at https://{domain}
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">"User"</span> refers to any
              individual or entity that uses our Service
            </Typography>
          </li>
          l
          <li>
            <Typography>
              <span className="font-semibold">"OG Images"</span> refers to the
              Open Graph images generated through our Service
            </Typography>
          </li>
        </ul>
      </div>

      {/* Account Terms */}
      <div className="space-y-4">
        <Typography variant="h3">3. Account Terms</Typography>
        <Typography>
          You are responsible for maintaining the security of your account and
          password. SnapOG cannot and will not be liable for any loss or damage
          from your failure to comply with this security obligation. You are
          responsible for all content posted and activity that occurs under your
          account.
        </Typography>
      </div>

      {/* Service Terms */}
      <div className="space-y-4">
        <Typography variant="h3">4. Service Terms</Typography>
        <Typography>
          Our Service allows you to generate Open Graph images automatically.
          You agree to use the Service only as permitted by law, including
          applicable copyright and trademark laws.
        </Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>
              You may not use the Service for any illegal or unauthorized
              purpose
            </Typography>
          </li>
          <li>
            <Typography>
              You may not interfere with or disrupt the Service or servers
            </Typography>
          </li>
          <li>
            <Typography>
              You may not exceed your plan's usage limits without upgrading
            </Typography>
          </li>
        </ul>
      </div>

      {/* Payment Terms */}
      <div className="space-y-4">
        <Typography variant="h3">5. Payment and Subscription</Typography>
        <Typography>
          Some aspects of the Service are provided for a fee. You agree to pay
          all fees associated with your selected plan. Fees are non-refundable
          except as required by law or as explicitly stated in these Terms.
        </Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>
              Subscription fees are billed in advance on a monthly or annual
              basis
            </Typography>
          </li>
          <li>
            <Typography>
              Refunds may be issued within 14 days of purchase if credits remain
              unused
            </Typography>
          </li>
          <li>
            <Typography>
              You may cancel your subscription at any time, but no refunds will
              be issued for partial subscription periods
            </Typography>
          </li>
        </ul>
      </div>

      {/* API Usage */}
      <div className="space-y-4">
        <Typography variant="h3">6. API Usage and Rate Limits</Typography>
        <Typography>
          Our Service includes API access subject to rate limits based on your
          subscription plan. You agree not to exceed these limits or attempt to
          circumvent them. We reserve the right to modify these limits at any
          time.
        </Typography>
      </div>

      {/* Intellectual Property */}
      <div className="space-y-4">
        <Typography variant="h3">7. Intellectual Property Rights</Typography>
        <Typography>
          The Service and its original content (excluding content provided by
          users) are and will remain the exclusive property of SnapOG and its
          licensors. Our Service is protected by copyright, trademark, and other
          laws.
        </Typography>
      </div>

      {/* Disclaimer */}
      <div className="space-y-4">
        <Typography variant="h3">8. Disclaimer and Limitations</Typography>
        <Typography>
          The Service is provided "as is" without warranty of any kind, either
          express or implied. In no event shall SnapOG be liable for any
          indirect, incidental, special, consequential or punitive damages,
          including without limitation, loss of profits, data, use, goodwill, or
          other intangible losses.
        </Typography>
      </div>

      {/* Changes to Terms */}
      <div className="space-y-4">
        <Typography variant="h3">9. Changes to Terms</Typography>
        <Typography>
          We reserve the right to modify or replace these Terms at any time. If
          a revision is material, we will provide at least 30 days' notice prior
          to any new terms taking effect. What constitutes a material change
          will be determined at our sole discretion.
        </Typography>
      </div>

      {/* Governing Law */}
      <div className="space-y-4">
        <Typography variant="h3">10. Governing Law</Typography>
        <Typography>
          These Terms shall be governed by and construed in accordance with the
          laws of Wyoming, United States, without regard to its conflict of law
          provisions. Our failure to enforce any right or provision of these
          Terms will not be considered a waiver of those rights.
        </Typography>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <Typography variant="h3">11. Contact Us</Typography>
        <Typography>
          If you have any questions about these Terms, please contact us at{" "}
          <a
            href="mailto:ben.nguyen@snapog.com"
            className="text-primary hover:underline"
          >
            ben.nguyen@snapog.com
          </a>
        </Typography>
      </div>
    </section>
  );
};

export default BlockTermsOfService;
