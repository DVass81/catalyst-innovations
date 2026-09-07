import Link from "next/link";
export default function ProofSection() {
  return (
    <section className="ci-section ci-paper">
      <div className="ci-container">
        <p className="ci-eyebrow">EXPERIENCE THE POSSIBILITY</p>
        <h2 className="ci-heading">
          Try the workflow.
          <br />
          See the next step.
        </h2>
        <p>
          Explore three fictional examples of connected operations. These
          demonstrations show how a system could work; they are not measured
          customer outcomes.
        </p>
        <Link className="ci-btn" href="/demo-lab">
          Explore the demos
        </Link>
      </div>
    </section>
  );
}
