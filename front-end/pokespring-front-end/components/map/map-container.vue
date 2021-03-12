<template>
  <vl-map
    :load-tiles-while-animating="true"
    :load-tiles-while-interacting="true"
    style="width: 100%; height: 100%"
    @pointermove="onPointerMove"
    @click="onClick"
  >
    <vl-view
      :projection="projection.getCode()"
      :extent="extent"
      :zoom.sync="zoom"
      :center.sync="viewCenter"
      :resolution.sync="resolution"
      :rotation="0"
      :max-resolution="Math.min(...size)/700"
      :min-resolution=".2"
    />

    <vl-layer-image id="xkcd">
      <vl-source-image-static
        :url="src"
        :size="size"
        :extent="extent"
        :projection="projection.getCode()"
        :attributions="imgCopyright"
      />
    </vl-layer-image>

    <vl-layer-vector>
      <vl-source-vector>
        <vl-feature
          v-for="interestPoint of interestPoints"
          :id="interestPoint.id"
          :key="interestPoint.id"
          :properties="{
            id: interestPoint.id,
            name: interestPoint.name,
            coordinates: interestPoint.coordinates
          }"
        >
          <vl-geom-point :coordinates="interestPoint.coordinates" />
          <vl-overlay
            v-if="uuidSelected === interestPoint.id || uuidHovered === interestPoint.id"
            :id="`overlay-${interestPoint.id}`"
            :position="interestPoint.coordinates"
            positioning="top-center"
            :offset="[0, -110 / Math.pow(resolution, .21)]"
          >
            <template>
              <v-card elevation="24" light class="ma-0 pa-0">
                <v-card-title>
                  {{ interestPoint.name }}
                </v-card-title>
              </v-card>
            </template>
          </vl-overlay>
          <vl-style-box>
            <vl-style-icon
              :anchor="[0.5, 1]"
              src="/map-icon.png"
              :scale="Math.max((.15) / Math.pow(resolution, .65), 0.01)"
              :color="pickColor(interestPoint)"
            />
          </vl-style-box>
        </vl-feature>
      </vl-source-vector>
    </vl-layer-vector>
  </vl-map>
</template>

<script>
import { createProj, addProj } from 'vuelayers/lib/ol-ext'
import { getCenter } from 'ol/extent'

export default {
  name: 'MapContainer',

  components: {},

  props: {
    src: {
      type: String,
      default: ''
    },
    interestPoints: {
      type: Array,
      default: () => []
    },
    idSelected: {
      type: Number,
      default: -1
    }
  },

  data: () => ({
    zoom: 1,
    maxZoom: 8,
    resolution: undefined,
    viewCenter: [0, 0],
    size: null,
    imgCopyright: `© <a style="color: blue" href="${window.location.origin}">Otter Worlds</a>`,
    uuidHovered: '',
    uuidSelected: ''
  }),

  computed: {
    extent () {
      return [0, 0, ...(this.size || [0, 0])]
    },
    center () {
      return getCenter(this.extent)
    },
    projection () {
      const customProj = createProj({
        code: 'xkcd-image',
        units: 'pixels',
        extent: this.extent
      })
      // add to the list of known projections
      // after that it can be used by code
      addProj(customProj)

      return customProj
    }
  },

  watch: {
    src (value) {
      const img = new Image()
      img.onload = (e) => {
        const { width, height } = e.originalTarget
        this.size = [width, height]
        this.viewCenter = this.center
        this.zoom = 1
      }
      img.src = value
    },
    idSelected (value) {
      this.uuidSelected = value
    }
  },

  mounted () {
    this.viewCenter = this.center

    const img = new Image()
    img.onload = (e) => {
      const { width, height } = e.originalTarget
      this.size = [width, height]
      this.viewCenter = this.center
      this.zoom = 1
    }
    img.src = this.src
  },

  methods: {
    getHoverFeature ({ map, pixel }) {
      // will return the first feature under the pointer
      const hovered = map.forEachFeatureAtPixel(
        pixel,
        feature => feature
      )

      return hovered
    },
    featureToData (feature) {
      if (!feature) {
        return null
      }

      const valuesKeys = Object.keys(feature.values_).filter(_ => _ !== feature.geometryName_)
      const values = {}
      valuesKeys.forEach((_) => {
        values[_] = feature.values_[_]
      })
      const returnValue = {
        ...values,
        coordinates: feature.values_[feature.geometryName_].flatCoordinates
      }
      return returnValue
    },
    onPointerMove (event) {
      const hovered = this.getHoverFeature(event)
      this.uuidHovered = hovered ? hovered.values_.id : -1

      // emit a `select` event, either with a feature or without
      this.$emit('hover', this.featureToData(hovered))
      this.$emit('pointermove', event.coordinate)
    },
    onClick (event) {
      const hovered = this.getHoverFeature(event)
      this.uuidSelected = hovered ? hovered.values_.id : -1

      this.$emit('select', this.uuidSelected)
    },
    pickColor (interestPoint) {
      if (interestPoint.id === this.uuidSelected) { return '#2497de' }
      if (interestPoint._modified()) { return 'orange' }
      return 'red'
    }
  }
}
</script>
