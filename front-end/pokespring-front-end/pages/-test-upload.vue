<template>
  <v-container>
    <!-- Card containing all data about the character -->
    <v-card v-if="uploadError">
      <v-card-title>
        {{ uploadError }}
      </v-card-title>
    </v-card>
    <v-card>
      <v-form
        ref="mapImageForm"
        v-model="mapImageForm.valid"
        @submit.prevent="submitImage"
      >
        <v-row>
          <v-col cols="12" md="6" class="d-flex">
            <ImageUploader
              label="Map image"
              :upload-to="`api/v1/universes/4`"
              upload-name="universe-image"
              :default-image="defaultImage"
              @error="(error) => uploadError = error"
            />
            <v-divider
              v-if="!$vuetify.breakpoint.xs && !$vuetify.breakpoint.sm"
              vertical
            />
          </v-col>
          <v-col cols="12" md="6">
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="mapImageForm.map"
                    type="number"
                    name="map"
                    label="map"
                    :rules="[rules.number('map'), rules.required]"
                  />
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
/* eslint-disable no-console */
// Imports
import ImageUploader from '../components/image-uploader.vue'

export default {
  name: 'TestUpload',
  layout: 'empty',

  components: {
    ImageUploader
  },

  data: () => ({
    rules: {
      required: value => !!value || 'Required.',
      number: name => (value) => {
        if (value === null) { return true }
        return !isNaN(parseInt(value)) || `${name} should be a number.`
      }
    },
    mapImageForm: {
      map: null,
      selectedFile: null
    },
    uploadError: null,
    defaultImage: null,
    image: null
  }),

  computed: {
  },

  mounted () {
  },

  methods: {
  }
}
</script>
