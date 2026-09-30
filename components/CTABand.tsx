import Link from "next/link";
export default function CTABand({
  title = "Let's talk about the process that frustrates you most.",
  body = "A consultation costs nothing and starts with listening to the people doing the work.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="contact-band">
      <div className="wrap">
        <div>
          <h2>{title}</h2>
          <p>{body}</p>
        </div>
        <Link href="/consultation" className="button button-light">
          Discuss my business ↗
        </Link>
      </div>
    </section>
  );
}
