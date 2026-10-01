import Link from "next/link";
export default function FounderIntro() {
  return (
    <section className="wrap content-section founder-intro">
      <p className="overline">The people behind Catalyst</p>
      <h2>Operations meets technology.</h2>
      <div className="two-grid">
        <article className="content-card">
          <p className="overline">The operations perspective</p>
          <h3>Daniel Vass</h3>
          <p>Co-founder · Operations & business transformation</p>
          <p>
            Daniel brings approximately 20 years of experience in manufacturing,
            purchasing, supply chain and operations. He helps uncover where work
            gets stuck and what a better process could look like.
          </p>
        </article>
        <article className="content-card">
          <p className="overline">The technology perspective</p>
          <h3>Josh Ogle</h3>
          <p>Co-founder · Technology & product development</p>
          <p>
            Josh brings more than eight years in IT and ten years of Army
            service. He turns operational needs into practical software,
            connected systems and useful automation.
          </p>
        </article>
      </div>
      <Link className="text-link" href="/founders">
        More about Josh and Daniel ↗
      </Link>
    </section>
  );
}
