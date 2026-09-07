"use client";
export default function PrivacyPreferences() {
  return (
    <button
      type="button"
      className="ci-btn ci-btn-outline"
      onClick={() => window.dispatchEvent(new Event("ci-open-privacy"))}
    >
      Change analytics preference
    </button>
  );
}
