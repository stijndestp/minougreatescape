import type { Metadata } from "next";
import SceneHost from "@/components/SceneHost";
import { locations } from "@/content/locations";

export const metadata: Metadata = { title: "Spel – Minou's Great Escape" };

export function generateStaticParams() {
  return locations.map((l) => ({ locationId: l.id }));
}

export default async function ScenePage({ params }: { params: Promise<{ locationId: string }> }) {
  const { locationId } = await params;
  return <SceneHost locationId={locationId} />;
}