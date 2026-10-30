import { guideVisuals } from "@/data/guideVisuals";
import StudioPhoto from "./StudioPhoto";
import styles from "./GuideVisual.module.css";

export default function GuideVisual({ slug }: { slug: string }) {
  const visual = guideVisuals[slug];
  if (!visual) return null;
  return <section className={`wrap ${styles.visual}`} aria-label="A visual introduction to this guide">
    <StudioPhoto photoKey={visual.photoKey} priority sizes="(max-width:760px) 92vw, 42vw" />
    <div className={styles.route}><p className="overline">An illustrative approach</p><p className={styles.description}>{visual.description}</p><ol role="list">{visual.steps.map((step,index)=><li key={step}><span aria-hidden="true">0{index+1}</span>{step}</li>)}</ol><p className={styles.note}>A guide to the decisions and handoffs, rather than a claim about a delivered system or customer result.</p></div>
  </section>;
}
