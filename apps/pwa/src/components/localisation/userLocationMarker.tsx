"use client";

import { useState } from "react";
import { Marker } from "react-leaflet";
import L from "leaflet";

import arrowIcon from "../../../public/icons/arrow.png";

interface UserLocationMarkerProps {
  position: [number, number];
}

export const UserLocationMarker = ({ position }: UserLocationMarkerProps) => {
  const [userIcon] = useState(
    () =>
      new L.Icon({
        iconUrl: arrowIcon.src,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
  );

  return <Marker position={position} icon={userIcon} />;
};
