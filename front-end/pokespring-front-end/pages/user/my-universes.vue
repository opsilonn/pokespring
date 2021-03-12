<template>
  <v-container>
    <!-- while loading : display a loading bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the universes..." />

    <!-- after loading : display the universes -->
    <div v-else>
      <!-- 1 - universes the user owns -->
      <div>
        <!-- Title -->
        <h1 class="ma-4">
          Your universes
        </h1>

        <!-- Display the universes, if any -->
        <v-container v-if="connectedUser.universesOwns.length !== 0">
          <RowCardsUniverse :universes="connectedUser.universesOwns" />
        </v-container>

        <!-- Otherwise, display a link -->
        <h3 v-else class="text-center">
          It seems you have no universe...
          <span>
            <NuxtLink to="/most-known-universes?newUniverse=true">
              You can create a brand new one here !
            </NuxtLink>
          </span>
        </h3>
      </div>

      <!-- Divider -->
      <v-divider class="ma-8" />

      <!-- 1 - universes the user is invited in -->
      <div>
        <!-- Title -->
        <h1 class="ma-4">
          Universes where you play
        </h1>

        <!-- Display the universes, if any -->
        <RowCardsUniverse
          v-if="connectedUser.universesPlays.length !== 0"
          :universes="connectedUser.universesPlays"
        />

        <!-- Otherwise, display a link -->
        <h3 v-else class="text-center">
          It seems you haven't joined any universe...
          <span>
            <NuxtLink to="/most-known-universes">
              You can discover some universes here !
            </NuxtLink>
          </span>
        </h3>
      </div>
    </div>
  </v-container>
</template>

<script>
// Imports
import CustomProgressBar from '@/components/custom-progress-bar.vue'
import RowCardsUniverse from '@/components/row-cards-universe.vue'
import { mapState } from 'vuex'

export default {
  name: 'PageUserMyUniverses',

  components: {
    CustomProgressBar,
    RowCardsUniverse
  },

  props: {
  },

  async asyncData ({ store, params }) {
  },

  data: () => ({
    isLoading: true
  }),

  computed: {
    ...mapState('auth', ['connectedUser'])
  },

  watch: {
  },

  async mounted () {
    await this.$store.dispatch('auth/fetchLoggedUser')
    await Promise.all([
      ...this.connectedUser.universesOwns.map(async _ => await this.$store.dispatch('user/fetchUser', _.idUser)),
      ...this.connectedUser.universesPlays.map(async _ => await this.$store.dispatch('user/fetchUser', _.idUser))
    ])
    this.isLoading = false
  },

  methods: {
  },

  head () {
    return { title: 'My Universes' }
  }
}
</script>
