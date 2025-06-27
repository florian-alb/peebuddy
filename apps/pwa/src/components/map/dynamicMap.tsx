"use client";

import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./mapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">
      <div className="text-gray-600">Chargement de la carte...</div>
    </div>
  ),
});

export default function DynamicMap() {
  return <MapComponent />;
}
