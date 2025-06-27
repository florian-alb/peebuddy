"use client";

import { useMap } from "react-leaflet";

interface MapControlsProps {
  onLocationClick?: () => void;
  isLoadingLocation?: boolean;
}

export const LocationButton = ({
  onLocationClick,
  isLoadingLocation,
}: MapControlsProps) => {
  const handleClick = () => {
    if (onLocationClick) {
      onLocationClick();
    }
  };

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <button
        onClick={handleClick}
        disabled={isLoadingLocation}
        className="bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-700 font-semibold py-2 px-3 rounded-lg shadow-lg border border-gray-300 transition-colors duration-200 flex items-center space-x-2"
        title="Ma position"
      >
        {isLoadingLocation ? (
          <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
        ) : (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
        <span className="hidden sm:inline">Ma position</span>
      </button>
    </div>
  );
};

export const ZoomControls = () => {
  const map = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex flex-col space-y-1">
      <button
        onClick={zoomIn}
        className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-lg shadow-lg border border-gray-300 transition-colors duration-200"
        title="Zoom +"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </button>
      <button
        onClick={zoomOut}
        className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-lg shadow-lg border border-gray-300 transition-colors duration-200"
        title="Zoom -"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 12H4"
          />
        </svg>
      </button>
    </div>
  );
};
