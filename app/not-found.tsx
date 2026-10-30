import Link from "next/link";

export default function NotFound() {
  return <div className="studio-page"><section className="wrap studio-placeholder"><p className="overline">404 / Page not found</p><h1>Let’s find the<br />right next step.</h1><p>This address does not lead to a page on the Catalyst website. Explore our services or return to the homepage.</p><Link className="button" href="/">Back to the homepage ↗</Link><Link className="text-link" href="/services">Explore our services ↗</Link></section></div>;
}
