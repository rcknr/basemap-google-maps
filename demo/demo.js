window.onload=function() {

var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 14,
  center: new google.maps.LatLng(48.2081743, 16.3738189),
});

new Basemap(map);

}