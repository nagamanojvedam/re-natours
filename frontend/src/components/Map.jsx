import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

export default function Map({ locations }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;
    // if (mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,

      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=PhnTkAHukY3eCHps7II9`,

      center: [39.753, 35.6844], // initial center required
      zoom: 12,
    });

    map.scrollZoom.disable(); // disable scroll zoom explicitly
    mapRef.current = map;

    const bounds = new maplibregl.LngLatBounds();

    locations.forEach((location) => {
      const el = document.createElement("div");
      el.className = "marker";

      new maplibregl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat(location.coordinates)
        .addTo(map);

      new maplibregl.Popup({ offset: 40 })
        .setLngLat(location.coordinates)
        .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
        .addTo(map);

      bounds.extend(location.coordinates);
    });

    map.fitBounds(bounds, {
      padding: { top: 200, bottom: 150, left: 100, right: 100 },
      maxZoom: 10,
    });

    return () => map.remove(); // Clean up on unmount
  }, [locations]);

  return (
    <div
      id="map"
      ref={mapContainer}
      style={{ width: "100%", height: "700px" }}
    />
  );
}
