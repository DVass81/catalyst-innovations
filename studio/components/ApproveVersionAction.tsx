import { useState } from "react";
import { useCurrentUser, useDocumentOperation, type DocumentActionComponent } from "sanity";
import { contentFingerprint } from "../lib/approval";

/** A visible manual approval step. Free-plan administrators still control the project API. */
export const ApproveVersionAction: DocumentActionComponent = (props) => {
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const user = useCurrentUser();
  const { patch } = useDocumentOperation(props.id, props.type);
  const reviewer = (process.env.SANITY_STUDIO_APPROVER_EMAIL || "").trim().toLowerCase();
  const isJosh = Boolean(reviewer && user?.email?.trim().toLowerCase() === reviewer);
  const document = props.draft || props.published;
  const review = document?.editorialReview as Record<string, unknown> | undefined;
  const checked = ["accurate", "privateData", "sources", "preview", "statistics"].every(key => review?.[key] === true);
  return {
    label: busy ? "Recording approval…" : failed ? "Approval failed — retry (Josh)" : "Approve this version (Josh)",
    disabled: busy || !isJosh || !checked || !document || Boolean(patch.disabled),
    title: !reviewer ? "Configure Josh's Sanity sign-in email first." : !isJosh ? "Josh must sign in with the configured reviewer account to approve." : !checked ? "Complete every content-review check first." : "Approve the current content. Publish is a separate action.",
    onHandle: async () => {
      if (!isJosh || !checked || !document || !window.confirm("Josh: approve this exact version for the Catalyst Blog? Review the text, sources and preview first. This records approval; it does not publish.")) return;
      setBusy(true);
      setFailed(false);
      try {
        const fingerprint = await contentFingerprint(document);
        patch.execute([{ set: { approval: { _type: "object", approvedBy: "josh", approvedAt: new Date().toISOString(), fingerprint } } }]);
        props.onComplete();
      } catch { setFailed(true);
      } finally { setBusy(false); }
    },
  };
};
