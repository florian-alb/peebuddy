import React from "react";
import { LatLngExpression, MapOptions, Icon, DivIcon, Map } from "leaflet";

export interface MapComponentProps {
  center?: LatLngExpression;
  zoom?: number;
  className?: string;
  style?: React.CSSProperties;
  mapOptions?: Partial<MapOptions>;
  children?: React.ReactNode;
}

export interface MarkerProps {
  position: LatLngExpression;
  title?: string;
  popup?: React.ReactNode;
  icon?: Icon | DivIcon;
  onClick?: () => void;
  children?: React.ReactNode;
}

export interface MapContainerProps {
  center: LatLngExpression;
  zoom: number;
  className?: string;
  style?: React.CSSProperties;
  mapOptions?: Partial<MapOptions>;
  children?: React.ReactNode;
}

export interface ToiletMarkerType {
  id: string;
  position: LatLngExpression;
  name: string;
  address: string;
  rating?: number;
  isVerified: boolean;
}

export interface MapContextType {
  map: Map | null;
  setMap: (map: Map | null) => void;
}
