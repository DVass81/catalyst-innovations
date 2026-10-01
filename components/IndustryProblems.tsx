import type { Industry } from "@/data/redesign";
export default function IndustryProblems({ industry }: { industry: Industry }) {
  return (
    <ul className="problem-pairs">
      {industry.problems.map((problem, index) => (
        <li key={problem}>
          <div>
            <span>Common problem</span>
            <strong className="problem-title">{problem}</strong>
          </div>
          <div>
            <span>How Catalyst can help</span>
            <p>{industry.solutions[index]}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
