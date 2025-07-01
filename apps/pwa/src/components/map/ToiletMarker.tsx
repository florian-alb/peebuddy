"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// Import toilet icons
import toiletVerifiedIcon from "../../../public/icons/icon-toilet-verified.png";
import toiletNotVerifiedIcon from "../../../public/icons/icon-toilet-not-verified.png";
import { Toilet } from "@workspace/db";

export interface ToiletMarkerProps {
  toilet: Toilet;
  onClick: () => void;
}

// Create custom icons
const createCustomIcon = (iconUrl: string) => {
  return L.icon({
    iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -40],
  });
};

const verifiedIcon = createCustomIcon(toiletVerifiedIcon.src);
const notVerifiedIcon = createCustomIcon(toiletNotVerifiedIcon.src);

export function ToiletMarker({ toilet, onClick }: ToiletMarkerProps) {
  const icon = toilet.is_verified ? verifiedIcon : notVerifiedIcon;

  return (
    <Marker
      position={[parseFloat(toilet.latitude), parseFloat(toilet.longitude)]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    ></Marker>
  );
}
