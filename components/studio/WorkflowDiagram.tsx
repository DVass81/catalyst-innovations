import styles from "./WorkflowDiagram.module.css";

export type WorkflowStep = { title: string; detail: string; record?: string };
export type WorkflowDiagramProps = {
  title?: string;
  steps: readonly WorkflowStep[];
  caption?: string;
  id?: string;
};

/** A readable process illustration. Every handoff remains visible without playback or JavaScript. */
export default function WorkflowDiagram({ title, steps, caption, id }: WorkflowDiagramProps) {
  const StepHeading = title ? "h4" : "h3";
  return <figure className={styles.diagram} id={id} aria-label={title || "Illustrative business workflow"}>
    <figcaption className={styles.heading}>
      <p>Illustrative workflow</p>
      {title && <h3>{title}</h3>}
    </figcaption>
    <ol className={styles.steps} role="list">
      {steps.map((step, index) => <li key={`${index}-${step.title}`}>
        <span className={styles.node} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <StepHeading className={styles.stepTitle}>{step.title}</StepHeading>
        <p>{step.detail}</p>
        {step.record && <span className={styles.record}>{step.record}</span>}
      </li>)}
    </ol>
    {caption && <p className={styles.caption}>{caption}</p>}
  </figure>;
}
