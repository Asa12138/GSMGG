// Map Initialization
const map = L.map('map').setView([72, -40], 3);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
}).addTo(map);

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

        sites.forEach(site => {
          if (!site.Latitude || !site.Longitude) return;

          const lat = parseFloat(site.Latitude);
          const lng = parseFloat(site.Longitude);

          if (isNaN(lat) || isNaN(lng)) return;

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