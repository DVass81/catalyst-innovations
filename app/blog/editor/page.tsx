import { cookies } from "next/headers";
import NativeBlogEditor from "@/components/NativeBlogEditor";
import { editorConfigured, editorCookieName, hasEditorSession } from "@/lib/blog-editor-auth";
import { pageMetadata } from "@/lib/seo";
import "./editor.css";

export const metadata = { ...pageMetadata({ path: "/blog/editor", title: "Blog editor", description: "Private publishing for the Catalyst Blog.", noIndex: true }), robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function BlogEditorPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if (hasEditorSession((await cookies()).get(editorCookieName())?.value)) return <NativeBlogEditor />;
  const error = (await searchParams).error;
  return <section className="wrap page-intro native-blog-signin">
    <p className="overline">The Catalyst Blog</p><h1>Blog editor</h1>
    <p className="intro-copy">Paste your article, check the preview, and publish.</p>
    {editorConfigured() ? <form action="/api/blog/editor/session" method="post">
      {error && <p role="alert">{error === "wait" ? "Too many sign-in attempts. Try again in 15 minutes." : "That password wasn’t accepted. Please try again."}</p>}
      <label htmlFor="editor-password">Editor password</label>
      <input id="editor-password" name="password" type="password" autoComplete="current-password" required minLength={16} maxLength={256} />
      <button className="button button-primary" type="submit">Open editor</button>
    </form> : <p role="status">Your private editor is waiting for activation. The public blog is available as usual.</p>}
  </section>;
}
