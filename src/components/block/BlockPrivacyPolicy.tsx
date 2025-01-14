import { Typography } from "@/components/ui/typography";

const BlockPrivacyPolicy = () => {
  const domain = process.env.NEXT_PUBLIC_VERCEL_DOMAIN || "snapog.com";
  const effectiveDate = "January 14, 2025";

  return (
    <section
      id="privacy-policy"
      className="container flex max-w-screen-md scroll-mt-20 flex-col gap-6 py-8 sm:py-16"
    >
      <div className="text-center">
        <Typography variant="h2" className="mb-2">
          Privacy Policy
        </Typography>
        <Typography affects="muted" className="italic">
          Last updated: {effectiveDate}
        </Typography>
      </div>

      {/* Introduction */}
      <div className="space-y-4">
        <Typography variant="h3">1. Introduction</Typography>
        <Typography>
          Welcome to SnapOG. We respect your privacy and are committed to
          protecting your personal data. This privacy policy explains how we
          collect, use, and safeguard your information when you use our services
          at https://{domain}.
        </Typography>
      </div>

      {/* Information We Collect */}
      <div className="space-y-4">
        <Typography variant="h3">2. Information We Collect</Typography>
        <Typography>We collect the following types of information:</Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>
              <span className="font-semibold">Account Information:</span> Email
              address, name, and password when you create an account
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">Usage Data:</span> Information
              about how you use our service, including websites you submit for
              OG image generation
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">Technical Data:</span> IP address,
              browser type, device information, and cookies
            </Typography>
          </li>
          <li>
            <Typography>
              <span className="font-semibold">Payment Information:</span> When
              you subscribe to our paid services (processed securely through our
              payment providers)
            </Typography>
          </li>
        </ul>
      </div>

      {/* How We Use Your Information */}
      <div className="space-y-4">
        <Typography variant="h3">3. How We Use Your Information</Typography>
        <Typography>
          We use your information for the following purposes:
        </Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>
              To provide and maintain our OG image generation service
            </Typography>
          </li>
          <li>
            <Typography>
              To process your payments and manage your subscription
            </Typography>
          </li>
          <li>
            <Typography>To improve and optimize our service</Typography>
          </li>
          <li>
            <Typography>
              To communicate with you about service updates and changes
            </Typography>
          </li>
          <li>
            <Typography>To prevent fraud and ensure security</Typography>
          </li>
        </ul>
      </div>

      {/* Data Storage and Security */}
      <div className="space-y-4">
        <Typography variant="h3">4. Data Storage and Security</Typography>
        <Typography>
          We implement appropriate technical and organizational measures to
          protect your personal data. Your information is stored securely in
          data centers located in the United States. We retain your data only
          for as long as necessary to provide our services or comply with legal
          obligations.
        </Typography>
      </div>

      {/* Your Rights */}
      <div className="space-y-4">
        <Typography variant="h3">5. Your Rights</Typography>
        <Typography>
          You have the following rights regarding your personal data:
        </Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>Access and receive a copy of your data</Typography>
          </li>
          <li>
            <Typography>Correct or update your information</Typography>
          </li>
          <li>
            <Typography>Request deletion of your personal data</Typography>
          </li>
          <li>
            <Typography>
              Object to or restrict processing of your data
            </Typography>
          </li>
          <li>
            <Typography>Data portability</Typography>
          </li>
        </ul>
      </div>

      {/* Third-Party Services */}
      <div className="space-y-4">
        <Typography variant="h3">6. Third-Party Services</Typography>
        <Typography>We use trusted third-party services for:</Typography>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <Typography>Payment processing</Typography>
          </li>
          <li>
            <Typography>Analytics</Typography>
          </li>
          <li>
            <Typography>Email communications</Typography>
          </li>
        </ul>
        <Typography>
          These services may collect and process your data according to their
          own privacy policies. We ensure our partners maintain similar levels
          of data protection.
        </Typography>
      </div>

      {/* Cookie Policy */}
      <div className="space-y-4">
        <Typography variant="h3">7. Cookie Policy</Typography>
        <Typography>
          We use cookies and similar tracking technologies to improve your
          experience on our website. You can control cookies through your
          browser settings, although disabling certain cookies may limit your
          ability to use some features.
        </Typography>
      </div>

      {/* Changes to Privacy Policy */}
      <div className="space-y-4">
        <Typography variant="h3">8. Changes to Privacy Policy</Typography>
        <Typography>
          We may update this privacy policy from time to time. We will notify
          you of any significant changes by posting the new policy on this page
          and updating the "Last updated" date.
        </Typography>
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <Typography variant="h3">9. Contact Us</Typography>
        <Typography>
          If you have any questions about this privacy policy or our practices,
          please contact us at{" "}
          <a
            href="mailto:ben.nguyen@snapog.com"
            className="text-primary hover:underline"
          >
            ben.nguyen@snapog.com
          </a>
        </Typography>
      </div>

      <Typography className="italic text-muted-foreground">
        This policy is effective as of {effectiveDate}
      </Typography>
    </section>
  );
};

export default BlockPrivacyPolicy;
