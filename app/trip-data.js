/* trip-data.js — loads trip data from trip.json */
(function () {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'app/trip.json', false);
  xhr.send(null);
  if (xhr.status === 200) {
    window.TRIP = JSON.parse(xhr.responseText);
  } else {
    console.error('Failed to load trip.json:', xhr.status);
  }
})();
