export default function EngagementDetails() {
  return <section className="wrap content-section engagement-details" aria-labelledby="engagement-heading">
    <p className="overline">Before we build</p>
    <h2 id="engagement-heading">A clear scope.<br /><em>A decision you understand.</em></h2>
    <p>We start with one process and define what a useful first version should do. Your proposal is the place to agree on:</p>
    <dl className="engagement-grid">
      {[
        ["The work", "The workflow, included features, integrations and what is outside the first release."],
        ["The investment", "Implementation, ongoing support and any third-party services or usage charges."],
        ["Your information", "What needs to be imported, who can access it, and how data can be exported."],
        ["The handover", "Software ownership and licensing, training, support responsibilities and launch acceptance."],
      ].map(([title, text]) => <div key={title}><dt>{title}</dt><dd>{text}</dd></div>)}
    </dl>
    <p className="muted">The agreed proposal and service terms define your project. You don’t need to know the technical answers before we talk.</p>
  </section>;
}
