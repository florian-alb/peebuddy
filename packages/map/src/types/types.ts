import React from "react";
import { LatLngExpression, MapOptions, Icon, DivIcon } from "leaflet";

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
