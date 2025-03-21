mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
  container: "map", // container ID
  center: listing.geometry.coordinates, // starting position [lng, lat]
  zoom: 9, // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 }) // Fixed: Replaced `popupOffsets` with a valid offset
      .setHTML(
        `<h4> ${listing.title}</h4> <p>Exact location provided after booking!</p>`
      )
  )
  .addTo(map);
