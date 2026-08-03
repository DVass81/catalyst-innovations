"use client";

import { Mail } from "lucide-react";
import { track } from "@/lib/site";

export default function EmailLink({
  email,
  label,
  context,
  className = "",
}: {
  email: string;
  label?: string;
  /** Identifies where the click happened, e.g. a founder slug or "footer". */
  context: string;
  className?: string;
}) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={() => track("email_click", { context })}
      className={`inline-flex items-center gap-2 text-sm font-medium text-steel-600 hover:underline ${className}`}
    >
      <Mail size={15} />
      {label ?? email}
    </a>
  );
}
