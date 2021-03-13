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

      <v-tabs align-with-title>
        <v-tab>Tab 1</v-tab>
        <v-tab>Tab 2</v-tab>
        <v-tab>Tab 3</v-tab>
      </v-tabs>
    </v-app-bar>
  </div>
</template>

<script>
// Imports

export default {
  name: 'LayoutAppBar',

  data: () => ({
    bg: 'orange'
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
        this.bg = 'orange'
      } else {
        this.bg = 'transparent'
      }
    },
  },
}
</script>
