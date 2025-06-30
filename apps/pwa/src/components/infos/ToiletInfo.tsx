"use client";

import { ToiletMarkerType } from "@workspace/map";
import { MapPin, X } from "lucide-react";

interface ToiletInfoProps {
  toilet: ToiletMarkerType;
  onClose: () => void;
}

export const ToiletInfo = ({ toilet, onClose }: ToiletInfoProps) => {
  return (
    <div className="fixed bottom-4 left-4 right-4 bg-white border border-gray-300 px-4 py-3 rounded-lg shadow-lg z-[1000]">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-blue-500" />
            <h3 className="font-medium text-sm">{toilet.name}</h3>
          </div>
          <p className="text-xs text-gray-600 mb-2">{toilet.address}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500">★</span>
              <span className="text-xs">{toilet.rating}</span>
            </div>
            {toilet.isVerified && (
              <span className="text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded">
                Vérifié
              </span>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 ml-2"
          title="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
