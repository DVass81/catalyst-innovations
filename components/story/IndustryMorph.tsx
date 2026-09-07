"use client";
import { ArrowDown } from "lucide-react";
import { useTransform, motion } from "framer-motion";
import { type DemoIndustry } from "@/lib/demo";
import { useMorphTarget } from "./StoryMotion";
import { contour, MorphPath, panel } from "./MorphPaths";
const bodies = [
  contour(
    [
      [150, 180],
      [150, 115],
      [207, 145],
      [262, 108],
      [319, 145],
      [375, 106],
      [414, 130],
      [414, 66],
      [453, 66],
      [453, 180],
      [350, 180],
      [245, 180],
    ],
    0.015,
  ),
  contour(
    [
      [147, 176],
      [147, 97],
      [205, 97],
      [263, 97],
      [321, 97],
      [362, 104],
      [402, 139],
      [447, 147],
      [455, 179],
      [413, 185],
      [280, 185],
      [185, 185],
    ],
    0.06,
  ),
  contour(
    [
      [145, 180],
      [145, 80],
      [206, 80],
      [267, 80],
      [328, 80],
      [389, 80],
      [450, 80],
      [450, 113],
      [450, 147],
      [450, 180],
      [350, 180],
      [245, 180],
    ],
    0.025,
  ),
];
const routes = [
  "M 75 246 C 75 220 110 220 160 220 C 270 220 390 220 500 220 C 555 220 560 266 505 266 C 380 266 120 266 75 246",
  "M 75 246 C 130 155 210 322 286 248 C 342 198 383 304 447 249 C 500 205 575 294 614 247 C 629 237 638 225 646 213",
  "M 75 246 C 115 246 130 246 174 246 C 230 246 270 246 318 246 C 379 246 415 246 466 246 C 515 246 575 246 646 246",
];
const details = {
  manufacturing: [
    "The production line keeps moving.",
    "A request becomes a purchase. The decision stays with it.",
    "01 / MANUFACTURING",
  ],
  "field-service": [
    "The office and the field move together.",
    "A request becomes a scheduled job. Everyone sees the next step.",
    "02 / FIELD SERVICE",
  ],
  "professional-services": [
    "A great handoff starts with clarity.",
    "A request becomes a ready client. The team has what it needs.",
    "03 / PROFESSIONAL SERVICES",
  ],
};
export default function IndustryMorph({
  industry,
}: {
  industry: DemoIndustry;
}) {
  const index =
    industry === "manufacturing" ? 0 : industry === "field-service" ? 1 : 2;
  const { ref, progress } = useMorphTarget(index, 1.4);
  const color = useTransform(
    progress,
    [0, 1, 2],
    ["#8ac5ff", "#a9e5d8", "#c4baff"],
  );
  const copy = details[industry];
  return (
    <div ref={ref} className="story-industry-morph" data-industry={industry}>
      <div className="story-world-copy">
        <span className="story-kicker">{copy[2]}</span>
        <h3>{copy[0]}</h3>
        <p>{copy[1]}</p>
        <a href="#industry-demo-panel">
          Put it into practice <ArrowDown size={16} />
        </a>
      </div>
      <svg viewBox="0 0 700 315" aria-hidden="true" className="story-world-svg">
        <g stroke="#4e6e89" strokeWidth=".5" opacity=".35">
          {[80, 180, 280, 380, 480, 580].map((x) => (
            <path key={x} d={`M${x} 30V290`} />
          ))}
          <path d="M35 195H655M35 290H655" />
        </g>
        <MorphPath
          data-morph="industry-outline"
          progress={progress}
          stops={[0, 1, 2]}
          shapes={bodies}
          fill="#102b40"
          style={{ stroke: color }}
          strokeWidth="2.5"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={routes}
          fill="none"
          style={{ stroke: color }}
          strokeWidth="2.5"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            panel(190, 148, 33, 24, 2),
            panel(181, 169, 33, 33, 16),
            panel(179, 106, 68, 51, 5),
          ]}
          fill="#071421"
          style={{ stroke: color }}
          strokeWidth="2"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            panel(270, 148, 33, 24, 2),
            panel(379, 169, 33, 33, 16),
            panel(266, 106, 68, 51, 5),
          ]}
          fill="#071421"
          style={{ stroke: color }}
          strokeWidth="2"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            panel(350, 148, 33, 24, 2),
            panel(335, 111, 44, 35, 7),
            panel(354, 106, 68, 51, 5),
          ]}
          fill="#071421"
          style={{ stroke: color }}
          strokeWidth="2"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            panel(154, 228, 20, 29, 6),
            panel(161, 224, 25, 25, 12),
            panel(154, 232, 39, 27, 5),
          ]}
          fill="#71b4ef"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            panel(304, 228, 20, 29, 6),
            panel(302, 224, 25, 25, 12),
            panel(299, 232, 39, 27, 5),
          ]}
          fill="#71b4ef"
        />
        <MorphPath
          progress={progress}
          stops={[0, 1, 2]}
          shapes={[
            panel(454, 228, 20, 29, 6),
            panel(455, 224, 25, 25, 12),
            panel(447, 232, 39, 27, 5),
          ]}
          fill="#71b4ef"
        />
        <motion.circle
          cx="578"
          cy="112"
          r="35"
          fill="none"
          style={{ stroke: color }}
          strokeWidth="1"
        />
        <path
          d="M562 112L574 124L594 102"
          stroke="#d2eaf9"
          strokeWidth="2"
          fill="none"
        />
        <text x="70" y="303" fill="#a6bdd1" fontSize="12" letterSpacing="2">
          DIFFERENT WORK. ONE CONNECTED WAY FORWARD.
        </text>
      </svg>
    </div>
  );
}
