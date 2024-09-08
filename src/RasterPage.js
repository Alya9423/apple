import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams from react-router-dom
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const RasterPage = () => {
  const { rasterId } = useParams(); // Extract rasterId from route parameters
  const apiKey = 'f8773ad8ac1b2964bbd054888667d03c4fd059b99f7a89ef590342676b87e89f';

  useEffect(() => {
    console.log('Extracted rasterId:', rasterId); // Log the extracted rasterId

    const rasterApiUrl = `https://app.picterra.ch/public/api/v2/rasters/${rasterId}/`;
    const vectorLayerApiUrl = `https://app.picterra.ch/public/api/v2/rasters/${rasterId}/vector_layers/`;

    const map = L.map('map').setView([21.4735, 55.9277], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © OpenStreetMap contributors'
    }).addTo(map);

    const addPicterraLayer = (apiUrl, apiKey) => {
      fetch(apiUrl, {
        headers: {
          'X-Api-Key': apiKey,
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'ready') {
          L.tileLayer(data.tms_url, {
            maxZoom: data.tiles_max_zoom,
            minZoom: data.tiles_min_zoom,
            attribution: 'Tiles © Picterra',
            tms: true,
          }).addTo(map);
        } else {
          console.error('Raster is not ready.');
        }
      })
      .catch(error => console.error('Error fetching Picterra API:', error));
    };

    const addGeoJSON = (url, color = '#ff7800') => {
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const layer = L.geoJSON(data, {
            style: { color },
          }).addTo(map);
          map.fitBounds(layer.getBounds());
        })
        .catch(error => console.error('Error fetching GeoJSON:', error));
    };

    const addVectorLayers = (apiUrl) => {
      fetch(apiUrl, {
        headers: {
          'X-Api-Key': apiKey,
        }
      })
      .then(response => response.json())
      .then(data => {
        if (data.count > 0) {
          data.results.forEach(layer => {
            const color = layer.color || '#ff7800';
            layer.geojson_urls.forEach(url => addGeoJSON(url, color));
          });
        } else {
          console.error('No vector layers found.');
        }
      })
      .catch(error => console.error('Error fetching vector layers:', error));
    };

    addPicterraLayer(rasterApiUrl, apiKey);
    addVectorLayers(vectorLayerApiUrl);

    return () => {
      map.remove();
    };
  }, [rasterId]);

  return (
    <div>
      <h1>Map Viewer</h1>
      <div id="map" style={{ height: '70vh' }}></div>
    </div>
  );
};

export default RasterPage;
