// Set API data sources
var EarthQuakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var Tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

d3.json(EarthQuakes, function(data) {
    createFeatures(data.features);
});
//Set functions on Each 
function createFeatures(earthquakeData) {
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
              "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
          },
          pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,
              {radius: getRadius(feature.properties.mag),
              fillColor: getColor(feature.properties.mag),
              fillOpacity: .5,
              color: "grey",
              stroke: true,
              weight: .8
          })
        }
        });

    createMap(earthquakes);
}
function createMap(earthquakes) {

    //Set variable layers
    var CityMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30s2f5b19ws1cpmmw6zfumm/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA");
      
    var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30r72r818te1cruud5wk075/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA");
  
    var StateMap = L.tileLayer("https://api.mapbox.com/styles/v1/mfatih72/ck30rkku519fu1drmiimycohl/tiles/256/{z}/{x}/{y}?" + 
    "access_token=pk.eyJ1IjoibWZhdGloNzIiLCJhIjoiY2sycnMyaDVzMGJxbzNtbng0anYybnF0MSJ9.aIN8AYdT8vHnsKloyC-DDA");
    
    //Label Overlay Maps
    var baseMaps = {
        "State Map": StateMap,
        "City Map": CityMap,
        "Satellite": satellite
    };
    //Tectonic Layer
    var tectonicPlates = new L.LayerGroup();
    //Earthquake and Tectonic Maps
    var overlayMaps = {
        "Earthquakes": earthquakes,
        "Tectonic Plates": tectonicPlates
    };
    //Compile map
    var myMap = L.map("map", {
        center: [40.7, -94.5],
        zoom: 5,
        layers: [StateMap, earthquakes, tectonicPlates]
    });

    d3.json(Tectonic, function(tectonicData) {
        L.geoJson(tectonicData, {
            color: "blue",
            weight: 2
        })
        .addTo(tectonicPlates);
    });

    //Layer Menu
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Legend
    var legend = L.control({
        position: "bottomleft"
    });
    legend.onAdd = function(myMap) {
        var div = L.DomUtil.create("div", "info legend"),
        grades = [0, 1, 2, 3, 4, 5],
        labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
    };
    legend.addTo(myMap);
}

//Set color variations
function getColor(magnitude) {
    if (magnitude > 5) {
        return 'green'
    } else if (magnitude > 4) {
        return 'lightgreen'
    } else if (magnitude > 3) {
        return 'blue'
    } else if (magnitude > 2) {
        return 'red'
    } else if (magnitude > 1) {
        return 'darkblue'
    } else {
        return 'darkgreen'
    }
};

//Set Radius
function getRadius(magnitude) {
    return magnitude * 20000;
};