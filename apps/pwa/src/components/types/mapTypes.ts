import { Toilet } from "@workspace/db";
import { DivIcon, Icon, LatLngExpression, MapOptions } from "leaflet";

export interface MarkerProps {
  position: LatLngExpression;
  title?: string;
  popup?: React.ReactNode;
  icon?: Icon | DivIcon;
  onClick?: () => void;
  children?: React.ReactNode;
}
