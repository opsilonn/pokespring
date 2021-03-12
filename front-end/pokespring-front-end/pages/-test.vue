<template>
  <v-container>
    <ComplexEditor
      :text="text"
      max-height="500"
      min-height="400"
      @update="changeText"
    />
  </v-container>
</template>

<script>
/* eslint-disable no-console */
import ComplexEditor from '@/components/complex-editor'
export default {

  components: {
    ComplexEditor
  },
  data () {
    return {
      editor: null,
      isActive: false,
      source: '',
      text: '<p>This is just a boring paragraph</p>'
    }
  },
  mounted () {
  },
  methods: {
    changeText (newText) {
      this.text = newText
      console.log(this.text)
    }
  }
}
</script>
