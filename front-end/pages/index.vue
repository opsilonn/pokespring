<template>
  <v-container>
    <center>
      <v-img
        class="anim-arrival"
        src="/pokeball.png"
        max-height="150"
        max-width="250"
        contain
      />
    </center>

    <v-card>
      <h2
        v-for="(n, index) in [ 'Normal', 'Fire', 'Water', 'Plant', 'Electrik', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dark', 'Dragon', 'Steel', 'Fairy' ]"
        :class="'type-' + (index+1)"
        class="pa-2"
      >
        {{ n }}
      </h2>
    </v-card>
  </v-container>
</template>

<script>
// Imports

export default {
  name: 'PageHome',
  transition: 'slide-bottom',

  components: {
  },

  data: () => ({
  }),

  computed: {
  },

  watch: {
  },

  mounted () {
  },

  methods: {
  },

  head () {
    return { title: 'homepage' }
  }
}
</script>
