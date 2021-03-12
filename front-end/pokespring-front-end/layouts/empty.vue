<template>
  <v-app dark>
    <!-- Container for Nuxt's page -->
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>

    <!-- Footer to display the year -->
    <v-footer app>
      <span>
        &copy; {{ new Date().getFullYear() }} - made for Louis Cherel, with love
      </span>
    </v-footer>
    <!-- END FOOTER -->
  </v-app>
</template>

<style>
/* Zoom effect when overing */
.zoom {
  transition: transform .2s;
}
.zoom:hover {
  transform: scale(1.2);
}
.zoom-sm {
  transition: transform .2s;
}
.zoom-sm:hover {
  transform: scale(1.1);
}
.zoom-xs {
  transition: transform .2s;
}
.zoom-xs:hover {
  transform: scale(1.05);
}
</style>

<script>

export default {
  components: {
  },

  data () {
    return {
    }
  },

  methods: {
  }
}
</script>
