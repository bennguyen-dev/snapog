import { Typography } from "@/components/ui/typography";

export const BlockTermsOfService = () => {
  return (
    <section
      id="terms-of-service"
      className="container flex max-w-screen-md scroll-mt-20 flex-col gap-4 py-8 sm:py-16"
    >
      <Typography variant="h2" className="mb-2 text-center">
        Terms of Service
      </Typography>
      <Typography>
        1. Introduction <br />
        By using SnapOG you confirm your acceptance of, and agree to be bound
        by, these terms and conditions.
      </Typography>
      <Typography>
        2. Agreement to Terms and Conditions <br />
        This Agreement takes effect on the date on which you first use the
        SnapOG application.
      </Typography>
      <Typography>
        3. Premium features <br />
        You will be able to use all the premium features after you subscribe to
        a paid plan. The details of the premium features are available on the
        pricing page.
      </Typography>
      <Typography>
        4. Refund Policy <br />
        We allow refunds within 14 days of purchase only if your credits are
        unused for the billing period. Please contact us to request a refund.
      </Typography>
      <Typography>
        5. Product usage <br />
        By using SnapOG, you agree to receive important product updates from
        SnapOG via the email you used to register your account. You can opt-out
        of these product updates anytime by clicking the "Unsubscribe" link at
        the bottom of each email. We only send important product updates.
      </Typography>
      <Typography>
        6. Disclaimer <br />
        It is not warranted that SnapOG will meet your requirements or that its
        operation will be uninterrupted or error free. All express and implied
        warranties or conditions not stated in this Agreement (including without
        limitation, loss of profits, loss or corruption of data, business
        interruption or loss of contracts), so far as such exclusion or
        disclaimer is permitted under the applicable law are excluded and
        expressly disclaimed. This Agreement does not affect your statutory
        rights.
      </Typography>
      <Typography>
        7. Warranties and Limitation of Liability <br />
        SnapOG does not give any warranty, guarantee or other term as to the
        quality, fitness for purpose or otherwise of the software. SnapOG shall
        not be liable to you by reason of any representation (unless
        fraudulent), or any implied warranty, condition or other term, or any
        duty at common law, for any loss of profit or any indirect, special or
        consequential loss, damage, costs, expenses or other claims (whether
        caused by SnapOG's negligence or the negligence of its servants or
        agents or otherwise) which arise out of or in connection with the
        provision of any goods or services by SnapOG. SnapOG shall not be liable
        or deemed to be in breach of contract by reason of any delay in
        performing, or failure to perform, any of its obligations if the delay
        or failure was due to any cause beyond its reasonable control.
        Notwithstanding contrary clauses in this Agreement, in the event that
        SnapOG are deemed liable to you for breach of this Agreement, you agree
        that SnapOG's liability is limited to the amount actually paid by you
        for your services or software, which amount calculated in reliance upon
        this clause. You hereby release SnapOG from any and all obligations,
        liabilities and claims in excess of this limitation.
      </Typography>
      <Typography>
        8. General Terms and Law <br />
        This Agreement is governed by the laws of Wyoming, United States. You
        acknowledge that no joint venture, partnership, employment, or agency
        relationship exists between you and SnapOG as a result of your use of
        these services. You agree not to hold yourself out as a representative,
        agent or employee of SnapOG. You agree that SnapOG will not be liable by
        reason of any representation, act or omission to act by you.
      </Typography>
      <Typography className="mt-4">Last updated: 23 August 2024.</Typography>
    </section>
  );
};
