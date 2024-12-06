import { headers } from "next/headers";

import { Typography } from "@/components/ui/typography";

export const BlockPrivacyPolicy = () => {
  const headersList = headers();

  const host = headersList.get("host");
  return (
    <section
      id="privacy-policy"
      className="container flex max-w-screen-md scroll-mt-20 flex-col gap-4 py-8 sm:py-16"
    >
      <Typography variant="h2" className="mb-2 text-center">
        Privacy Policy
      </Typography>
      <Typography>
        Your privacy is important to us. It is snap OG's policy to respect your
        privacy regarding any information we may collect from you across our
        website, https:{host}, and other sites we own and operate.
      </Typography>
      <Typography>
        We only ask for personal information when we truly need it to provide a
        service to you. We collect it by fair and lawful means, with your
        knowledge and consent. We also let you know why we're collecting it and
        how it will be used.
      </Typography>
      <Typography>
        We only retain collected information for as long as necessary to provide
        you with your requested service. What data we store, we'll protect
        within commercially acceptable means to prevent loss and theft, as well
        as unauthorised access, disclosure, copying, use or modification.
      </Typography>
      <Typography>
        We don't share any personally identifying information publicly or with
        third-parties, except when required to by law.
      </Typography>
      <Typography>
        Our website may link to external sites that are not operated by us.
        Please be aware that we have no control over the content and practices
        of these sites, and cannot accept responsibility or liability for their
        respective privacy policies.
      </Typography>
      <Typography>
        You are free to refuse our request for your personal information, with
        the understanding that we may be unable to provide you with some of your
        desired services.
      </Typography>
      <Typography>
        Your continued use of our website will be regarded as acceptance of our
        practices around privacy and personal information. If you have any
        questions about how we handle user data and personal information, feel
        free to contact us.
      </Typography>
      <Typography>This policy is effective as of 13 May 2024.</Typography>
    </section>
  );
};
