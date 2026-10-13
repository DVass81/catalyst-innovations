import Image from "next/image";
import styles from "./ChamberMembership.module.css";

const chamberUrl = "https://blountchamber.com/";

/** Supplied membership artwork, displayed without alteration. */
export default function ChamberMembership({ compact = false }: { compact?: boolean }) {
  const badge = (
    <Image
      src="/brand/blount-partnership-proud-member.png"
      alt="Blount Partnership Chamber of Commerce proud member badge"
      width={300}
      height={200}
      unoptimized
      className={styles.badge}
    />
  );

  if (compact) {
    return (
      <aside className={styles.compact} aria-label="Chamber membership">
        <a href={chamberUrl} target="_blank" rel="noopener noreferrer" className={styles.compactLink}>
          {badge}
          <span className={styles.compactText}>
            Proud member of our local Chamber <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
        </a>
      </aside>
    );
  }

  return (
    <section id="chamber-membership" className={styles.membership} aria-labelledby="chamber-membership-heading">
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Part of our local business community</p>
          <h2 id="chamber-membership-heading">
            Proud member of the <span>Blount Partnership</span> Chamber of Commerce.
          </h2>
          <p className={styles.description}>
            Based in Knoxville. Connected to the East Tennessee business community.
          </p>
        </div>
        <a href={chamberUrl} target="_blank" rel="noopener noreferrer" className={styles.badgeLink}>
          {badge}
          <span className={styles.linkLabel}>
            Explore the Chamber <span aria-hidden="true">↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </span>
        </a>
      </div>
    </section>
  );
}
