"use client";

import { Marker, Popup } from "react-leaflet";
import { ToiletMarker as ToiletMarkerType } from "../types/types";
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
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold text-lg">{toilet.name || "Toilette"}</h3>
          {toilet.address && (
            <p className="text-sm text-gray-600 mt-1">{toilet.address}</p>
          )}
          {toilet.rating && (
            <div className="flex items-center mt-2">
              <span className="text-sm text-gray-600 mr-2">Note:</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < Math.floor(toilet.rating!)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-1">
                ({toilet.rating.toFixed(1)})
              </span>
            </div>
          )}
          {toilet.isVerified && (
            <div className="flex items-center mt-2">
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                ✓ Vérifié
              </span>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
};
