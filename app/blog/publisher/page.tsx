import { cookies } from "next/headers";
import NativeBlogPublisher from "@/components/NativeBlogPublisher";
import { publisherConfigured, publisherCookieName, readPublisherSession } from "@/lib/blog-publisher-auth";
import { pageMetadata } from "@/lib/seo";
import "../editor/editor.css";
import "./publisher.css";

export const metadata = { ...pageMetadata({ path: "/blog/publisher", title: "Weekly blog publisher", description: "Private weekly publishing for the Catalyst Blog.", noIndex: true }), robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BlogPublisherPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (readPublisherSession((await cookies()).get(publisherCookieName())?.value)) return <NativeBlogPublisher />;
  const error = (await searchParams).error;
  return <section className="wrap page-intro native-blog-signin">
    <p className="overline">The Catalyst Blog</p><h1>Weekly blog publisher</h1>
    <p className="intro-copy">Private access to preview, publish, and check this week’s article.</p>
    {publisherConfigured() ? <form action="/api/blog/publisher/session" method="post">
      {error && <p role="alert">{error === "wait" ? "Too many sign-in attempts. Try again in 15 minutes." : "That password wasn’t accepted. Please try again."}</p>}
      <label htmlFor="publisher-password">Publisher password</label>
      <input id="publisher-password" name="password" type="password" autoComplete="current-password" required minLength={16} maxLength={256} />
      <button className="button button-primary" type="submit">Open publisher</button>
    </form> : <p role="status">The private publisher is waiting for activation. The regular editor and public blog are available as usual.</p>}
  </section>;
}
