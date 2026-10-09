import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { catalystProcess } from "@/data/catalystProcess";

/** All stages are server-rendered; reading the process never depends on playback or scripts. */
export default function CatalystProcess({ headingLevel = 2 }: { headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const StepHeading = headingLevel === 2 ? "h3" : "h4";

  return (
    <section className="section catalyst-process" id="catalyst-process" aria-labelledby="catalyst-process-heading">
      <div className="wrap">
        <div className="section-heading catalyst-process-heading">
          <div>
            <p className="overline">Custom software · Built alongside your team</p>
            <Heading id="catalyst-process-heading">{catalystProcess.title}</Heading>
          </div>
          <p>{catalystProcess.introduction}</p>
        </div>
        <ol className="catalyst-process-grid" role="list">
          {catalystProcess.steps.map((step) => (
            <li key={step.id}>
              <span className="catalyst-process-number" aria-hidden="true">{step.number}</span>
              <div className="catalyst-process-step">
                <StepHeading>{step.title}</StepHeading>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="catalyst-process-actions">
          <Link href="/consultation" className="button">
            Discuss my business <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
          <Link href="/services" className="text-link">
            Explore our services <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <p className="catalyst-process-note">{catalystProcess.proposalNote}</p>
      </div>
    </section>
  );
}
