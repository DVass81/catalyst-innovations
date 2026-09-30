import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/SiteSections";
import EmailLink from "@/components/EmailLink";
import { activeFounders } from "@/data/content";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  title: "Contact",
  description:
    "Tell Catalyst Innovations what is slowing your business down. Start a conversation about custom software and automation.",
};
export default function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact"
        title="Start with the work you want to make easier."
        text="Tell us what you do, where things get stuck, and what a better day would look like."
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
