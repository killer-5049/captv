let map;
let watchId;
const statusDisplay = document.getElementById("demo");

function initMap() {
  // Create the map centered on NIT Delhi
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 17,
    center: { lat: 28.813465, lng: 77.132867 }, // Center at NIT Delhi
  });

  // Define the outer boundary coordinates of NIT Delhi
  const outerCoords = [
    { lat: 28.817634, lng: 77.133294 },
    { lat: 28.816398, lng: 77.133695 },
    { lat: 28.816434, lng: 77.134202 },
    { lat: 28.816152, lng: 77.134304 },
    { lat: 28.815986, lng: 77.133836 },
    { lat: 28.811367, lng: 77.135163 },
    { lat: 28.810576, lng: 77.131132 },
    { lat: 28.812192, lng: 77.130516 },
    { lat: 28.815340, lng: 77.131402 },
  ];

  // Define the inner boundary coordinates
  const innerCoords = [
    { lat: 28.817474, lng: 77.133260 },
    { lat: 28.811468, lng: 77.134954 },
    { lat: 28.810742, lng: 77.131192 },
    { lat: 28.812300, lng: 77.130775 },
    { lat: 28.815271, lng: 77.131623 },
  ];

  // Create the polygon with outer and inner paths
  const nitDelhiBoundary = new google.maps.Polygon({
    paths: [outerCoords, innerCoords],
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.05,
  });

  nitDelhiBoundary.setMap(map);

  // Store coordinates globally for later boundary checking
  window.outerCoords = outerCoords;
  window.innerCoords = innerCoords;
}

function getLocation() {
  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(showPosition, showError, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
  } else {
    statusDisplay.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function stopTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    statusDisplay.innerHTML = "Tracking stopped.";
  }
}

function showPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;

  // Center the map at the user's current location
  const userLocation = new google.maps.LatLng(lat, lng);
  map.setCenter(userLocation);

  // Place a marker on the user's location
  new google.maps.Marker({
    position: userLocation,
    map: map,
    title: "You are here",
  });

  // Check user's location relative to the outer and inner boundaries
  const isInsideOuter = google.maps.geometry.poly.containsLocation(
    userLocation,
    new google.maps.Polygon({ paths: outerCoords })
  );

  const isInsideInner = google.maps.geometry.poly.containsLocation(
    userLocation,
    new google.maps.Polygon({ paths: innerCoords })
  );

  // Display the location status based on the boundaries
  if (isInsideInner) {
    statusDisplay.innerHTML = `Latitude: ${lat}<br>Longitude: ${lng}<br>Status: Present`;
    statusDisplay.style.color = "green";
  } else if (isInsideOuter) {
    statusDisplay.innerHTML = `Latitude: ${lat}<br>Longitude: ${lng}<br>Status: On Campus`;
    statusDisplay.style.color = "orange";
  } else {
    statusDisplay.innerHTML = `Latitude: ${lat}<br>Longitude: ${lng}<br>Status: Absent`;
    statusDisplay.style.color = "red";
  }
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      statusDisplay.innerHTML = "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      statusDisplay.innerHTML = "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      statusDisplay.innerHTML = "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      statusDisplay.innerHTML = "An unknown error occurred.";
      break;
  }
}

// Expose functions to the global scope for use in HTML
window.initMap = initMap;
window.getLocation = getLocation;
window.stopTracking = stopTracking;


// function initMap() {
//     // Create a simple map centered at NIT Delhi
//     const map = new google.maps.Map(document.getElementById("map"), {
//       zoom: 17,
//       center: { lat: 28.813465, lng: 77.132867 }, // Center at NIT Delhi
//     });
  
//     // Check if the map loaded successfully
//     console.log("Map initialized");
//   }