(function() {

  var types = {
    geolandbasemap: { format: 'png' },
    bmapgrau: { format: 'png' },
    bmaphidpi: { format: 'jpg' },
    bmapgelaende: { format: 'jpg', style: 'grau' },
    bmaporthofoto30cm: { format: 'jpg' },
    bmapoverlay: { format: 'png' }
  };

  /*
   * BasemapType for Google Maps API V3
   * <https://developers.google.com/maps/documentation/javascript/>
   */
  if (typeof google === "object" && typeof google.maps === "object") {

    // Extending Google class based on a post by Bogart Salzberg of Portland Webworks,
    // http://www.portlandwebworks.com/blog/extending-googlemapsmap-object
    google.maps.ImageMapType = (function(_constructor) {
      var f = function() {
        if (!arguments.length) {
          return;
        }
        _constructor.apply(this, arguments);
      }
      f.prototype = _constructor.prototype;
      return f;
    })(google.maps.ImageMapType);


    google.maps.BasemapMapType = function(name) {
      if (!(name in types)) throw new Error('Map type not found');
      let { format, style = 'normal' } = types[name];

      return google.maps.ImageMapType.call(this, {
        "getTileUrl": function(coord, zoom) {

          var numTiles = 1 << zoom,
            wx = coord.x % numTiles,
            x = (wx < 0) ? wx + numTiles : wx,
            y = coord.y,
            project = function(latLng) {
              var siny = Math.sin(latLng.lat * Math.PI / 180);
              return {
                x: Math.floor((0.5 + latLng.lng / 360) * numTiles),
                y: Math.floor((0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)) * numTiles)
              };
            },
            // EPSG:31297 Austria Lambert
            allowedBounds = [{
              lat: 46.41,
              lng: 9.53
            }, {
              lat: 49.02,
              lng: 17.17
            }],
            sw = project(allowedBounds[0]),
            ne = project(allowedBounds[1]);

          if (x > ne.x || y < ne.y || x < sw.x || y > sw.y) return null;

          return "//mapsneu.wien.gv.at/basemap/{N}/{S}/google3857/{Z}/{Y}/{X}.{F}"
            .replace("{N}", name)
            .replace("{S}", style)
            .replace("{Z}", zoom)
            .replace("{X}", x)
            .replace("{Y}", y)
            .replace("{F}", format);
        },
        "tileSize": new google.maps.Size(256, 256),
        "name": name,
        "alt": 'Tiles &copy; basemap.at',
        "minZoom": 3,
        "maxZoom": 19
      });
    };

    google.maps.BasemapMapType.prototype = new google.maps.ImageMapType;

    Basemap = function(map) {

      var baseType = new google.maps.BasemapMapType(window.devicePixelRatio == 1 ? 'geolandbasemap' : 'bmaphidpi'),
        terrainType = new google.maps.BasemapMapType('bmapgelaende'),
        satelliteType = new google.maps.BasemapMapType('bmaporthofoto30cm'),
        overlayType = new google.maps.BasemapMapType('bmapoverlay'),
        allowedBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(46.41, 9.53),
          new google.maps.LatLng(49.02, 17.17)
        ),
        typeChangeListener = map.addListener('maptypeid_changed', function() {
          // Terrain tiles
          if (map.getMapTypeId() == 'terrain') {
            map.overlayMapTypes.clear()
            map.overlayMapTypes.insertAt(0, terrainType);
          }
          // Sattelite tiles displayed for both 'hybrid' and 'satellite'
          if (map.getMapTypeId() == 'hybrid' || map.getMapTypeId() == 'satellite') {
            map.overlayMapTypes.clear()
            map.overlayMapTypes.insertAt(0, satelliteType);
          }
          // For 'hybrid' and 'terrain' also caption layer is added
          if (map.getMapTypeId() == 'hybrid' || map.getMapTypeId() == 'terrain') {
            map.overlayMapTypes.insertAt(1, overlayType);
          }
          // Default type is usually 'roadmap'
          if (map.getMapTypeId() == 'roadmap') {
            map.overlayMapTypes.clear()
            map.overlayMapTypes.push(baseType);
          }
        }),
        attribution = document.createElement('div');

      attribution.innerHTML = 'Datenquelle: <a href="http://www.basemap.at/" target="_blank">basemap.at</a>';
      attribution.style.cssText = 'white-space: nowrap;background-color: #fff;opacity: .7;padding: 1px 5px 2px;font-size: 10px';

	    map.controls[google.maps.ControlPosition.BOTTOM_RIGHT].push(attribution);

      map.overlayMapTypes.clear();
      map.overlayMapTypes.push(baseType);

      map.setOptions({
        restriction: {
          latLngBounds: allowedBounds,
          strictBounds: false,
        },
      });
    }
  }

})();
