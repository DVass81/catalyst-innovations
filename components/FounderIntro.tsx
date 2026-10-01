import Link from "next/link";
import Image from "next/image";
import { founderPhoto } from "@/lib/founderPhoto";
import { activeFounders } from "@/data/content";
export default function FounderIntro({ full = false }: { full?: boolean }) {
  return (
    <section
      className="wrap content-section founder-intro"
      data-section-track="founders"
    >
      <div className="founder-heading">
        <p className="overline">Josh & Daniel / The people behind Catalyst</p>
        <h2>
          We understand the work.
          <br />
          <em>And how to connect it.</em>
        </h2>
        <p className="intro-copy">
          Daniel brings the operations perspective. Josh brings the technology
          perspective. Together, we connect how a business works with the
          software that can help it work better.
        </p>
      </div>
      <div className="two-grid">
        {activeFounders.map((f) => {
          const photo = founderPhoto(f.slug);
          return (
            <article className="founder-profile" key={f.slug}>
              {photo && (
                <Image
                  className="founder-photo"
                  src={photo}
                  width={480}
                  height={480}
                  alt={f.name}
                  sizes="(max-width:700px) 90vw, 440px"
                />
              )}
              <p className="overline">
                {f.name.startsWith("Daniel")
                  ? "The operations perspective"
                  : "The technology perspective"}
              </p>
              <h3>{f.name}</h3>
              <p className="founder-role">{f.role}</p>
              <p>{f.summary}</p>
              {full ? (
                f.bio.map((b, i) => <p key={i}>{b}</p>)
              ) : (
                <p>
                  {f.name.startsWith("Daniel")
                    ? "Approximately 20 years across manufacturing, purchasing, supply chain and continuous improvement—experience that helps identify where work gets stuck and what needs to change."
                    : "Ten years of Army service and more than eight years in IT—bringing systems, cybersecurity and product-development experience to practical business problems."}
                </p>
              )}
              {full && f.personalNote && <p>{f.personalNote}</p>}
              {full && (
                <ul>
                  {f.expertise.map((e) => (
                    <li key={e}>{e}</li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
      {!full && (
        <Link className="text-link" href="/about#our-background">
          Read our backgrounds ↗
        </Link>
      )}
      <div className="founder-principle">
        <strong>Start with the people doing the work.</strong>
        <p>
          Understand the handoffs. Build something useful. Improve it together.
        </p>
      </div>
    </section>
  );
}
