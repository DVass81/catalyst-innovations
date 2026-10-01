import Image from "next/image";
import Link from "next/link";
export default function RealSoftwarePreview() {
  return (
    <figure className="real-software-preview">
      <div className="demo-window-bar">
        <span>BUILT BY CATALYST</span>
        <span>Actual application · sample data</span>
      </div>
      <div className="real-preview-body">
        <p className="overline">From measurements to an estimate</p>
        <Image
          src="/demos/flooring-measure.webp"
          width={402}
          height={217}
          sizes="(max-width:700px) 88vw, 520px"
          alt="Flooring software totals a sample room’s measurements into floor area."
          loading="eager"
        />
        <ol>
          <li>Measure the room</li>
          <li>Review the costs</li>
          <li>Prepare the estimate</li>
        </ol>
      </div>
      <figcaption>
        <strong>One useful tool. A clearer way to work.</strong>
        <Link href="/portfolio#flooring" className="text-link">
          Watch the Flooring walkthrough ↗
        </Link>
      </figcaption>
    </figure>
  );
}
