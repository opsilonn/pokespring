<template>
  <div>
    <v-row>
      <v-col cols="9">
        <v-file-input
          v-model="selectedFile"
          accept="image/*"
          :label="label"
          :rules="rules"
          :disabled="disabled"
          @change="onChange"
        />
      </v-col>
      <v-col cols="3" class="d-flex align-center justify-center">
        <v-btn
          small
          :disabled="disabled || !!!image"
          @click="submitImage"
        >
          Upload
        </v-btn>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="12" class="d-flex justify-center">
        <v-img
          contain
          :src="image || lazyImage"
          :max-height="maxHeight"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
/* eslint-disable no-console */
// Imports
import axios from 'axios'
import VInput from 'vuetify/lib/components/VInput/VInput.js'

export default {
  name: 'ImageLoader',
  components: {
  },
  extends: VInput,

  props: {
    uploadTo: {
      type: String,
      requiered: true,
      default: ''
    },
    uploadName: {
      type: String,
      default: 'image'
    },
    accept: {
      type: String,
      requiered: true,
      default: 'image/*'
    },
    defaultImage: {
      type: String,
      requiered: true,
      default: ''
    },
    maxHeight: {
      type: Number,
      requiered: false,
      default: 0
    }
  },

  data: () => ({
    selectedFile: null,
    image: null,
    lazyImage: null
  }),

  computed: {
  },

  watch: {
    defaultImage (value) {
      this.lazyImage = value + `#${new Date().getTime()}`
    }
  },
  mounted () {
    this.lazyImage = this.defaultImage + `#${new Date().getTime()}`
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
    },

    async submitImage () {
      this.$emit('error', null)
      const fd = new FormData()
      fd.append(this.uploadName, this.selectedFile, this.selectedFile.name)
      try {
        const res = await axios.post(this.uploadTo,
          fd,
          { 'Content-Type': 'multipart/form-data' }
        )
        this.lazyImage = res.data + `#${new Date().getTime()}`
        this.image = null
        this.selectedFile = null

        this.$emit('input', this.lazyImage)
      } catch (err) {
        this.$emit('error', err)
      }
    }
  }
}
</script>
