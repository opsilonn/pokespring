<template>
  <v-app dark>
    <!-- App bar (navbar) -->
    <LayoutAppBar :is-universe-selected="isUniverseSelected" />

    <!-- Container for Nuxt's page -->
    <v-main class="background">
      <!-- Appbar (wiki) -->
      <LayoutAppBarWiki v-if="isInUniverseWiki" />
      <div class="fill-height" fluid>
        <nuxt />
      </div>
    </v-main>

    <!-- Footer to display the year -->
    <v-footer app class="shrink d-none d-md-flex">
      <span>
        &copy; {{ new Date().getFullYear() }} - made for Louis Cherel, with love (and kisses from Efrei Linux's ex-president !)
      </span>
    </v-footer>
    <!-- END FOOTER -->
  </v-app>
</template>

<script>
// Imports
import LayoutAppBar from '@/components/layout-app-bar'
import MixinCss from '@/mixins/mixin-css'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  components: {
    LayoutAppBar
  },

  mixins: [MixinCss],

  data: () => ({
    isUniverseAdmin: false
  }),

  computed: {
    ...mapState('auth', ['bIsConnected', 'connectedUser']),
    ...mapGetters('character', ['getCharacters']),
    ...mapGetters('user', ['getUser']),

    /** Return whether we are in a Universe */
    isUniverseSelected () {
      return this.$route.name.startsWith('universe-idUniverse')
    },

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    },

    /** Return whether we are in a Universe's Wiki */
    isInUniverseWiki () {
      return this.$route.name.startsWith('universe-idUniverse-wiki')
    },

    /** Return the id of the Wiki, if he has one */
    idWiki () {
      return parseInt(this.$route.params.idWiki) || undefined
    }
  },

  watch: {
    /** whenever the universe's id changes */
    async idUniverse () {
      await this.setIsUniverseAdmin()
    },

    /** whenever the user's logged in / out */
    async bIsConnected () {
      await this.setIsUniverseAdmin()
    }
  },

  mounted () {
    if (this.bIsConnected) {
      this.$store.dispatch('auth/fetchLoggedUser')
    }
  },

  methods: {
    ...mapActions('user', ['fetchUser', 'fetchPlayersOfUniverse']),

    /** Sets whether the user is the admin of the current universe */
    async setIsUniverseAdmin () {
      // We check that the user is logged AND in a universe
      // Otherwise : always false
      if (this.isUniverseSelected && this.bIsConnected) {
        // We get the user's reference from this universe
        await this.fetchPlayersOfUniverse(this.idUniverse)
        const user = this.getUser(this.connectedUser.id)

        // If found, we return whether he's a GM or not
        this.isUniverseAdmin = (user !== undefined) ? user.bIsGM : false
      } else {
        this.isUniverseAdmin = false
      }
    }
  }
}
</script>
