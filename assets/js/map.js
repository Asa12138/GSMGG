// Map Initialization: WGS 84 / NSIDC Sea Ice Polar Stereographic North.
const EPSG3413_BOUNDS = L.bounds([-4194304, -4194304], [4194304, 4194304]);

const epsg3413 = new L.Proj.CRS(
  'EPSG:3413',
  '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',
  {
    origin: [-4194304, 4194304],
    resolutions: [8192, 4096, 2048, 1024, 512],
    bounds: EPSG3413_BOUNDS
  }
);

const map = L.map('map', {
  crs: epsg3413,
  minZoom: 0,
  maxZoom: 4
}).setView([72, -40], 0);

const gibsTileOptions = {
  tileSize: 512,
  minZoom: 0,
  maxZoom: 4,
  noWrap: true
};

L.tileLayer(
  'https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/BlueMarble_NextGeneration/default/default/500m/{z}/{y}/{x}.jpeg',
  Object.assign({}, gibsTileOptions, {
    attribution: 'Imagery © NASA GIBS'
  })
).addTo(map);

L.tileLayer(
  'https://gibs.earthdata.nasa.gov/wmts/epsg3413/best/Reference_Labels/default/default/250m/{z}/{y}/{x}.png',
  Object.assign({}, gibsTileOptions, {
    attribution: 'Labels © NASA GIBS / OSM contributors'
  })
).addTo(map);

function getColor(perzone) {
  switch (perzone) {
    case 'Isolated':     return '#e31a1c';
    case 'Sporadic':     return '#EE7621';
    case 'Discontinuous': return '#007500';
    case 'Continuous':   return '#0840A1';
    default:             return 'gray';
  }
}

fetch('/data/metatbl_with_coordinates.csv')
  .then(response => {
    if (!response.ok) throw new Error('Failed to load CSV file');
    return response.text();
  })
  .then(csvText => {
    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function(results) {
        const sites = results.data;
        const siteBounds = L.latLngBounds([]);

        sites.forEach(site => {
          if (!site.Latitude || !site.Longitude) return;

          const lat = parseFloat(site.Latitude);
          const lng = parseFloat(site.Longitude);

          if (isNaN(lat) || isNaN(lng)) return;

          siteBounds.extend([lat, lng]);

          L.circleMarker([lat, lng], {
            color: 'black',
            weight: 0.5,
            opacity: 1,
            fillColor: getColor(site.Perzone),
            fillOpacity: 0.8,
            radius: 5
          }).addTo(map)
            .bindTooltip(`
              <b>${site.Id}</b><br>
              ${site.Latitude}, ${site.Longitude}<br>
              ${site.Perzone}
            `, {
              permanent: false,
              direction: 'auto',
              className: 'custom-tooltip'
            });
        });

        if (siteBounds.isValid()) {
          map.fitBounds(siteBounds, {padding: [24, 24]});
        }

        console.log(`Successfully loaded ${sites.length} sampling sites`);
      },
      error: function(error) {
        console.error('PapaParse error:', error);
      }
    });
  })
  .catch(error => {
    console.error('Failed to read CSV:', error);
    alert('Unable to load sampling site data. Please check the file path.');
  });

// Legend
const legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {
  const div = L.DomUtil.create('div', 'info legend');

  div.innerHTML += '<div class="legend-title">Permafrost Zone</div>';

  const zones = [
    {label: 'Isolated',     color: '#e31a1c'},
    {label: 'Sporadic',     color: '#EE7621'},
    {label: 'Discontinuous',color: '#007500'},
    {label: 'Continuous',   color: '#0840A1'}
  ];

  zones.forEach(zone => {
    div.innerHTML +=
      '<div class="legend-row">' +
        '<i style="background:' + zone.color + '"></i>' +
        '<span>' + zone.label + '</span>' +
      '</div>';
  });

  return div;
};

legend.addTo(map);
