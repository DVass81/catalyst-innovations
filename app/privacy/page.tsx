import Link from "next/link";
import { Section, Heading } from "@/components/ui";
import AnalyticsPreferences from "@/components/AnalyticsPreferences";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/privacy",
  title: "Privacy",
  description: "How this website handles inquiries, local calculator data, optional analytics and ad-result measurement, and how to change your choice.",
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
          measurement preference; the preference cookie lasts for the browser session,
          and the local-storage preference remains until changed or cleared.
        </p>

        <h2>Optional analytics</h2>
        <p>
          When enabled on the site, Google Analytics and/or Plausible start only after
          you choose basic analytics or ad-result measurement. They help us understand visits to public pages and
          actions such as using a calculator, viewing a demo, preparing an email draft,
          clicking a booking link or successfully submitting an inquiry. A booking
          click does not tell us whether an appointment was completed, and an email-app
          click does not tell us whether an email was sent.
        </p>
        <p>
          Our custom events use reviewed page paths and feature identifiers.
          They exclude form answers, names, email addresses, phone numbers, calculator
          values, fragments and referring-page URLs. With basic analytics, our code
          supplies a page URL without query details. Google Analytics
          can use cookies and collect browser and device information; analytics
          providers also receive the network information needed to handle a request.
          Basic analytics denies Google advertising storage, advertising user data,
          ad personalization and Google signals.
        </p>
        <p>
          After analytics consent, a shared article link can also supply a reviewed
          Blog-post or Guide identifier and a predefined sharing label such as LinkedIn or email.
          These two labels stay in this browser tab’s session storage and can accompany
          later site actions. They describe the link’s sharing label, rather than proving
          which platform sent a visitor. Search terms, arbitrary link parameters and
          questionnaire answers are excluded. Withdrawing consent clears these labels.
          Blog posts and Guides use distinct identifiers. If you open an inquiry from
          either, its public identifier can accompany the inquiry so we know what you
          were reading.
        </p>
        <h2>Optional ad-result measurement</h2>
        <p>
          If you separately choose “Measure ad results,” we allow Google advertising
          storage and advertising user data so a Google ad click can be connected to
          a later site action, such as a consultation inquiry. Only validated Google
          click or aggregate identifiers (gclid, gbraid, wbraid, gad_source or
          gad_campaignid) may be added to the page URL our code sends to Google;
          other URL query details are omitted from our custom analytics events. The
          click identifiers may be stored in first-party Google advertising cookies. If our
          Google Analytics property is linked to Google Ads, Google may use that
          measurement to report ad results. Our custom events do not include form fields,
          inquiry text, email addresses or phone numbers for conversion matching, and
          enhanced conversions are not enabled by this site. Ad personalization and
          Google signals remain disabled. Plausible does not receive these identifiers.
        </p>
        <p>
          Where the browser supplies a referrer, we can label a visit as coming from
          a recognized Google, Bing or DuckDuckGo domain. We send only that category,
          not the referring URL or search words; other visits share a general category.
        </p>
        <p>
          Choosing “Necessary only” leaves the site available. You can change your
          choice below or through the footer. Turning measurement off stops future
          site analytics; changing from ad measurement to basic analytics also removes
          browser-accessible first-party Google ad-click cookies and refreshes the page to reset the loaded
          Google tag. This does not remove information already received by a provider.
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
