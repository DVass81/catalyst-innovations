import Link from "next/link";
import { getBlogEditorUrl } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/blog/editor", title: "Editorial Sign-in", description: "Private editorial workspace for the Catalyst team.", noIndex: true });
export default function EditorialSignIn() {
  const url = getBlogEditorUrl();
  return <section className="wrap page-intro"><p className="overline">For the Catalyst team</p><h1>The editorial<br /><em>workspace.</em></h1><p className="intro-copy">Draft, review and publish useful guides for better-running businesses.</p>{url ? <><a className="button" href={url} target="_blank" rel="noopener noreferrer">Sign in to the private editor ↗</a><p style={{ marginTop: 22 }}>The editor opens in Sanity and requires an authorized team account. Uploaded assets must be intended for public use.</p></> : <p>The private editor’s account setup is on hold. Existing guides remain available, and the Catalyst team can continue publishing through the website’s existing release process.</p>}<p style={{ marginTop: 22 }}><Link href="/insights" className="text-link">Read Blog & Guides ↗</Link></p></section>;
}
