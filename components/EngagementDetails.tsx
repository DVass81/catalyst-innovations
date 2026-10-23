import Link from "next/link";

export default function EngagementDetails() {
  return <section className="wrap content-section engagement-details" aria-labelledby="engagement-heading">
    <p className="overline">Before we build</p>
    <h2 id="engagement-heading">A clear scope.<br /><em>A decision you understand.</em></h2>
    <p>We start with a discovery call and shape an implementation plan around your needs. Your proposal is the place to agree on:</p>
    <dl className="engagement-grid">
      {[
        ["The work", "The workflow, included features, integrations and what is outside the first release."],
        ["The investment", "Custom-quoted implementation and ongoing support, plus any third-party services or usage charges."],
        ["Your information", "What needs to be imported, who can access it, and how data can be exported."],
        ["The handover", "Software ownership and licensing, training, support responsibilities and launch acceptance."],
      ].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
    </dl>
    <p className="muted">The agreed proposal and service terms define your project. You don’t need to know the technical answers before we talk.</p>
    <Link className="text-link" href="/discovery">Review discovery call details ↗</Link>
  </section>;
}
