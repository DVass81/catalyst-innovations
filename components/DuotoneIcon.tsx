import {
  AppWindow, BarChart3, BrainCircuit, Briefcase, Building2, Factory, Flame,
  HardHat, HeartHandshake, Landmark, MapPin, MonitorPlay, PenTool, PiggyBank,
  Plug, Rocket, Ruler, Search, ShoppingCart, Sprout, Stethoscope, TrendingUp,
  Trophy, Truck, Warehouse, Workflow, Wrench, Zap, type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  AppWindow, BarChart3, BrainCircuit, Briefcase, Building2, Factory, Flame,
  HardHat, HeartHandshake, Landmark, MapPin, MonitorPlay, PenTool, PiggyBank,
  Plug, Rocket, Ruler, Search, ShoppingCart, Sprout, Stethoscope, TrendingUp,
  Trophy, Truck, Warehouse, Workflow, Wrench, Zap,
};

/**
 * Bespoke two-tone icon treatment: an oversized, softened backdrop copy of
 * the glyph in the light brand tone sits behind a crisp foreground copy in
 * the dark brand tone. Off-the-shelf Lucide icons rendered this way read as
 * a designed system rather than "another SaaS site using Lucide."
 */
export function DuotoneIcon({
  name, size = 24, dark = false, className = "",
}: { name: string; size?: number; dark?: boolean; className?: string }) {
  const C = map[name] ?? AppWindow;
  const back = dark ? "text-steel-300/35" : "text-steel-400/30";
  const front = dark ? "text-steel-200" : "text-steel-600";
  return (
    <span className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }} aria-hidden="true">
      <C size={size * 1.32} strokeWidth={1.5} className={`absolute -translate-x-[7%] translate-y-[7%] ${back}`} />
      <C size={size} strokeWidth={1.8} className={`relative ${front}`} />
    </span>
  );
}
