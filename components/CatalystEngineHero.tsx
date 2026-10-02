import Image from "next/image";

/** Still concept for review. Add motion only after the artwork is approved. */
export default function CatalystEngineHero() {
  return (
    <figure className="catalyst-engine-hero">
      <div className="catalyst-engine-art">
        <Image
          src="/brand/catalyst-engine-concept-v1.webp"
          width={1448}
          height={1086}
          sizes="(max-width: 900px) 92vw, 48vw"
          loading="eager"
          alt="An abstract illustration of four business functions joined by one blue connection: customers, jobs, inventory and accounting."
        />
      </div>
      <figcaption>
        <span className="overline">Individual parts. One connected business.</span>
        <span>Customers · Jobs · Inventory · Accounting</span>
      </figcaption>
    </figure>
  );
}
