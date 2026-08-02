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

export function Icon({ name, size = 22, className = "" }: { name: string; size?: number; className?: string }) {
  const C = map[name] ?? AppWindow;
  return <C size={size} className={className} aria-hidden="true" />;
}
