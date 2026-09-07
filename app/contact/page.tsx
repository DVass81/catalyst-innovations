import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import { site } from "@/lib/site";
import { founders } from "@/data/content";
import EmailLink from "@/components/EmailLink";
export const metadata: Metadata = {
  title: "Contact Catalyst Innovations",
  description:
    "Contact Daniel Vass and Josh Ogle to discuss custom software, automation, and connected business systems.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">CONTACT CATALYST</p>
          <h1>
            A better way starts
            <br />
            <span>with a conversation.</span>
          </h1>
          <p>Tell us what you’re working on and where things get stuck.</p>
          <Link href="/consultation" className="ci-btn">
            Talk about your project <ArrowUpRight size={18} />
          </Link>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container">
          <div className="ci-contact-cards">
            {founders.map((f) => (
              <article key={f.slug}>
                <Mail size={27} />
                <h2>{f.name}</h2>
                <p>{f.role.replace("Co-Founder | ", "")}</p>
                <EmailLink email={f.email} context="contact" />
              </article>
            ))}
            <article>
              <MapPin size={27} />
              <h2>Based in East Tennessee</h2>
              <p>{site.location}</p>
              <p>Working with businesses across industries.</p>
              {site.contactPhone && (
                <a href={`tel:${site.contactPhone.replace(/[^+\d]/g, "")}`}>
                  {site.contactPhone}
                </a>
              )}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
