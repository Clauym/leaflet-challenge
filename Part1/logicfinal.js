// Store our API endpoint as queryUrl. All earthquakes last 7 days

let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

// Perform a GET request to the query URL/
d3.json(queryUrl).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

// Define a function that we want to run once for each feature in the features array.
  function createFeatures(earthquakeData) {
  // Give each feature a popup that describes the place and time of the earthquake.
    function onEachFeature(feature, layer) {
      layer.bindPopup(`<h4>${feature.properties.place} | (lat:${feature.geometry.coordinates[1]}, lng: ${feature.geometry.coordinates[0]})</h4><hr>
            <ul><li>${new Date(feature.properties.time)}</li>,
            <li> Magnitude: ${feature.properties.mag}, Depth: ${(feature.geometry.coordinates[2]).toFixed(2)}</li></ul>`);  
    }


  // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.    THIS IS THE CODE THAT PUTS THE COOORDINATES
    let earthquakes = L.geoJSON(earthquakeData, {
 
        onEachFeature: onEachFeature,  
        pointToLayer: function (feature, latlng) {
        
        var meters = feature.geometry.coordinates[2];
        var shade ="";
        if (meters < 10) {
          shade = "green";
        }
        else if (meters < 30) {
          shade = "lightgreen";
        }
        else if (meters < 50) {
          shade = "khaki";
        }
        else if (meters < 70) {
          shade = "orange";
        }
        else if (meters < 90) {
          shade = "tomato";
        }
        else if (meters >= 90) {
          shade = "red";
        }
        
        var radius= Math.abs(feature.properties.mag)*20000;
        return L.circle(latlng, {
            stroke: true,
            fillOpacity: 0.5,
            color: "black",
            weight: 0.5,
            fillColor: shade,
            radius: radius
            });
        }  
    });
  
   // Send our earthquakes layer to the createMap function/
    createMap(earthquakes);
};


function createMap(earthquakes) {
// Create the base layers.
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'  
  })

  let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });


// Create a baseMaps object.
  let baseMaps = {
    "Street Map": street,
    "Topographic Map": topo
    //"Plates": plates
  };

// Create an overlay object to hold our overlay.
  let overlayMaps = {
    Earthquakes: earthquakes
  };

// Create our map, giving it the streetmap and earthquakes layers to display on load.
  let myMap = L.map("map", {
    center: [
      32.09, -97
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

// Create a layer control.
// Pass it our baseMaps and overlayMaps.
// Add the layer control to the map.
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


//Colors for the legend  
  function getColor(d){
    if (d < 10) {
        shade = "green";
    }
    else if (d < 30) {
        shade = "lightgreen";
    }
    else if (d < 50) {
        shade = "khaki";
    }
    else if (d < 70) {
        shade = "orange";
    }
    else if (d < 90) {
        shade = "tomato";
    }
    else if (d >= 90) {
        shade = "red";
    }
    return shade
  }

//Create a legend
  var legend = L.control({
    position: 'bottomright'
  });

//Insert div with class 'legend'
  legend.onAdd = function(){
    var div = L.DomUtil.create('div', 'legend',);
    grades = [-10, 10, 30, 50, 70, 90],
    categories = ['-10-10','10-30','30-50','50-70','70-90','+90'];
    
    let lineText=[];
    for (var i = 0; i < categories.length; i++) {
        lineText.push(
          '<i style = "background:' + getColor(grades[i]+1) + '"></i>' + ": "+
          categories[i] );
    }
        
    div.innerHTML = lineText.join('<br>'); 
    return div;
    };

legend.addTo(myMap);

}

  


