import "leaflet-routing-machine";

declare module "leaflet" {
  namespace Routing {
    interface RoutingControlOptions {
      createMarker?: (
        i: number,
        waypoint: L.Routing.Waypoint,
        n: number
      ) => L.Marker | null;
    }
  }
}
