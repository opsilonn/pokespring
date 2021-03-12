<template>
  <v-container>
    <ul>
      <li v-if="!!cursor">
        <b>cursor :</b> [{{ parseInt(cursor[0]) }}, {{ parseInt(cursor[1]) }}]
      </li>
      <!-- loop on the feature’s attributes -->
      <li v-for="(prop, index) in props" :key="index">
        <b>{{ prop }}:</b> {{ feature[prop] }}
      </li>
    </ul>
  </v-container>
</template>

<script>
// Imports

export default {
  name: 'MapInspector',

  components: {
  },

  props: {
    feature: {
      type: Object,
      default: null
    },
    cursor: {
      type: Array,
      default: null
    }
  },

  async asyncData ({ store, params }) {
  },

  data: () => ({
  }),

  computed: {
    // this will return an empty array if no feature available
    props () {
      return this.feature ? Object.keys(this.feature).filter(_ => _ !== 'geometry' && _ !== 'id' && !(this.feature[_] instanceof Function)) : []
    }
  },

  mounted () {
  },

  methods: {
  }
}
</script>
