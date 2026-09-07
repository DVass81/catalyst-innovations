import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { founders } from "@/data/content";
import EmailLink from "@/components/EmailLink";
export const metadata: Metadata = {
  title: "Founders — Daniel Vass & Josh Ogle",
  description:
    "Meet Daniel Vass, operations and business transformation, and Josh Ogle, technology and product development: the founders of Catalyst Innovations.",
  alternates: { canonical: "/founders" },
};
export default function FoundersPage() {
  return (
    <>
      <section className="ci-page-hero">
        <div className="ci-container">
          <p className="ci-eyebrow">MEET YOUR CATALYST TEAM</p>
          <h1>
            Different experience.
            <br />
            <span>A shared way forward.</span>
          </h1>
          <p>
            Operations understanding and technical capability,
            <br />
            working together on the same business problem.
          </p>
        </div>
      </section>
      <section className="ci-section ci-paper">
        <div className="ci-container ci-founders-list">
          {founders.map((f) => (
            <article id={f.slug} key={f.slug}>
              <div className="ci-founder-profile-heading">
                <div className="ci-profile-initials" aria-hidden="true">
                  {f.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <p className="ci-eyebrow">CO-FOUNDER</p>
                <h2>{f.name}</h2>
                <p>{f.role.replace("Co-Founder | ", "")}</p>
                <EmailLink email={f.email} context={f.slug} />
              </div>
              <div className="ci-founder-biography">
                <p className="ci-founder-summary">{f.summary}</p>
                {f.bio.slice(0, 2).map((p) => (
                  <p key={p}>{p}</p>
                ))}
                <h3>Areas of experience</h3>
                <ul>
                  {f.expertise.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="ci-closing">
        <div className="ci-container">
          <h2>
            Let’s talk about
            <br />
            <span>the work you want to improve.</span>
          </h2>
          <div>
            <p>Start with a free conversation and a practical next step.</p>
            <Link href="/consultation" className="ci-btn">
              Talk with the team <ArrowUpRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
