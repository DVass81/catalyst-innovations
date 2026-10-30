import HomeStudio from "@/components/studio/HomeStudio";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  path: "/",
  title: "Catalyst Innovations — Custom software. A better-running business.",
  description:
    "Custom business software and workflow automation from Knoxville, Tennessee. Connect customers, jobs, inventory and accounting around the way you work.",
});

export default function Home() {
  return <HomeStudio />;
}
