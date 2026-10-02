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
    "Talk with Catalyst Innovations in Knoxville, Tennessee about custom business software, workflow automation and the process you want to improve.",
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
          <h2>Prefer email?</h2>
          <p>{site.location}</p>
          {activeFounders.map((f) => (
            <div key={f.slug} style={{ marginTop: 24 }}>
              <p>{f.name}</p>
              <EmailLink email={f.email} context={`contact_page_${f.slug}`} />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
