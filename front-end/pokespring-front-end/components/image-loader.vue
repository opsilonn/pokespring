<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-file-input
          v-model="selectedFile"
          accept="image/*"
          :label="label"
          :rules="rules"
          :disabled="disabled"
          @change="onChange"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <v-img
          :src="image || defaultImage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Imports
import VInput from 'vuetify/lib/components/VInput/VInput.js'

export default {
  name: 'ImageLoader',
  components: {
  },
  extends: VInput,

  props: {
    accept: {
      type: String,
      requiered: true,
      default: 'image/*'
    },
    defaultImage: {
      type: String,
      requiered: true,
      default: ''
    }
  },

  data: () => ({
    selectedFile: null,
    image: null
  }),

  computed: {
  },

  mounted () {
  },

  methods: {
    onChange () {
      this.image = null
      if (!this.selectedFile) { return }
      const reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
      }
      reader.readAsDataURL(this.selectedFile)
      this.$emit('input', this.selectedFile)
    }
  }
}
</script>
