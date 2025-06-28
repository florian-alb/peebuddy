"use client";

import { useMap } from "../hooks/useMap";
import { Loader2Icon, Locate, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export const LocationButton = () => {
  const { getLocation, isLoadingLocation } = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000]">
      {isLoadingLocation ? (
        <Button size="sm" variant="outline" disabled>
          <Loader2Icon className="animate-spin" />
        </Button>
      ) : (
        <Button size="sm" variant="outline" onClick={getLocation}>
          <Locate />
        </Button>
      )}
    </div>
  );
};

export const ZoomControls = () => {
  const { map } = useMap();

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  return (
    <div className="absolute top-4 left-4 z-[1000] flex gap-2 flex-col">
      <Button size="sm" variant="outline" onClick={zoomOut}>
        <ZoomOut />
      </Button>
      <Button size="sm" variant="outline" onClick={zoomIn}>
        <ZoomIn />
      </Button>
    </div>
  );
};
