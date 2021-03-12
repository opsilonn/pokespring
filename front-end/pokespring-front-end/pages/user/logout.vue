<template>
  <v-container>
    Logout... please wait
    {{ authentificationStatus }}
  </v-container>
</template>

<script>
// Imports
import { mapState } from 'vuex'

export default {
  name: 'Logout',

  components: {
  },

  props: {
  },

  data: () => ({
  }),

  computed: {
    ...mapState('auth', ['authentificationStatus'])
  },

  watch: {
  },

  async mounted () {
    // Wait for the logout
    await this.$store.dispatch('auth/logout')
    // this.$router.push({ path: decodeURI(this.$route.query.redirect) || '/' })

    // Always redirect to the first page
    this.$router.push({ path: '/' })
  },

  methods: {
  },

  head () {
    return { title: '' }
  }
}
</script>
