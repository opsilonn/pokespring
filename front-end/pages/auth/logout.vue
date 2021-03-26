<template>
  <v-container fluid>
    <!-- Waiting for the logout to end -->
    <CustomProgressBar
      message="Login out..."
    />
  </v-container>
</template>

<script>
// Imports
import { mapActions } from 'vuex'

export default {
  name: 'PageAuthLogout',
  transition: 'fade',

  async mounted () {
    // Logout
    await this.logout()

    // Refresh for the middlewares, which will know where to go
    await location.reload()
  },

  methods: {
    // Imports
    ...mapActions('authentification', ['logout'])
  },

  head () {
    return { title: 'Logout' }
  }
}
</script>
