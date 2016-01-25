# basemap-google-maps
Use Basemap.at map tiles with Google Maps Javascript API v3

## Basic usage

Create new Basemap object with the reference to your google.maps.Map object as a single parameter 
([example](http://jsfiddle.net/gh/get/library/pure/rcknr/basemap-google-maps/tree/master/demo/)).

## Custom layers, overlays, what have you

There are 5 tile layers available:

1. geolandbasemap - standard basemap.at layer (redish)
2. bmapgrau - a color variation of the standard layer (grayish)
3. bmaphidpi - retina version of the standard layer
4. bmaporthofoto30cm - satellite imagery
5. bmapoverlay - transparent layer with labels meant to be used as overlay above satellite imagery.

To use as a map type:

```
map.mapTypes.set('Basemap', new google.maps.BasemapMapType('geolandbasemap'));
```
_("Basemap" will be used as a label for map type selector control)_

To add as overlay to any other map type:
```
map.overlayMapTypes.insertAt(0, new google.maps.BasemapMapType('geolandbasemap'));
```

For further reference, please see [Google Maps API docs](https://developers.google.com/maps/documentation/javascript/maptypes).
