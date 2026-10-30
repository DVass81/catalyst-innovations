import Image from "next/image";
import { studioPhotos } from "@/data/studioMedia";
import styles from "./StudioPhoto.module.css";

/** Real, licensed contextual imagery. Never presented as Catalyst staff or customer work. */
export default function StudioPhoto({ photoKey, priority = false, sizes = "(max-width: 760px) 92vw, 48vw", className = "" }: {
  photoKey: keyof typeof studioPhotos;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const photo = studioPhotos[photoKey];
  return <figure className={`${styles.figure} ${className}`}>
    <Image src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} sizes={sizes}
      loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : undefined} />
    <figcaption><span>{photo.label}</span><a href={photo.sourceUrl} target="_blank" rel="noopener noreferrer">{photo.credit}<span aria-hidden="true"> ↗</span><span className="sr-only"> (opens in a new tab)</span></a></figcaption>
  </figure>;
}
