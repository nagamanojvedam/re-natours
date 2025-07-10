import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
// import "./map.css";

function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, lng] = [39.753, 35.6844];
  const zoom = 12;
  const API_KEY = "Dts8SoqZ4IkXOU4A6RzS";

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`,
      center: [lng, lat],
      zoom,
    });
  }, [API_KEY, lng, lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} style={{ width: "100%" }} />
    </div>
  );
}

export default Map;
