<template>
  <v-container>
    <v-row>
      <h1>Maps :</h1>
      <v-spacer />
      <v-dialog
        v-model="dialogAddMap"
        persistent
        max-width="500"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            fab
            dark
            small
            color="dark"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon primary>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Creating new map
          </v-card-title>
          <v-form v-model="newMapFormValidate">
            <v-card-text>
              {{ uploadError }}
              <v-text-field
                v-model="newMapName"
                label="Map name"
                type="text"
                :rules="[(_) => !!_ || 'Map name required !']"
                :disabled="!!newMapId"
              />
              <ImageUploader
                v-if="newMap"
                v-model="image"
                :label="`${newMap ? newMap.name : 'map'} image`"
                :upload-to="`${urlOrigin}/api/v1/maps/${newMap.id}`"
                upload-name="map-image"
                :max-height="200"
                @error="uploadError = $event"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                @click="dialogAddMap = false; newMapId = null"
              >
                Close
              </v-btn>
              <v-spacer />
              <v-btn
                color="green darken-1"
                text
                :disabled="!newMapFormValidate"
                :loading="newMapLoading"
                @click="!newMapId ? addNewMap() : openNewMap()"
              >
                {{ !newMapId ? 'Create' : 'Open' }}
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-row>
    <v-divider />
    <v-row>
      <v-col v-for="map of maps" :key="map.id" cols="12" md="4">
        <v-card
          :to="`/universe/${idUniverse}/map/${map.id}`"
        >
          <div class="d-flex flex-no-wrap">
            <v-avatar class="ma-3" size="125" tile>
              <v-img :src="`${urlOrigin}/back/universes/${idUniverse}/maps/${map.id}/map.jpg#${map.uuid}`" />
            </v-avatar>
            <v-card-title>
              {{ map.name }}
            </v-card-title>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Imports
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'WikiMaps',

  components: {
  },

  async asyncData ({ store, params }) {
    const idUniverse = params.idUniverse
    await Promise.all([
      store.dispatch('universe/fetchUniverse', idUniverse),
      store.dispatch('map/fetchMapsForUniverse', { idUniverse })
    ])
  },

  data: () => ({
    urlOrigin: window.location.origin,
    dialogAddMap: false,
    newMapFormValidate: false,
    newMapName: '',
    newMapId: null,
    newMapLoading: false,
    image: null,
    uploadError: null
  }),

  computed: {
    ...mapState('universe', ['universes']),
    ...mapState('map', ['maps']),

    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('map', ['getMapById', 'getMapByUniverse']),

    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    universe () {
      return this.idUniverse ? this.getUniverse(this.idUniverse) : null
    },
    maps () {
      return this.idUniverse ? this.getMapByUniverse(this.idUniverse) : null
    },
    newMap () {
      return this.newMapId ? this.getMapById(this.newMapId) : null
    }
  },

  watch: {
    image () {
      this.$store.commit('map/updateUuid', { idMap: this.newMapId })
    }
  },

  mounted () {
    // If the URL has a parameter to open the new Maps's dialog
    if (this.$route.query.add !== undefined) {
      this.dialogAddMap = this.$route.query.add === 'true'
    }
  },

  methods: {
    async addNewMap () {
      this.uploadError = null
      this.newMapLoading = true
      try {
        this.newMapId = (await this.$store.dispatch('map/createMap', {
          map: {
            name: this.newMapName,
            idUniverse: this.idUniverse
          }
        })).id
      } catch (err) {
        this.uploadError = err.message
      } finally {
        this.newMapLoading = false
      }
    },
    openNewMap () {
      this.$router.push({ path: `/universe/${this.idUniverse}/map/${this.newMapId}` })
    }
  },

  head () {
    return { title: 'Wiki Maps' }
  }
}
</script>
