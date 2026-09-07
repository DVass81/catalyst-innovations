"use client";
import { motion } from "framer-motion";
import { useStoryTimeline } from "./StoryMotion";
export default function ClosingFrame() {
  const { ref: sceneRef, progress } = useStoryTimeline(3.5);
  return (
    <div ref={sceneRef} className="story-closing-frame" aria-hidden="true">
      <svg viewBox="0 0 1200 500" preserveAspectRatio="none">
        <path
          d="M14 0V54Q14 85 54 85H1138Q1170 85 1170 117V430Q1170 464 1136 464H64Q30 464 30 430V139"
          fill="none"
          stroke="#4e789c44"
          strokeWidth="1.3"
        />
        <motion.path
          d="M14 0V54Q14 85 54 85H1138Q1170 85 1170 117V430Q1170 464 1136 464H64Q30 464 30 430V139"
          fill="none"
          stroke="#85bffd"
          strokeWidth="1.3"
          style={{ pathLength: progress }}
        />
      </svg>
    </div>
  );
}
