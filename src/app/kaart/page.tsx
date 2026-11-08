import type { Metadata } from "next";
import MapScreen from "@/components/MapScreen";

export const metadata: Metadata = { title: "Kaart – Minou's Great Escape" };

export default function KaartPage() {
  return <MapScreen />;
}
