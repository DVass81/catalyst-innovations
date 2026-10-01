import Link from "next/link";
import DemoShowcase from "./DemoShowcase";

import {
  ArrowUpRight,
  Layers3,
  UsersRound,
  ChartNoAxesCombined,
} from "lucide-react";
import { solutionGroups } from "@/data/redesign";
export function PageIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="page-intro wrap">
      <p className="overline">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="intro-copy">{text}</p>
    </section>
  );
}
export function DiscussCTA() {
  return (
    <section className="contact-band">
      <div className="wrap">
        <div>
          <p className="overline">A good place to start</p>
          <h2>
            What’s slowing
            <br />
            your business down?
          </h2>
          <p>
            Start a conversation with Josh and Daniel. Bring the process you
            want to improve—we’ll help you find a useful starting point.
          </p>
        </div>
        <Link className="button button-light" href="/consultation">
          Discuss my business <ArrowUpRight size={18} />
        </Link>
      </div>
    </section>
  );
}
export function SolutionCards() {
  const icons = [UsersRound, Layers3, ChartNoAxesCombined];
  return (
    <div className="three-grid solution-cards">
      {solutionGroups.map((s, i) => {
        const Icon = icons[i];
        return (
          <article key={s.number} className="solution-card">
            <div className="card-top">
              <span>{s.number} /</span>
              <Icon size={25} strokeWidth={1.4} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.text}</p>
            <ul>
              {s.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <Link href={s.href}>
              Explore solutions <ArrowUpRight size={16} />
            </Link>
          </article>
        );
      })}
    </div>
  );
}
export function Projects({ detailed = false }: { detailed?: boolean }) {
  return <DemoShowcase detailed={detailed} />;
}
