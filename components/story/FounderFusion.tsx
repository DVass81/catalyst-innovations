"use client";
import Link from "next/link";
import { motion, useTransform } from "framer-motion";
import { ArrowUpRight, Pause, Play, RotateCcw } from "lucide-react";
import { MorphPath, panel } from "./MorphPaths";
import { useStoryTimeline } from "./StoryMotion";
const phases = [
  "Two perspectives. The same business problem.",
  "First, understand how the work happens.",
  "Then, connect the people and the information.",
  "A shared blueprint becomes a working system.",
  "Built together. Built around your business.",
];
export default function FounderFusion() {
  const {
    ref: sceneRef,
    progress,
    phase,
    complete,
    paused,
    reduced,
    replay,
    toggle,
  } = useStoryTimeline(5);
  const combined = useTransform(progress, [0, 0.35, 0.8, 1], [0, 0, 1, 1]);
  const separate = useTransform(progress, [0, 0.25, 0.6, 1], [1, 1, 0, 0]);
  return (
    <div ref={sceneRef} className="story-fusion" data-phase={phase}>
      <div className="story-fusion-names">
        <Link href="/founders#daniel-vass">
          <span>THE OPERATIONAL PERSPECTIVE</span>
          <strong>
            Daniel Vass <ArrowUpRight size={18} />
          </strong>
        </Link>
        <span className="story-fusion-plus">+</span>
        <Link href="/founders#josh-ogle">
          <span>THE ENGINEERING PERSPECTIVE</span>
          <strong>
            Josh Ogle <ArrowUpRight size={18} />
          </strong>
        </Link>
      </div>
      <svg
        viewBox="0 0 1000 340"
        aria-hidden="true"
        className="story-fusion-svg"
      >
        <g stroke="#2d4a66" strokeWidth=".6" opacity=".55">
          {[100, 200, 300, 400, 500, 600, 700, 800, 900].map((x) => (
            <path key={x} d={`M${x} 30V315`} />
          ))}
          {[65, 125, 185, 245, 305].map((y) => (
            <path key={y} d={`M50 ${y}H950`} />
          ))}
        </g>
        <MorphPath
          data-morph="founder-operations"
          progress={progress}
          stops={[0, 0.22, 0.82, 1]}
          shapes={[
            panel(62, 55, 330, 235, 34),
            panel(140, 80, 315, 205, 54),
            panel(272, 52, 456, 235, 14),
            panel(272, 52, 456, 235, 14),
          ]}
          stroke="#97bdde"
          strokeWidth="1.5"
          fill="#102a40"
        />
        <MorphPath
          data-morph="founder-engineering"
          progress={progress}
          stops={[0, 0.22, 0.82, 1]}
          shapes={[
            panel(607, 55, 330, 235, 5),
            panel(546, 80, 315, 205, 45),
            panel(272, 52, 456, 235, 14),
            panel(272, 52, 456, 235, 14),
          ]}
          stroke="#75b6ff"
          strokeWidth="1.5"
          fill="#102a40"
        />
        <MorphPath
          progress={progress}
          shapes={[
            "M 85 158 C 140 52 278 290 340 149 C 400 12 560 320 650 157 C 725 14 800 256 912 175",
            "M 90 176 C 180 176 220 176 300 176 C 390 176 450 176 510 176 C 670 176 785 176 912 176",
          ]}
          stroke="#91cdfd"
          strokeWidth="2"
          fill="none"
        />
        <MorphPath
          progress={progress}
          shapes={[panel(91, 88, 110, 51, 13), panel(297, 113, 123, 58, 7)]}
          stroke="#94bedd"
          fill="#173751"
        />
        <MorphPath
          progress={progress}
          shapes={[panel(228, 189, 123, 66, 18), panel(297, 190, 123, 58, 7)]}
          stroke="#94bedd"
          fill="#173751"
        />
        <MorphPath
          progress={progress}
          shapes={[panel(645, 87, 93, 90, 4), panel(443, 113, 124, 135, 7)]}
          stroke="#75b6ff"
          fill="#173751"
        />
        <MorphPath
          progress={progress}
          shapes={[panel(787, 192, 117, 54, 4), panel(589, 113, 115, 135, 7)]}
          stroke="#75b6ff"
          fill="#173751"
        />
        <motion.g style={{ opacity: separate }} fill="#d1e4f4" fontSize="18">
          <text x="108" y="121">
            The people
          </text>
          <text x="249" y="229">
            The process
          </text>
          <text x="658" y="137">
            The data
          </text>
          <text x="800" y="225">
            The tools
          </text>
        </motion.g>
        <motion.g style={{ opacity: combined }} fill="#c6e0f3" fontSize="17">
          <text x="298" y="85" letterSpacing="2">
            ONE WORKING SYSTEM
          </text>
          <path
            d="M315 140H399M315 216H399M459 135H550M459 151H533M605 135H685M605 151H668"
            stroke="#82b5dc"
            strokeWidth="2"
          />
          <path
            d="M468 209L489 227L536 181M611 209L630 227L678 181"
            stroke="#91ebcf"
            strokeWidth="2"
            fill="none"
          />
          <text x="322" y="314" fill="#a9c5dc">
            Operational understanding. Engineering precision.
          </text>
        </motion.g>
      </svg>
      <div className="story-fusion-caption">
        <p>{phases[phase]}</p>
        <div>
          <button
            type="button"
            className="ci-icon-btn"
            aria-label={
              paused ? "Resume founders animation" : "Pause founders animation"
            }
            onClick={toggle}
            disabled={reduced || complete}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <button
            type="button"
            className="ci-icon-btn"
            aria-label="Replay founders animation"
            onClick={replay}
            disabled={reduced}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
