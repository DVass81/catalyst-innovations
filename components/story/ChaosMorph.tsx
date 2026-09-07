"use client";
import { motion, useTransform, type MotionValue } from "framer-motion";
import { MorphPath, panel } from "./MorphPaths";
export default function ChaosMorph({
  progress,
  approved,
}: {
  progress: MotionValue<number>;
  approved: boolean;
}) {
  const inputOpacity = useTransform(progress, [0, 0.2, 0.48, 1], [1, 1, 0, 0]);
  const outputOpacity = useTransform(
    progress,
    [0, 0.55, 0.85, 1],
    [0, 0, 1, 1],
  );
  const frameOpacity = useTransform(progress, [0, 0.25, 0.65, 1], [0, 0, 1, 1]);
  const lineDraw = useTransform(
    progress,
    [0, 0.25, 0.7, 1],
    [0.1, 0.2, 0.9, 1],
  );
  return (
    <svg className="story-chaos-svg" viewBox="0 0 680 440" aria-hidden="true">
      <defs>
        <linearGradient id="chaos-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#173955" />
          <stop offset="1" stopColor="#0a192b" />
        </linearGradient>
        <radialGradient id="chaos-light">
          <stop stopColor="#357cba" stopOpacity=".25" />
          <stop offset="1" stopColor="#357cba" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx="350" cy="220" rx="300" ry="200" fill="url(#chaos-light)" />
      <g stroke="#28516e" strokeWidth=".7" opacity=".4">
        {[110, 180, 250, 320, 390, 460, 530, 600].map((x) => (
          <path key={x} d={`M${x} 40V390`} />
        ))}
        {[80, 150, 220, 290, 360].map((y) => (
          <path key={y} d={`M40 ${y}H650`} />
        ))}
      </g>
      <MorphPath
        data-morph="chaos-outline"
        progress={progress}
        stops={[0, 0.24, 0.7, 1]}
        shapes={[
          "M 70 255 C 175 10 570 415 320 250 C 110 100 520 15 570 180 C 620 345 160 420 310 230 C 420 65 625 235 650 250",
          "M 70 245 C 150 15 510 330 310 235 C 170 140 470 45 540 175 C 600 300 230 380 330 245 C 430 125 600 240 650 245",
          "M 50 236 C 100 236 135 236 190 236 C 230 236 240 236 285 236 C 350 236 375 236 435 236 C 480 236 540 236 630 236",
          "M 50 236 C 100 236 135 236 190 236 C 230 236 240 236 285 236 C 350 236 375 236 435 236 C 480 236 540 236 630 236",
        ]}
        fill="none"
        stroke="#75b6ff"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <motion.path
        d={panel(72, 83, 542, 281, 17)}
        fill="#0c2034"
        fillOpacity=".7"
        stroke="#4a7fa5"
        style={{ opacity: frameOpacity }}
      />
      <motion.g style={{ opacity: frameOpacity }}>
        <path d="M73 130H613" stroke="#3c6182" />
        <circle cx="97" cy="107" r="4" fill="#75b6ff" />
        <circle cx="112" cy="107" r="4" fill="#436684" />
        <circle cx="127" cy="107" r="4" fill="#436684" />
        <text x="155" y="113" fill="#b9cfe3" fontSize="15" letterSpacing="2">
          YOUR CONNECTED WORKSPACE
        </text>
      </motion.g>
      <g stroke="#75b6ff" strokeWidth="1.5" fill="url(#chaos-sheen)">
        <MorphPath
          data-morph="chaos-outline"
          progress={progress}
          stops={[0, 0.22, 0.75, 1]}
          shapes={[
            panel(35, 76, 222, 142, 15),
            panel(92, 72, 191, 170, 42),
            panel(96, 171, 145, 140, 10),
            panel(96, 171, 145, 140, 10),
          ]}
        />
        <MorphPath
          data-morph="chaos-outline"
          progress={progress}
          stops={[0, 0.22, 0.75, 1]}
          shapes={[
            panel(399, 47, 222, 157, 8),
            panel(370, 73, 228, 180, 34),
            panel(270, 171, 145, 140, 10),
            panel(270, 171, 145, 140, 10),
          ]}
        />
        <MorphPath
          data-morph="chaos-outline"
          progress={progress}
          stops={[0, 0.22, 0.75, 1]}
          shapes={[
            panel(237, 269, 215, 127, 5),
            panel(259, 211, 212, 143, 34),
            panel(444, 171, 145, 140, 10),
            panel(444, 171, 145, 140, 10),
          ]}
        />
      </g>
      <MorphPath
        data-morph="chaos-outline"
        progress={progress}
        shapes={[
          "M 50 101 C 80 119 114 160 146 177 C 177 163 215 120 244 101",
          "M 118 218 C 136 218 179 218 215 218 C 215 218 215 218 215 218",
        ]}
        fill="none"
        stroke="#c7e3ff"
        strokeWidth="2"
      />
      <MorphPath
        data-morph="chaos-outline"
        progress={progress}
        shapes={[
          "M 420 92 C 460 92 545 92 597 92 C 597 110 597 140 597 155",
          "M 298 243 C 306 243 314 250 325 262 C 341 247 367 215 386 205",
        ]}
        fill="none"
        stroke={approved ? "#91ebcf" : "#75b6ff"}
        strokeWidth="2.5"
      />
      <MorphPath
        data-morph="chaos-outline"
        progress={progress}
        shapes={[
          "M 260 300 C 310 300 365 300 428 300 C 428 300 428 300 428 300",
          "M 466 215 C 480 215 533 215 565 215 C 565 215 565 215 565 215",
        ]}
        fill="none"
        stroke="#a4cdf0"
        strokeWidth="2"
      />
      <motion.g style={{ opacity: inputOpacity }} fill="#bdd4e9" fontSize="16">
        <text x="55" y="204">
          “Who’s approving this?”
        </text>
        <text x="420" y="182">
          Three versions. One request.
        </text>
        <text x="259" y="367">
          Still waiting for an answer.
        </text>
        <path
          d="M422 115H594M422 137H558M262 322H392"
          stroke="#638cac"
          strokeWidth="2"
        />
      </motion.g>
      <motion.g style={{ opacity: outputOpacity }} fill="#d9e9f7" fontSize="16">
        <text x="116" y="197">
          REQUEST
        </text>
        <text x="116" y="253">
          REQ–024
        </text>
        <text x="116" y="286" fill="#a3c9e8">
          One clear owner
        </text>
        <text x="292" y="197">
          {approved ? "APPROVED" : "YOUR REVIEW"}
        </text>
        <text x="292" y="287" fill="#a3c9e8">
          Human decision
        </text>
        <text x="464" y="197">
          NEXT STEP
        </text>
        <text x="464" y="252">
          Purchasing
        </text>
        <text x="464" y="286" fill="#a3c9e8">
          {approved ? "Ready to move" : "Awaiting review"}
        </text>
      </motion.g>
      <motion.path
        d="M241 238H268M415 238H442"
        stroke="#91ebcf"
        strokeWidth="3"
        fill="none"
        style={{ pathLength: lineDraw, opacity: outputOpacity }}
      />
      <motion.g style={{ opacity: outputOpacity }}>
        <text x="98" y="344" fill="#8faac3" fontSize="13" letterSpacing="1.5">
          ONE REQUEST. EVERY HANDOFF CONNECTED.
        </text>
        <circle
          cx="583"
          cy="339"
          r="5"
          fill={approved ? "#91ebcf" : "#75b6ff"}
        />
      </motion.g>
    </svg>
  );
}
