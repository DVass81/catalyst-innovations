import Link from "next/link";
import { Section, Heading } from "@/components/ui";
import AnalyticsPreferences from "@/components/AnalyticsPreferences";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy",
  description: "How this website handles inquiries, local calculator data and optional analytics, and how to change your analytics choice.",
});

export default function PrivacyPage() {
  return (
    <Section className="bg-white pt-40">
      <div className="prose-ci mx-auto">
        <Heading as="h1">Privacy</Heading>
        <p>This page describes the information handled by the Catalyst Innovations website and the choices available to you.</p>

        <h2>Inquiries and email drafts</h2>
        <p>
          An inquiry includes the name, email address, business name and description
          you provide, plus any optional details you choose to include. When direct
          submission is available, the site sends those details to Catalyst’s configured
          delivery service so we can respond. If the form prepares an email draft,
          the draft stays in your browser until you copy it or open your email app.
          Preparing a draft does not send an inquiry. Your email provider handles the
          message when you send it.
        </p>
        <p>Include only information needed to discuss your project. Please do not enter passwords or confidential customer records.</p>

        <h2>Calculators and browser storage</h2>
        <p>
          Savings calculators run in your browser. If you choose to attach a result
          to an inquiry, the site saves the calculation in this browser tab’s session
          storage so you can review it before sending. Calculator inputs and results
          are not included in analytics events. Browser storage also remembers your
          analytics preference; the preference cookie lasts for the browser session,
          and the local-storage preference remains until changed or cleared.
        </p>

        <h2>Optional analytics</h2>
        <p>
          When enabled on the site, Google Analytics and/or Plausible start only after
          you accept analytics. They help us understand visits to public pages and
          actions such as using a calculator, viewing a demo, preparing an email draft,
          clicking a booking link or successfully submitting an inquiry. A booking
          click does not tell us whether an appointment was completed, and an email-app
          click does not tell us whether an email was sent.
        </p>
        <p>
          Our event code sends only reviewed page paths and feature identifiers.
          It excludes form answers, names, email addresses, phone numbers, calculator
          values, URL queries, fragments and referring-page URLs. Google Analytics
          can use cookies and collect browser and device information; analytics
          providers also receive the network information needed to handle a request.
          Our Google configuration disables advertising storage, advertising user
          data, ad personalization and Google signals.
        </p>
        <p>
          Where the browser supplies a referrer, we can label a visit as coming from
          a recognized Google, Bing or DuckDuckGo domain. We send only that category,
          not the referring URL or search words; other visits share a general category.
        </p>
        <p>
          Declining analytics leaves the site available. You can change your choice
          below or through the footer. Turning analytics off stops future site
          analytics; a page refresh removes an already loaded Google tag. This does
          not remove information already received by a provider.
        </p>
        <p><AnalyticsPreferences /></p>

        <h2>External services</h2>
        <p>
          Booking links, email apps and externally hosted demonstrations open services
          outside this website. Those services handle information under their own
          privacy terms. Website hosting and inquiry delivery may also involve service
          providers that process technical requests or the inquiry you submit.
        </p>

        <h2>Questions and requests</h2>
        <p>
          For questions about information you sent to Catalyst, how long it is kept,
          or a request to access, correct or delete it, please use the{" "}
          <Link href="/contact">contact page</Link>. Do not include sensitive information
          in an initial request.
        </p>
      </div>
    </Section>
  );
}
