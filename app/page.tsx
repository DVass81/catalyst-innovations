import type { Metadata } from "next";
import PortalHero from "@/components/home/PortalHero";

export const metadata: Metadata = {
  title: "Catalyst Innovations — Turn Operational Problems Into Intelligent Systems",
  description:
    "Catalyst Innovations combines real-world operational experience, modern software, automation, and practical AI to help organizations make more money, save time, and work smarter.",
};

export default function HomePage() {
  return <PortalHero />;
}
