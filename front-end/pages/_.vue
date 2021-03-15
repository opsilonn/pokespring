<template>
  <v-container>
    <!-- Blabla doesn't exist -->
    <h1 class="text-center pa-4">
      Sorry, <span class="font-italic">{{ $route.params.pathMatch }} </span> is not a valid page :'(
    </h1>

    <center class="pa-16">
      <!-- Gif -->
      <v-img
        src="/confused-psyduck.gif"
        height="200px"
        contain
      />

      <!-- Link to the Homepage -->
      <p class="pa-8">
      <NuxtLink to="/" class="pa-8">
        Return to Home page
      </NuxtLink>
      </p>
    </center>
  </v-container>
</template>

<script>
// Imports
export default {
  name: 'PageDefault',

  components: {
  },

  data: () => ({
  }),

  computed: {
  },

  mounted () {
  },

  methods: {
  },

  head () {
    return { title: this.$route.params.pathMatch }
  }
}
</script>
