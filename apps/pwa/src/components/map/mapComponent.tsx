"use client";

import { useWindowSize } from "@/hooks/useWindowSize";
import { PeebuddyMap, ToiletMarkerType } from "@workspace/map";
import { useEffect } from "react";
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

export default function MapComponent() {
  const { width, height } = useWindowSize();

  return (
    <PeebuddyMap
      style={{ width: width, height: height }}
      toilets={toilets}
      onToiletClick={(toilet: ToiletMarkerType) =>
        console.log("Toilette cliquée:", toilet)
      }
      showControls={false}
      autoLocate={true}
    />
  );
}
