<template>
  <v-app dark>
    <!-- Blabla error -->
    <h1 class="text-center pa-4">
      Oopsie doopsie, an error occured...
    </h1>

    <!-- Blabla status code -->
    <h2 class="text-center">
      Status code : {{ error.statusCode }}
    </h2>

    <!-- Blabla content of the error -->
    <h2 class="text-center font-italic">
      - {{ getError.message }} -
    </h2>

    <!-- Link to the Homepage -->
    <NuxtLink to="/" class="pa-8">
      Return to Home page
    </NuxtLink>

    <!-- Image of goodEnough -->
    <center>
      <v-img
        class="pa-8"
        :src="getError.src || '/jdg_goodenough.jpg'"
        height="450px"
        contain
      />
    </center>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',

  props: {
    error: {
      type: Object,
      default: null
    }
  },

  computed: {
    /** Returns a complete answer depending on the error's status code */
    getError () {
      const errors = [
        { statusCode: 401, message: 'Unauthorized access', src: undefined },
        { statusCode: 404, message: 'Page not found', src: 'https://media.giphy.com/media/gngO1gmBhS9na/giphy.gif' },
        { statusCode: 500, message: 'Internal Server Error', src: undefined }
      ]

      return errors.find(e => e.statusCode === this.error.statusCode) || {
        statusCode: this.error.statusCode,
        message: 'Error',
        src: undefined
      }
    }
  },

  head () {
    return { title: this.getError.message }
  }
}
</script>
