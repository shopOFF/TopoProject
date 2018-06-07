const config = {
  apiKey: "AIzaSyAvCrNkkCthSVjLVlZriieX-hM5BcFrIRo",
  authDomain: "justtesting-b74c2.firebaseapp.com",
  databaseURL: "https://justtesting-b74c2.firebaseio.com",
  projectId: "justtesting-b74c2",
  storageBucket: "justtesting-b74c2.appspot.com",
  messagingSenderId: "1009793274374"
};

const db = initializeFirebase(config);

// Initialize Firebase
function initializeFirebase(configData) {
  firebase.initializeApp(configData);
  const db = firebase.firestore();
  const settings = {
    timestampsInSnapshots: true
  };
  db.settings(settings);

  return db;
}

let bteng = {
  "features": []
};

// $("#getDataBtn").on("click", function () {
db.collection("pointsInfo").get()
  .then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const docId = doc.id;
      const projName = doc.data().properties.projectName;
      const projSector = doc.data().properties.sector;
      const projServices = doc.data().properties.services;
      const projDescr = doc.data().properties.projectDescription;
      // cordinates
      const projLongtitude = doc.data().geometry.cordinates[0];
      const projLatitude = doc.data().geometry.cordinates[1];

      bteng.features.push({
        "type": "Feature",
        "properties": {
          "uid": `${doc.id}`,
          "project_name": `${projName}`,
          "sector": `${projSector}`,
          "services": `${projServices}`,
          "brief_description": `${projDescr}`
        },
        "geometry": {
          "type": "Point",
          "coordinates": [
            projLongtitude,
            projLatitude
          ]
        }
      },
      );

      console.log(`Doc Id: ${doc.id} => Project Name: ${projName} => Lon, Lat: ${projLongtitude}, ${projLatitude}`);
    });
  })
  .then(function (params) {
    var map = L.map('map').setView([44.15, 24.50], 6);
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
        '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(map);
    var baseballIcon = L.icon({
      iconUrl: 'baseball-marker.png',
      iconSize: [32, 37],
      iconAnchor: [16, 37],
      popupAnchor: [0, -28]
    });
    function onEachFeature(feature, layer) {
      var popupContent = "<h2>Project Name: " + feature.properties.project_name + "</h2>";
      if (feature.properties && feature.properties.sector && feature.properties.services) {
        popupContent += '<h3>Sector: ' + feature.properties.sector + '</h3>';
        popupContent += '<h3>Services: ' + feature.properties.services + '</h3>';
        popupContent += '<h4>Brief Project Description:</h4>';
        popupContent += '<p>' + feature.properties.brief_description + '</p>';
        popupContent += '<input type="submit" value="Edit Info" id="editInfoBtn" onClick="redirect(\''+ feature.properties.uid + '\')">';
      }
      layer.bindPopup(popupContent);
    }

    var btlyrs = L.layerGroup();
    var btstyle = { radius: 10, fillOpacity: 1, stroke: false, weight: 1, opacity: 1, fill: true, clickable: true };

    var btengCTW = new L.geoJSON(bteng, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        if (feature.properties.sector === 'Industrial contamination risk management') {
          return L.circleMarker(latlng, btstyle);
        }
      },
      style: function (feature) {
        switch (feature.properties.sector) {
          case 'Collection and transportation of waste': return { color: 'brown' };
        }
      }
    }).addTo(map);

    var btengDesign = new L.geoJSON(bteng, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        if (feature.properties.sector === 'GIS') {
          return L.circleMarker(latlng, btstyle);
        }
      },
      style: function (feature) {
        switch (feature.properties.sector) {
          case 'GIS': return { color: 'red' };
        }
      }
    }).addTo(map);

    var btengPM = new L.geoJSON(bteng, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        if (feature.properties.sector === 'Water management') {
          return L.circleMarker(latlng, btstyle);
        }
      },
      style: function (feature) {
        switch (feature.properties.sector) {
          case 'Water management': return { color: 'blue' };
        }
      }
    }).addTo(map);

    var btengCACS = new L.geoJSON(bteng, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        if (feature.properties.sector === 'Mining industry') {
          return L.circleMarker(latlng, btstyle);
        }
      },
      style: function (feature) {
        switch (feature.properties.sector) {
          case 'Mining industry': return { color: 'grey' };
        }
      }
    }).addTo(map);

    var btengMASW = new L.geoJSON(bteng, {
      onEachFeature: onEachFeature,
      pointToLayer: function (feature, latlng) {
        if (feature.properties.sector === 'Waste management') {
          return L.circleMarker(latlng, btstyle);
        }
      },
      style: function (feature) {
        switch (feature.properties.sector) {
          case 'Waste management': return { color: 'brown' };
        }
      }
    }).addTo(map);

    var controlLayers = L.control.layers().addTo(map);

    controlLayers.addOverlay(btengCTW, 'Industrial contamination risk management');
    controlLayers.addOverlay(btengDesign, 'GIS');
    controlLayers.addOverlay(btengPM, 'Water management');
    controlLayers.addOverlay(btengCACS, 'Mining Industry');
    controlLayers.addOverlay(btengMASW, 'Waste management');

    L.Control.Watermark = L.Control.extend({
      onAdd: function (map) {
        var img = L.DomUtil.create('img');
        img.src = 'bteng_en.png';
        img.style.width = '250px';
        return img;
      },
      onRemove: function (map) {
        // Nothing to do here
      }
    });
    L.control.watermark = function (opts) {
      return new L.Control.Watermark(opts);
    }
    L.control.watermark({ position: 'bottomleft' }).addTo(map);   

  })
  .catch(function (error) {
    console.log("Error getting document:", error)
    toastr.error(`${error}`, "Error getting document:")
  });


function redirect(uid) {
  location.href = `pointInfo.html?doc=${uid}`;
}

