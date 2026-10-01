/** Builds a user-reviewed email draft locally; it never transmits or claims delivery. */
export function inquiryEmailDraft(
  data: Record<string, unknown>,
  context: { tool?: string; demo?: string; summary?: string },
) {
  const fields = [
    ["Name", data.name],
    ["Email", data.email],
    ["Business", data.company],
    ["Main struggle", data.challenge],
    ["Industry", data.industry],
    ["Phone", data.phone],
    [
      "Challenges",
      Array.isArray(data.struggleCategories)
        ? data.struggleCategories.join(", ")
        : undefined,
    ],
    ["Current tools", data.currentTools],
    ["Desired improvement", data.desiredOutcome],
    ["Demo", context.demo],
    ["Calculator", context.tool],
    ["Calculation shared by choice", context.summary],
  ];
  const body = fields
    .filter(([, value]) => typeof value === "string" && value.trim())
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n\n");
  const subject = `Catalyst inquiry — ${String(data.company ?? "My business").replace(/[\r\n]/g, " ")}`;
  const base = `mailto:daniel@mycatalystinnovations.com?subject=${encodeURIComponent(subject)}`;
  const full = `${base}&body=${encodeURIComponent(body)}`;
  return {
    body,
    href: full.length <= 1800 ? full : base,
    copyRequired: full.length > 1800,
  };
}
