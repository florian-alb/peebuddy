"use client";

import { useEffect, useState } from "react";
import { useMap, Marker, L } from "@workspace/map";

interface UserLocationMarkerProps {
  position: [number, number];
  accuracy?: number;
}

export const UserLocationMarker = ({
  position,
  accuracy,
}: UserLocationMarkerProps) => {
  const map = useMap();
  const [userIcon] = useState(
    () =>
      new L.Icon({
        iconUrl:
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyQzIgMTcuNTIgNi40OCAyMiAxMiAyMkMxNy41MiAyMiAyMiAxNy41MiAyMiAxMkMyMiA2LjQ4IDE3LjUyIDIgMTIgMloiIGZpbGw9IiMyNTYzRUYiLz4KPHBhdGggZD0iTTEyIDZDNi40OCA2IDIgMTAuNDggMiAxNkMyIDIxLjUyIDYuNDggMjYgMTIgMjZDMjEuNTIgMjYgMjYgMjEuNTIgMjYgMTZDMjYgMTAuNDggMjEuNTIgNiAxMiA2WiIgZmlsbD0iIzI1NjNFRiIgZmlsbC1vcGFjaXR5PSIwLjMiLz4KPHBhdGggZD0iTTEyIDEwQzE0LjIwOTEgMTAgMTYgMTEuNzkwOSAxNiAxNEMxNiAxNi4yMDkxIDE0LjIwOTEgMTggMTIgMThDOS43OTA5IDE4IDggMTYuMjA5MSA4IDE0QzggMTEuNzkwOSA5Ljc5MDkgMTAgMTIgMTBaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      })
  );

  return <Marker position={position} icon={userIcon} />;
};
