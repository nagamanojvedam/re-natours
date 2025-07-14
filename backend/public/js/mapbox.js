import maplibregl from 'maplibre-gl';

export const displayMap = (locations) => {
  const map = new maplibregl.Map({
    container: 'map', // container id
    style:
      'https://api.maptiler.com/maps/dataviz/style.json?key=Dts8SoqZ4IkXOU4A6RzS', // style URL
    zoom: 1, // starting zoom
    scrollZoom: false,
  });

  const bounds = new maplibregl.LngLatBounds();

  locations.forEach((location) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new maplibregl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    new maplibregl.Popup({
      offset: 40,
    })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day: ${location.day}: ${location.description}</p>`)
      .addTo(map);

    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
    maxZoom: 10,
  });
};
