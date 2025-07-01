"use client";

import { Marker } from "react-leaflet";
import { Toilet } from "@workspace/db";
import { createToiletIcon } from "../lib/utils";

interface ToiletMarkerProps {
  toilet: Toilet;
  onClick?: (toilet: Toilet) => void;
}

export const ToiletMarker = ({ toilet, onClick }: ToiletMarkerProps) => {
  const icon = createToiletIcon(toilet.is_verified);

  const handleClick = () => {
    if (onClick) {
      onClick(toilet);
    }
  };

  console.log("toilet:", toilet);
  console.log("toilet latitue type:", typeof toilet.latitude);
  console.log("toilet longitude type:", typeof toilet.longitude);

  return (
    <Marker
      position={[Number(toilet.latitude), Number(toilet.longitude)]}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    ></Marker>
  );
};
