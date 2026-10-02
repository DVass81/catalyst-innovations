import { permanentRedirect } from "next/navigation";

export default function Founders() {
  permanentRedirect("/about#our-background");
}
