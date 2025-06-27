"use client";

import dynamic from "next/dynamic";
import { ToiletMarkerType } from "@workspace/map";

const MapComponent = dynamic(() => import("./mapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-gray-600">Chargement de la carte...</div>
    </div>
  ),
});

const toilets: ToiletMarkerType[] = [
  {
    id: "1",
    position: [43.6043, 1.4437], // Toulouse
    name: "Toilette publique",
    address: "123 Rue de la Paix, Toulouse",
    rating: 4.5,
    isVerified: true,
  },
];

export default function DynamicMap() {
  return <MapComponent />;
}
