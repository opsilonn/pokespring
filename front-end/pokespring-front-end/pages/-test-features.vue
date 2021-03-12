<template>
  <div ref="map" style="width: 100%; height: 400px" />
</template>

<script>
/* eslint-disable no-console */
import 'ol/ol.css'
import Feature from 'ol/Feature'
import Map from 'ol/Map'
import Point from 'ol/geom/Point'
import TileJSON from 'ol/source/TileJSON'
import VectorSource from 'ol/source/Vector'
import View from 'ol/View'
import { Icon, Style } from 'ol/style'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { fromLonLat } from 'ol/proj'

export default {
  data: () => ({
    map: null
  }),

  mounted () {
    console.log(fromLonLat([-0.12755, 51.507222]))
    const rome = new Feature({
      geometry: new Point([700, 430])
    })
    const london = new Feature({
      geometry: new Point(fromLonLat([-0.12755, 51.507222]))
    })
    const madrid = new Feature({
      geometry: new Point(fromLonLat([-3.683333, 40.4]))
    })
    const paris = new Feature({
      geometry: new Point(fromLonLat([2.353, 48.8566]))
    })
    const berlin = new Feature({
      geometry: new Point(fromLonLat([13.3884, 52.5169]))
    })

    const vectorLayer = new VectorLayer({
      source: new VectorSource({
        features: [rome, london]
      }),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          anchorXUnits: 'fraction',
          anchorYUnits: 'fraction',
          scale: 0.2,
          src: 'https://vectorified.com/images/map-icon-31.png'
        })
      })
    })

    let rasterLayer = new TileLayer({
      source: new TileJSON({
        url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
        crossOrigin: ''
      })
    })

    this.map = new Map({
      layers: [rasterLayer, vectorLayer],
      target: this.$refs.map,
      view: new View({
        center: fromLonLat([2.896372, 44.6024]),
        zoom: 3
      })
    })

    setTimeout(() => {
      vectorLayer.getSource().addFeature(madrid)
      vectorLayer.getSource().addFeature(paris)
      vectorLayer.getSource().addFeature(berlin)

      rasterLayer = new TileLayer({
        source: new TileJSON({
          url: 'https://a.tiles.mapbox.com/v3/aj.1x1-degrees.json?secure=1',
          crossOrigin: ''
        })
      })
    }, 2000)
  }
}

</script>
