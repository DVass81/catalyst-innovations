import Link from "next/link";
import { getBlogEditorUrl } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/blog/editor", title: "Editorial Sign-in", description: "Private editorial workspace for the Catalyst team.", noIndex: true });
export default function EditorialSignIn() {
  const url = getBlogEditorUrl();
  const connected = url && /^[a-z0-9]{3,32}$/.test(process.env.NEXT_PUBLIC_BLOG_SANITY_PROJECT_ID || "");
  return <section className="wrap page-intro">
    <p className="overline">For the Catalyst publishing team</p>
    <h1>The Blog<br /><em>editor.</em></h1>
    <p className="intro-copy">A short Friday read about the work that slows businesses down—and practical ways to improve it.</p>
    {connected ? <>
      <a className="button" href={url} target="_blank" rel="noopener noreferrer">Sign in to the Blog editor ↗<span className="sr-only"> (opens Sanity in a new tab)</span></a>
      <p style={{ marginTop: 22 }}>Use your authorized Google account. Drafts stay private; publishing is an explicit, separate action.</p>
    </> : <>
      <p style={{ marginTop: 22 }}>The publishing account connection still needs to be completed. Sign in to the company’s Sanity account to continue setup. This account sign-in is separate from a connected, ready-to-publish editor.</p>
      <a className="button" href="https://www.sanity.io/manage" target="_blank" rel="noopener noreferrer">Sign in to connect publishing ↗<span className="sr-only"> (opens Sanity in a new tab)</span></a>
    </>}
    <div className="content-section" style={{ maxWidth: 760 }}>
      <h2>Draft. Review. Approve. Publish.</h2>
      <ol style={{ marginTop: 24, paddingLeft: 24, listStyle: "decimal", display: "grid", gap: 18, lineHeight: 1.8 }}>
        <li>Prepare a three- to five-minute article about a business problem, useful research and practical steps.</li>
        <li>Check every statistic against its source, including the date, audience and limits of the research.</li>
        <li>Josh reviews the exact version. An edit to its content requires renewed approval.</li>
        <li>After approval, use Publish in the connected editor. Published articles appear here without changing the website code.</li>
      </ol>
      <p style={{ marginTop: 24 }}>Echo can use the same authenticated publishing workflow after Josh’s approval. No post is published or sent to social media automatically. Use only information and images approved for public use.</p>
      <p style={{ marginTop: 24 }}><Link href="/blog" className="text-link">Read the Blog ↗</Link></p>
    </div>
  </section>;
}
