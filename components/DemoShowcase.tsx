"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { demos, type Demo } from "@/data/demos";
import { track } from "@/lib/site";

function GuidedDemo({ demo }: { demo: Demo }) {
  const [step, setStep] = useState(0);
  const current = demo.steps[step];
  return (
    <article id={demo.id} className="guided-demo">
      <div className="demo-intro">
        <p className="overline">
          {demo.id === "hoa" ? "Community operations" : `${demo.id} software`}
        </p>
        <h2>{demo.title}</h2>
        <p>{demo.purpose}</p>
        <span className="demo-status">{demo.status}</span>
        <ul>
          {demo.capabilities.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
      <div className="demo-tour">
        <div className="demo-window">
          <div className="demo-window-bar">
            <span>ACTUAL APPLICATION SCREEN</span>
            <span>Sample information</span>
          </div>
          <div className="demo-screen">
            <Image
              src={current.image}
              width={current.width}
              height={current.height}
              alt={current.alt}
              sizes="(max-width:700px) 90vw, 720px"
            />
          </div>
        </div>
        <div
          className="demo-step-controls"
          role="group"
          aria-label={`Explore ${demo.id} demo`}
        >
          {demo.steps.map((s, i) => (
            <button
              key={s.title}
              aria-pressed={step === i}
              aria-controls={`${demo.id}-explanation`}
              onClick={() => {
                setStep(i);
                track("demo_interaction", { demo: demo.id, step: i + 1 });
              }}
            >
              <span>0{i + 1}</span>
              {s.title}
            </button>
          ))}
        </div>
        <div
          id={`${demo.id}-explanation`}
          className="demo-explanation"
          aria-live="polite"
        >
          <h3>{current.title}</h3>
          <p>{current.text}</p>
        </div>
        <div className="demo-actions">
          <Link
            className="text-link"
            href={`/consultation?demo=${demo.id}&industry=${demo.industry}`}
          >
            Discuss a system like this ↗
          </Link>
          {demo.availability === "public-sample" && demo.publicUrl && (
            <a
              className="text-link"
              href={demo.publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                track("demo_interaction", {
                  demo: demo.id,
                  action: "open_public",
                })
              }
            >
              Explore the public sample ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
export default function DemoShowcase({
  detailed = false,
}: {
  detailed?: boolean;
}) {
  if (detailed)
    return (
      <div className="demo-library">
        {demos.map((d) => (
          <GuidedDemo key={d.id} demo={d} />
        ))}
      </div>
    );
  return (
    <div className="three-grid demo-cards">
      {demos.map((d) => (
        <article key={d.id}>
          <Link
            className="demo-card-image"
            href={`/portfolio#${d.id}`}
            aria-label={`Preview ${d.id === "hoa" ? "community" : d.id} software`}
          >
            <Image
              src={d.steps[0].image}
              width={d.steps[0].width}
              height={d.steps[0].height}
              alt={d.steps[0].alt}
              sizes="(max-width:700px) 90vw, 380px"
            />
          </Link>
          <div className="demo-card-copy">
            <p className="overline">{d.status}</p>
            <h3>{d.title}</h3>
            <p>{d.purpose}</p>
            <Link className="text-link" href={`/portfolio#${d.id}`}>
              Explore the guided preview ↗
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
