import Link from "next/link";
import { projectStories } from "@/data/projectStories";

export default function ProjectStories({ compact = false }: { compact?: boolean }) {
  return <section className="wrap section project-stories" aria-labelledby="project-stories-heading">
    <p className="overline">Projects & work in progress</p>
    <h2 id="project-stories-heading">Real businesses.<br /><em>Practical starting points.</em></h2>
    <p className="stories-intro">What we’ve built, what we’re developing, and the conversations shaping what comes next.</p>
    <div className={`project-story-list${compact ? " project-story-compact" : ""}`}>
      {projectStories.map(story => <article key={story.id}>
        <div><p className="overline">{story.name}</p><p className="project-status">{story.status}</p></div>
        <div><h3>{story.title}</h3><p>{story.text}</p>
          {!compact && <details><summary>Project context</summary><p>{story.detail}</p>
            {story.source && <a href={story.source} target="_blank" rel="noopener noreferrer" className="text-link">USA Field Hockey’s LA28 announcement ↗</a>}
          </details>}
          <Link className="text-link" href={story.href}>{story.action} ↗</Link>
        </div>
      </article>)}
    </div>
  </section>;
}
