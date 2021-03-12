<template>
  <div>
    <!-- App bar (navbar) -->
    <v-app-bar
      app
      flat
      :color="bg"
    >
      <v-spacer />

      <!-- App-bar logo -->
      <router-link to="/">
        <!-- Logo for small screens -->
        <v-img
          class="zoom-sm shrink d-flex d-md-none"
          src="/logo.png"
          max-height="50"
          max-width="50"
          contain
        />

        <!-- Logo for big screens -->
        <v-img
          class="zoom-sm shrink d-none d-md-flex"
          src="/logo-text.png"
          max-height="80"
          max-width="180"
          contain
        />
      </router-link>

      <v-spacer />
    </v-app-bar>
  </div>
</template>

<script>
// Imports

export default {
  name: 'LayoutAppBar',

  data: () => ({
    bg: 'white'
  }),

  mounted() {
    window.onscroll = () => {
      this.changeColor();
    };
  },

  methods: {
    changeColor() {
      if (
        document.body.scrollTop < 100 &&
        document.documentElement.scrollTop < 100
      ) {
        this.bg = 'white'
      } else {
        this.bg = 'transparent'
      }
    },
  },
}
</script>
