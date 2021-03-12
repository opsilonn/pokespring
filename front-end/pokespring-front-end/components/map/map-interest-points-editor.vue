<template>
  <div>
    {{ uploadError }}
    <v-list dense>
      <v-list-item>
        <v-list-item-content>
          <v-btn text @click="$emit('insert')">
            Add new
          </v-btn>
        </v-list-item-content>
      </v-list-item>
      <div v-if="!!value">
        <v-divider horizontal />
        <v-list-item v-if="value._modified()">
          <v-list-item-content>
            <v-btn text color="green" @click="updateSelected">
              Save
            </v-btn>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              <v-text-field v-model="value.name" type="text" />
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-text-field v-model="value.coordinates[0]" label="longitude" type="number" />
              <v-slider
                v-model="value.coordinates[0]"
                min="0"
                :max="size[0]"
              />
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              <v-text-field v-model="value.coordinates[1]" label="latitude" type="number" />
              <v-slider
                v-model="value.coordinates[1]"
                min="0"
                :max="size[1]"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider horizontal />
        <v-list-item>
          <v-list-item-content>
            <v-btn text color="red" @click="$emit('remove', value.id)">
              Delete
            </v-btn>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </div>
</template>

<script>
// Imports
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'MapEditor',

  components: {
  },

  props: {
    value: {
      type: Object || null,
      required: false,
      default: null
    },
    src: {
      type: String,
      default: ''
    }
  },

  data: () => ({
    urlOrigin: window.location.origin,
    uploadError: null,
    size: [10000, 10000]
  }),

  computed: {
    ...mapState('universe', ['universes']),
    ...mapState('map', ['maps']),
    ...mapState('interestPoint', ['interesPoints']),

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
    }
  },

  watch: {
    value (value) {
      this.$emit('input', value)
    },
    src (value) {
      const img = new Image()
      img.onload = (e) => {
        const { width, height } = e.originalTarget
        this.size = [width, height]
      }

      img.src = value
    }
  },

  mounted () {
    const img = new Image()
    img.onload = (e) => {
      const { width, height } = e.originalTarget
      this.size = [width, height]
    }

    img.src = this.src
  },

  methods: {
    async updateSelected () {
      await this.$store.dispatch('interestPoint/updateInterestPoint', {
        interestPoint: {
          id: this.value.id,
          name: this.value.name,
          coordinates: `(${this.value.coordinates[0]}, ${this.value.coordinates[1]})`
        }
      })
    }
  }
}
</script>
