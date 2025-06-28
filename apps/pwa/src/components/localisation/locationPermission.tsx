"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { MapPinned } from "lucide-react";

import { useState } from "react";

interface LocationPermissionProps {
  onPermissionGranted: (position: GeolocationPosition) => void;
  onPermissionDenied: () => void;
  isLoading?: boolean;
}

export const LocationPermission = ({
  onPermissionGranted,
  onPermissionDenied,
  isLoading = false,
}: LocationPermissionProps) => {
  const [isRequesting, setIsRequesting] = useState(false);

  const requestLocation = () => {
    setIsRequesting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsRequesting(false);
        onPermissionGranted(position);
      },
      (error) => {
        setIsRequesting(false);
        console.error("Erreur de géolocalisation:", error);

        switch (error.code) {
          case error.PERMISSION_DENIED:
            onPermissionDenied();
            break;
          case error.POSITION_UNAVAILABLE:
            console.log("Position non disponible");
            break;
          case error.TIMEOUT:
            console.log("Timeout de géolocalisation");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex flex-col items-center gap-2">
          <MapPinned className="w-10 h-10 text-primary" />
          <CardTitle className="text-lg font-semibold text-center">
            Localisation requise
          </CardTitle>
          <CardDescription className="text-sm text-center">
            PeeBuddy a besoin d'accéder à votre position pour vous montrer les
            toilettes les plus proches.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            onClick={onPermissionDenied}
            variant="outline"
            disabled={isRequesting || isLoading}
          >
            Plus tard
          </Button>

          <Button
            onClick={requestLocation}
            variant="default"
            disabled={isRequesting || isLoading}
          >
            {isRequesting || isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin mr-2"></div>
                Localisation...
              </div>
            ) : (
              "Autoriser"
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-center">
          Si vous refusez, vous ne pourrez pas utiliser l'application.
        </p>
      </CardFooter>
    </Card>
  );
};
