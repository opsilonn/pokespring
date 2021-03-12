<template>
  <v-row no-gutters>
    <v-col cols="12" sm="3">
      <v-card elevation="10" rounded="0">
        <div style="height: 80vh; overflow-x: clip; overflow-y: auto">
          <v-card-title>
            <div class="d-flex align-center mr-5">
              <v-btn icon to="../maps" small>
                <v-icon small>
                  mdi-arrow-left
                </v-icon>
              </v-btn>
            </div>
            {{ map ? map.name : 'Map' }}
          </v-card-title>
          <v-expansion-panels accordion>
            <v-expansion-panel v-if="bIsGM">
              <v-expansion-panel-header>Edit Map</v-expansion-panel-header>
              <v-expansion-panel-content>
                <MapEditor />
              </v-expansion-panel-content>
            </v-expansion-panel>
            <v-subheader>Inspector</v-subheader>
            <MapInspector :feature="hovered || selected" :cursor="cursor" />
            <v-expansion-panel v-if="bIsGM">
              <v-expansion-panel-header>Edit Interest Points</v-expansion-panel-header>
              <v-expansion-panel-content>
                <MapInterestPointsEditor
                  v-model="selected"
                  :src="mapImageSrc"
                  @insert="addNew"
                  @remove="deleteSelected($event)"
                />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </v-card>
    </v-col>
    <v-col cols="12" sm="9">
      <MapContainer
        :src="mapImageSrc"
        :interest-points="interestPoints"
        :id-selected="idSelected"
        @pointermove="cursor = $event"
        @hover="hovered = $event"
        @select="idSelected = $event"
      />
    </v-col>
  </v-row>
</template>
<script>
// Imports
import { mapState, mapGetters } from 'vuex'
import MapEditor from '../../../../components/map/map-editor.vue'
import MapInterestPointsEditor from '../../../../components/map/map-interest-points-editor.vue'
import MapContainer from '../../../../components/map/map-container.vue'
import MapInspector from '../../../../components/map/map-inspector.vue'

export default {
  name: 'MapConsult',

  components: {
    MapEditor,
    MapInterestPointsEditor,
    MapContainer,
    MapInspector
  },

  async asyncData ({ store, params }) {
    const idUniverse = params.idUniverse
    const idMap = params.idMap
    await Promise.all([
      store.dispatch('universe/fetchUniverse', idUniverse),
      store.dispatch('map/fetchMap', idMap),
      store.dispatch('interestPoint/fetchInterestPointByMap', { idMap })
    ])
  },

  data: () => ({
    urlOrigin: window.location.origin,
    hovered: null,
    idSelected: null,
    interestPoints: null,
    cursor: null
  }),

  computed: {
    ...mapState('auth', ['bIsConnected', 'connectedUser']),
    ...mapState('universe', ['universes']),
    ...mapState('map', ['maps']),

    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('map', ['getMapById']),
    ...mapGetters('interestPoint', ['getInterestPoint', 'getInterestPointsByMap']),

    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    idMap () {
      return parseInt(this.$route.params.idMap) || null
    },
    universe () {
      return this.idUniverse ? this.getUniverse(this.idUniverse) : null
    },
    map () {
      return this.idMap ? this.getMapById(this.idMap) : null
    },
    mapInterestPoints () {
      return this.idMap ? this.getInterestPointsByMap(this.idMap) : null
    },
    bIsGM () {
      if (!this.connectedUser) { return false }
      const universe = this.connectedUser.universesPlays.find(_ => _.id === this.idUniverse)
      if (!universe) { return false }
      return universe.bIsGM
    },
    mapImageSrc () {
      return this.map ? `${this.urlOrigin}/back/universes/${this.idUniverse}/maps/${this.idMap}/map.jpg#${this.map.uuid}` : 'null'
    },
    selected: {
      get () {
        return this.interestPoints ? this.interestPoints.find(_ => _.id === this.idSelected) : null
      },
      set (value) {
        this.idSelected = value ? value.id : -1
      }
    }
  },

  watch: {
  },

  mounted () {
    this.interestPoints = [...this.mapInterestPoints.map((_, index) => {
      const ip = {
        id: _.id,
        name: _.name,
        coordinates: _.coordinates.slice(1, -1).split(', ').map(_ => parseInt(_)),
        _modified: () => {
          const interestPoint = this.getInterestPoint(_.id)
          return ip.name !== interestPoint.name ||
            ip.coordinates[0] !== interestPoint.coordinates.slice(1, -1).split(', ').map(_ => parseInt(_))[0] ||
            ip.coordinates[1] !== interestPoint.coordinates.slice(1, -1).split(', ').map(_ => parseInt(_))[1]
        }
      }

      return ip
    })]
  },

  methods: {
    async addNew () {
      const { id } = await this.$store.dispatch('interestPoint/createInterestPoint', {
        interestPoint: {
          name: 'New interest point',
          coordinates: '(0, 0)',
          idMap: this.idMap
        }
      })

      const ip = {
        id: this.getInterestPoint(id).id,
        name: this.getInterestPoint(id).name,
        coordinates: this.getInterestPoint(id).coordinates.slice(1, -1).split(', ').map(_ => parseInt(_)),
        _modified: () => {
          return ip.name !== this.getInterestPoint(id).name ||
            ip.coordinates[0] !== this.getInterestPoint(id).coordinates.slice(1, -1).split(', ').map(_ => parseInt(_))[0] ||
            ip.coordinates[1] !== this.getInterestPoint(id).coordinates.slice(1, -1).split(', ').map(_ => parseInt(_))[1]
        }
      }
      this.interestPoints.push(ip)

      this.idSelected = id
    },
    async deleteSelected (id) {
      await this.$store.dispatch('interestPoint/deleteInterestPoint', {
        idInterestPoint: id
      })

      this.interestPoints = this.interestPoints.filter(_ => _.id !== id)
      this.idSelected = -1
    }
  },

  head () {
    return { title: '' }
  }
}
</script>
