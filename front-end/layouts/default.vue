<template>
  <v-app>
    <!-- App bar (navbar) -->
    <LayoutAppBar />

    <!-- Container for Nuxt's page -->
    <v-main class="background">
      <div class="fill-height" fluid>
        <nuxt />
      </div>
    </v-main>

    <!-- Footer to display the year -->
    <v-footer app class="shrink d-none d-md-flex" color="rgba(255, 255, 255, 0.4)">
      <span>
        &copy; {{ new Date().getFullYear() }} - Pokespring, an attempt to learn Java Spring
      </span>
    </v-footer>
    <!-- END FOOTER -->
  </v-app>
</template>

<script>
// Imports
import LayoutAppBar from '@/components/layout-app-bar'
import MixinCss from '@/mixins/mixin-css'

export default {
  components: {
    LayoutAppBar,
  },

  mixins: [MixinCss]
}
</script>
