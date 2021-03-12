<template>
  <div>
    {{ uploadError }}
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-row>
            <v-col cols="10">
              <v-text-field
                v-model="mapName"
                class="ma-0"
                type="text"
                counter="45"
                :placeholder="map ? map.name : 'Map name'"
                label="Map name"
              />
            </v-col>
            <v-col cols="2" class="d-flex align-center justify-center">
              <v-btn
                icon
                :disabled="map ? mapName === map.name : true"
                :loading="loadingName"
                @click="editName"
              >
                <v-icon>
                  mdi-content-save
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
      <ImageUploader
        v-model="image"
        :label="`${map ? map.name : 'map'} image`"
        :upload-to="`${urlOrigin}/api/v1/maps/${idMap}`"
        upload-name="map-image"
        :default-image="`${urlOrigin}/back/universes/${idUniverse}/maps/${idMap}/map.jpg`"
        :max-height="200"
        @error="uploadError = $event"
      />
      <v-divider horizontal />
      <v-list-item>
        <v-list-item-content>
          <v-btn text color="red" :loading="loadingRemove" @click="removeMap">
            Delete
          </v-btn>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
// Imports
import { mapState, mapGetters } from 'vuex'
import ImageUploader from '../image-uploader.vue'

export default {
  name: 'MapEditor',

  components: {
    ImageUploader
  },

  props: {
  },

  data: () => ({
    urlOrigin: window.location.origin,
    uploadError: null,
    image: null,
    mapName: null,
    loadingName: false,
    loadingRemove: false
  }),

  computed: {
    ...mapState('universe', ['universes']),
    ...mapState('map', ['maps']),
    ...mapState('interestPoint', ['interesPoints']),
    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('map', ['getMapById']),
    ...mapGetters('interestPoint', ['getInterestPointsByMap']),
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
    }
  },

  watch: {
    image () {
      if (!this.map) { return }

      this.$store.commit('map/updateUuid', { idMap: this.idMap })
    }
  },

  mounted () {
    this.mapName = this.map.name
  },

  methods: {
    async editName () {
      this.loadingName = true
      try {
        await this.$store.dispatch('map/updateMap', { map: { ...this.map, name: this.mapName } })
        this.mapName = this.map.name
      } catch (err) {
        this.uploadError = err
      } finally {
        this.loadingName = false
      }
    },
    async removeMap () {
      this.loadingRemove = true
      try {
        await this.$store.dispatch('map/removeMap', { idMap: this.idMap })
        this.$router.push({ path: `/universe/${this.idUniverse}/maps` })
      } catch (err) {
        this.uploadError = err
      } finally {
        this.loadingRemove = false
      }
    }
  }
}
</script>
