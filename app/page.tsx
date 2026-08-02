import type { Metadata } from "next";
import dynamic from "next/dynamic";
import PortalHero from "@/components/home/PortalHero";
import StoryTransform from "@/components/home/StoryTransform";
import {
  Credibility, Problems, SolutionsOverview, PortfolioPreview,
  IndustriesPreview, Outcomes, FoundersPreview, WhyCatalyst, InsightsPreview,
} from "@/components/home/HomeSections";
import EditorialBreak from "@/components/home/EditorialBreak";
import Epilogue from "@/components/home/Epilogue";
import CTABand from "@/components/CTABand";

// Below-fold set pieces are code-split so first paint stays fast.
const DayStory = dynamic(() => import("@/components/home/DayStory"));
const MethodJourney = dynamic(() => import("@/components/home/MethodJourney"));
const ROICalculator = dynamic(() => import("@/components/ROICalculator"));

export const metadata: Metadata = {
  title: "Catalyst Innovations — Turn Operational Problems Into Intelligent Systems",
  description:
    "Catalyst Innovations combines real-world operational experience, modern software, automation, and practical AI to help organizations make more money, save time, and work smarter.",
};

export default function HomePage() {
  return (
    <>
      <PortalHero />
      <StoryTransform />
      <Credibility />
      <Problems />
      <SolutionsOverview />
      <DayStory />
      <PortfolioPreview />
      <MethodJourney />
      <IndustriesPreview />
      <EditorialBreak />
      <Outcomes />
      <ROICalculator />
      <FoundersPreview />
      <WhyCatalyst />
      <InsightsPreview />
      <Epilogue />
      <CTABand />
    </>
  );
}
