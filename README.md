# basemap-google-maps
Use [basemap.at](http://basemap.at/) map tiles with Google Maps Javascript API v3

## Basic usage

Create new `Basemap` object with the reference to your `google.maps.Map` object as a single parameter 
([example](http://jsfiddle.net/gh/get/library/pure/rcknr/basemap-google-maps/tree/master/demo/)). This will overlay `geolandbasemap` or `bmaphidpi` layers (if retina display is detected) over standard `MapTypeId.ROADMAP`, `bmapgelaende` layer over `MapTypeId.TERRAIN` as well as `bmaporthofoto30cm` and `bmapoverlay` above `MapTypeId.SATELLITE` and `MapTypeId.HYBRID` (the latter adds captions over the satellite layer). You can switch between layers using standard Google Maps type controls. The map will be also locked within borders of Austria according to [EPSG:31297](http://spatialreference.org/ref/epsg/mgi-austria-lambert/) bounds.

## Custom layers, overlays, what have you

There are 5 tile layers available:

1. **geolandbasemap** - standard basemap.at layer (redish)
2. **bmapgrau** - a color variation of the standard layer (grayish)
3. **bmaphidpi** - retina version of the standard layer
4. **bmaporthofoto30cm** - satellite imagery
5. **bmapoverlay** - transparent layer with labels meant to be used as overlay above satellite imagery or topographic layer.
6. **bmapgelaende** - topographic layer.

To use as a map type:

```
map.mapTypes.set('Basemap', new google.maps.BasemapMapType('geolandbasemap'));
```
_("Basemap" will be used as a label for map type selector control)_

To add as overlay to any other map type:
```
map.overlayMapTypes.push(new google.maps.BasemapMapType('geolandbasemap'));
```

For further reference, please see [Google Maps API docs](https://developers.google.com/maps/documentation/javascript/maptypes).

## Usage policy

Basemap.at map tiles are licensed under [Creative Commons license](https://creativecommons.org/licenses/by/3.0/at/deed.de). Be sure to include the link to [basemap.at](https://basemap.at/) as their [usage policy](https://basemap.at/#lizenz) requires.
