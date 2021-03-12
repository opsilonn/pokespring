<template>
  <v-container>
    <!-- while loading : display a loading bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the universes..." />

    <!-- after loading : display the universes -->
    <div v-else>
      <!-- If the user is a member of at least 1 universe -->
      <div v-if="universesConcerned.length !== 0">
        <!-- Display the universes, if any -->
        <div v-for="(universe, i) in universesConcerned" :key="universe.idUniverse">
          <!-- Universe's name -->
          <h1 class="ma-4">
            {{ universe.name }}
          </h1>

          <!-- Universe's characters, if any -->
          <v-container v-if="universe.characters.length !== 0">
            <RowCardsCharacter :characters="universe.characters" />
          </v-container>

          <!-- If the user has no character in that universe -->
          <h3 v-else class="text-center">
            It seems you have no character in that universe...
            <span>
              <NuxtLink :to="'/universe/' + universe.id + '/character'">
                You can create a new one here !
              </NuxtLink>
            </span>
          </h3>

          <!-- Divider (if there are some universes to be displayed after) -->
          <v-divider v-if="i !== universesConcerned.length - 1" class="ma-8" />
        </div>
      </div>

      <!-- If the user is in no universe at all -->
      <h3 v-else class="ma-4 text-center">
        It seems you are not linked to any universe...
        <span>
          <NuxtLink to="/most-known-universes">
            You can browse some here, and even create a new one !
          </NuxtLink>
        </span>
      </h3>
    </div>
  </v-container>
</template>

<script>
// Imports
import CustomProgressBar from '@/components/custom-progress-bar.vue'
import RowCardsCharacter from '@/components/row-cards-character'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'PageUserMyCharacters',

  components: {
    CustomProgressBar,
    RowCardsCharacter
  },

  async asyncData ({ store, params }) {
  },

  data: () => ({
    universesConcerned: [],
    isLoading: true
  }),

  computed: {
    ...mapState('auth', ['connectedUser']),
    ...mapGetters('character', ['getCharacters']),
    ...mapGetters('universe', ['getUniverse']),

    characters () {
      return this.getCharacters()
    }
  },

  async mounted () {
    await this.$store.dispatch('auth/fetchLoggedUser')
    await this.fetchCharactersForUser(this.connectedUser.id)
    await this.fetchAllUniverses()
    this.universesConcerned = this.characters.map((element) => { return this.getUniverse(element.idUniverse) })
    this.universesConcerned = [...new Set(this.universesConcerned)]
    this.universesConcerned.forEach((element) => {
      element.characters = []
    })
    this.characters.forEach((element) => {
      const index = this.universesConcerned.findIndex(univ => univ.id === element.idUniverse)
      this.universesConcerned[index].characters.push(element)
    })

    // We consider the loading done
    this.isLoading = false
  },

  methods: {
    ...mapActions('character', ['fetchCharactersForUser']),
    ...mapActions('universe', ['fetchAllUniverses'])
  },

  head () {
    return { title: 'My Characters' }
  }
}
</script>
