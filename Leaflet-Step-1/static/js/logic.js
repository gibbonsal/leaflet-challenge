

// Create the map with our layers.
var map = L.map("map", {
  center: [33.724340,-112.464625],
  zoom: 4
});

// Create the tile layer.
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Create variable for the GeoJSON url.
var equrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson';


//Create a function to determine the circle size based on the magnitude of each earthquake.
function magcirclesize(magnitude) {
    if (magnitude <= 1){
        return magnitude * 1;
    }
    else if (magnitude <= 2){
        return magnitude * 2;
    }
    else if (magnitude <= 3){
        return magnitude * 3;
    }
    else if (magnitude <= 4){
        return magnitude * 4;
    }
    else if (magnitude <= 5){
        return magnitude * 5;
    }
    else {
        return magnitude * 6;
    }
}


// Create a function to determine the circle color based on the depth of each earthquake.
function depthcolor(eqdepthcolor) {
    if (eqdepthcolor >= 90){
        return "red";
    }
    else if (eqdepthcolor >= 70){
        return "orangered";
    }
    else if (eqdepthcolor >= 50){
        return "orange";
    }
    else if (eqdepthcolor >= 30){
        return "yellow";
    }
    else if (eqdepthcolor >= 100){
        return "lightgreen";
    }
    else {
        return "green";
    }
}


// Gather the GeoJSON data, create a circleMarker, and apply the GeoJSON data to the circleMarker.
d3.json(equrl).then(function(data) {
    // Creating GeoJSON layers with the retrieved data for the circle markets and a pop-up.
    L.geoJson(data, {
      pointToLayer: function(feature, location){
        return L.circleMarker(location,{
            radius: magcirclesize(feature.properties.mag),
            fillColor: depthcolor(feature.geometry.coordinates[2]),
            weight: 1, 
            opacity: .75,
            fillOpacity: .75,
        }); 
      },
      onEachFeature: function(feature, layer){
          layer.bindPopup('Location: ' + feature.properties.title + '; Magnitude: ' + (feature.properties.mag) + '; Depth: ' + feature.geometry.coordinates[2]);
      }
    }).addTo(map);



//Create a the variable for the legend.
var legend = L.control({position: 'bottomright'});

//Create an event of adding the legend on the map.
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depth = [-10, 10, 30, 50, 70, 90],
        color = ["green", "lightgreen", "yellow", "orange", "orangered", "red"];

    // Make a loop to apply the depth intervals and colors to the legend.
    for (var i = 0; i < depth.length; i++) {
        div.innerHTML +=
            '<i style="background:' + color [i] + '"></i> ' +
            depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
    return div;
  };
legend.addTo(map);
}








