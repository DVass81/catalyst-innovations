/**
 * A compact reprise of the portal hero's AI-city light motifs (maglev
 * streak + drifting drone lights) — used as a section-header accent on
 * interior dark pages so the "other side" of the story feels like a
 * persistent place, not a one-time homepage cutscene.
 */
export default function CityAccent({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <div className="absolute bottom-[18%] left-0 right-0 h-px overflow-visible">
        <span
          className="maglev absolute h-[2px] w-28 rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #7dd3fc, #a8cbef, transparent)",
            boxShadow: "0 0 10px rgba(125,211,252,0.7)",
          }}
        />
      </div>
      {[["22%", "28%", "0s"], ["68%", "16%", "4s"]].map(([l, t, d], i) => (
        <span
          key={i}
          className="drone absolute h-[2.5px] w-[2.5px] rounded-full bg-[#7dd3fc]"
          style={{ left: l, top: t, animationDelay: d, boxShadow: "0 0 7px rgba(125,211,252,0.85)" }}
        />
      ))}
    </div>
  );
}
