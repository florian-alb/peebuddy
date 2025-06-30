"use client";

import { Marker } from "react-leaflet";
import { ToiletMarkerType } from "../types/types";
import { createToiletIcon } from "../lib/utils";

interface ToiletMarkerProps {
  toilet: ToiletMarkerType;
  onClick?: (toilet: ToiletMarkerType) => void;
}

export const ToiletMarker = ({ toilet, onClick }: ToiletMarkerProps) => {
  const icon = createToiletIcon(toilet.isVerified);

  const handleClick = () => {
    if (onClick) {
      onClick(toilet);
    }
  };

  return (
    <Marker
      position={toilet.position}
      icon={icon}
      eventHandlers={{
        click: handleClick,
      }}
    ></Marker>
  );
};
