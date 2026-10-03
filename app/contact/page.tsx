import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { PageIntro } from "@/components/SiteSections";
import EmailLink from "@/components/EmailLink";
import { activeFounders } from "@/data/content";
import { site } from "@/lib/site";
export const metadata = pageMetadata({
  path: "/contact",
  title: "Contact Our Knoxville Software Team",
  description:
    "Call (865) 348-3137 or email Josh and Daniel about custom business software. Serving East Tennessee and businesses worldwide. Open daily, 6 a.m.–8 p.m. Eastern.",
});
export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Start with the work you want to make easier."
        text="Talk with Josh and Daniel in Knoxville, Tennessee. Tell us what you do, where things get stuck, and what a better day would look like."
      />
      <section className="wrap content-section two-grid">
        <div className="content-card">
          <h2>Let’s talk about your business.</h2>
          <p>
            You don’t need a technical brief. A few sentences about the problem
            are enough to start.
          </p>
          <Link
            href="/consultation"
            className="button"
            style={{ marginTop: 28 }}
          >
            Discuss my business ↗
          </Link>
        </div>
        <div className="content-card">
          <h2>Call or email us.</h2>
          <p><a href={`tel:${site.contactPhone}`}>{site.contactPhoneLabel}</a></p>
          {activeFounders.map((f) => (
            <div key={f.slug} style={{ marginTop: 24 }}>
              <p>{f.name}</p>
              <EmailLink email={f.email} context={`contact_page_${f.slug}`} />
            </div>
          ))}
        </div>
      </section>
      <section className="wrap content-section two-grid" aria-label="Hours and service area">
        <div className="content-card">
          <h2>Business hours</h2>
          <p>{site.businessHours}.</p>
          <h3 style={{ marginTop: 24 }}>Support</h3>
          <p>{site.supportHours}. Your service agreement defines the support scope and any response commitments.</p>
        </div>
        <div className="content-card">
          <h2>East Tennessee roots. A wider reach.</h2>
          <p>Based in Knoxville, we serve businesses throughout East Tennessee and work with teams worldwide.</p>
          <p>We meet clients at their businesses or online. We do not operate a walk-in office.</p>
        </div>
      </section>
    </>
  );
}
