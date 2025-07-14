import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map({ locations = [] }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style:
        "https://api.maptiler.com/maps/basic-v2/style.json?key=PhnTkAHukY3eCHps7II9",
      center: [39.753, 35.6844], // fallback initial center
      zoom: 12,
    });

    map.scrollZoom.disable(); // disable scroll zoom
    mapRef.current = map;

    const bounds = new maplibregl.LngLatBounds();

    locations.forEach(({ coordinates, day, description }) => {
      // Marker
      const el = document.createElement("div");
      el.className = "marker";

      new maplibregl.Marker({ element: el, anchor: "bottom" })
        .setLngLat(coordinates)
        .addTo(map);

      // Popup
      new maplibregl.Popup({ offset: 40 })
        .setLngLat(coordinates)
        .setHTML(`<p>Day ${day}: ${description}</p>`)
        .addTo(map);

      bounds.extend(coordinates);
    });

    map.fitBounds(bounds, {
      padding: { top: 200, bottom: 150, left: 100, right: 100 },
      maxZoom: 10,
      duration: 1000,
    });

    return () => map.remove(); // Clean up
  }, [locations]);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "700px" }}
    />
  );
}
