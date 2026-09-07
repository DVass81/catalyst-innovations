import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import PrivacyPreferences from "@/components/PrivacyPreferences";
export const metadata: Metadata = {
  title: "Website Privacy Notice",
  description:
    "What information this website uses, how inquiries are handled, and your choices.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  const analytics = [
    process.env.NEXT_PUBLIC_GA_ID ? "Google Analytics" : null,
    process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN ? "Plausible" : null,
  ].filter(Boolean);
  return (
    <section className="ci-policy ci-paper">
      <div className="ci-container">
        <p className="ci-eyebrow">YOUR INFORMATION</p>
        <h1>Website privacy notice</h1>
        <p className="ci-policy-date">Updated September 7, 2026</p>
        <div className="ci-policy-content">
          <h2>When you contact us</h2>
          <p>
            We collect the name, company, email address, and description you
            submit, along with any optional details you choose to include. We
            use that information to understand your inquiry and respond. Please
            do not include passwords, confidential business records, or
            sensitive personal information.
          </p>
          <h2>How inquiries are handled</h2>
          <p>
            Submitted information is delivered to our business email or
            inquiry-management service. Our team and the providers involved in
            delivering and managing that correspondence may process it for those
            purposes. This website does not automatically add you to a marketing
            mailing list.
          </p>
          <h2>Demonstrations and estimates</h2>
          <p>
            Industry demonstrations use fictional data. Demo decisions and
            calculator inputs are processed in your browser and are not
            submitted as inquiry contents. When you choose to discuss a demo,
            its industry label can accompany the inquiry you submit.
          </p>
          <h2>Browser storage and measurement</h2>
          <p>
            Your display preference and optional analytics choice may be saved
            in your browser. A session setting remembers whether the opening
            animation has played. Personal inquiry fields are not automatically
            saved in browser storage.
          </p>
          {analytics.length > 0 ? (
            <>
              <p>
                Optional measurement uses {analytics.join(" and ")} after you
                allow it. It helps us understand page visits and actions such as
                demo use or inquiry completion. We do not include your name,
                email, company, or inquiry text in those events. Depending on
                the provider, technical information such as browser details,
                page paths, and network information may be processed.
              </p>
              <PrivacyPreferences />
            </>
          ) : (
            <p>
              Optional analytics is not enabled on this version of the website.
              If it is enabled later, it will be subject to the analytics choice
              shown on the site.
            </p>
          )}
          <h2>Hosting, security, and scheduling</h2>
          <p>
            The public website is hosted through DigitalOcean. Hosting and
            security providers process technical request information needed to
            deliver and protect the site. Submission rate limiting uses a short
            request window; configured infrastructure may retain operational
            logs under its own settings.
          </p>
          <p>
            If you open or load the booking calendar, the scheduling provider
            receives the information needed to display availability and arrange
            your appointment. Its privacy notice applies to that service. Other
            external links also take you to services with their own practices.
          </p>
          <h2>Retention and your choices</h2>
          <p>
            Correspondence may remain in our business email or
            inquiry-management system while an inquiry or customer relationship
            is being handled. This website does not enforce a fixed automatic
            deletion period for those external records. Contact us to ask about
            records relating to you, request a correction, or request deletion;
            applicable recordkeeping obligations may affect what can be removed.
          </p>
          <p>
            You can clear display and analytics preferences through your browser
            settings. Where optional analytics is enabled, you can also change
            that choice using the control above.
          </p>
          <h2>Contact</h2>
          <p>
            For privacy questions or requests, email{" "}
            <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>. You
            can also use our <Link href="/contact">contact page</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
