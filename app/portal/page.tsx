import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ path: "/portal", title: "Client Portal", description: "The Catalyst Innovations client portal — coming soon for active engagement partners.", noIndex: true });

export default function PortalPage() {
  return <div className="studio-page"><section className="wrap studio-placeholder"><p className="overline">Client portal / In preparation</p><h1>A place for<br />working together.</h1><p>The client portal is being prepared. If you need information about your project, contact your Catalyst project lead directly.</p><Link className="button" href="/contact">Contact Josh and Daniel ↗</Link><Link className="text-link" href="/services">Explore our services ↗</Link></section></div>;
}
