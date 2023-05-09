// Define the initial map center and zoom level
const mapCenter = { lat: 0, lng: 0 };
const mapZoom = 2;

// Create the map object and center it on the defined location
const map = new google.maps.Map(document.getElementById("map"), {
  center: mapCenter,
  zoom: mapZoom,
});

// Fetch earthquake data from the USGS Earthquake Catalog API
const apiUrl =
  "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-05-01&endtime=2021-05-09&minmagnitude=5";
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    // Loop through the earthquake data and create a marker for each event
    data.features.forEach((event) => {
      const marker = new google.maps.Marker({
        position: {
          lat: event.geometry.coordinates[1],
          lng: event.geometry.coordinates[0],
        },
        map: map,
        title: event.properties.title,
      });

      // Add the event to the earthquake history in local storage
      const history =
        JSON.parse(localStorage.getItem("earthquakeHistory")) || [];
      history.push(event);
      localStorage.setItem("earthquakeHistory", JSON.stringify(history));
    });
  })
  .catch((error) => console.error(error));

// Display the earthquake history in the history section
const historyDiv = document.getElementById("history");
const history = JSON.parse(localStorage.getItem("earthquakeHistory")) || [];
historyDiv.innerHTML = `<h2>Earthquake History</h2>`;
if (history.length > 0) {
  historyDiv.innerHTML += `<ul>`;
  history.forEach((event) => {
    historyDiv.innerHTML += `<li>${event.properties.title}</li>`;
  });
  historyDiv.innerHTML += `</ul>`;
} else {
  historyDiv.innerHTML += `<p>No earthquake history found.</p>`;
}
