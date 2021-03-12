<template>
  <v-container>
    <!-- New Character -->
    <center class="pa-4">
      <!-- Dialog to create a new Character -->
      <v-dialog
        v-model="dialogNewCharacter"
        width="500"
      >
        <!-- Button : trigger of the dialog -->
        <template v-slot:activator="{ on, attrs }">
          <!-- New Character -->
          <center class="pa-4">
            <!-- Button if logged : correct redirect -->
            <NuxtLink v-if="bIsConnected" :to="`/universe/${idUniverse}/character`" class="text-decoration-none">
              <v-btn
                x-large
                outlined
                color="primary"
                class="ma-2 zoom-xs"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon
                  left
                  dark
                >
                  mdi-human-handsup
                </v-icon>
                New Character
              </v-btn>
            </NuxtLink>

            <!-- Button if not logged : dialog -->
            <v-btn
              v-else
              x-large
              outlined
              color="primary"
              class="ma-2 zoom-xs"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                left
                dark
              >
                mdi-human-handsup
              </v-icon>
              New Character
            </v-btn>
          </center>
        </template>

        <!-- Dialog if NOT logged in : warning -->
        <v-card v-if="!bIsConnected">
          <v-card-title>
            <span class="headline">Sign into your account !</span>
          </v-card-title>

          <v-container>
            Sorry, you are trying to access a feature that is only accessible to logged in users !
          </v-container>
          <v-container>
            Please log into your account or create a new one to access this feature.
          </v-container>

          <!-- Divider -->
          <v-divider />

          <!-- Actions -->
          <v-card-actions>
            <v-spacer />
            <!-- Button - dismiss -->
            <v-btn
              color="primary"
              text
              @click="dialogNewCharacter = false"
            >
              Dismiss
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </center>

    <!-- Divider -->
    <v-container>
      <v-divider class="ma-4" />
    </v-container>

    <!-- when loading : progress-bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the characters..." />

    <!-- when loaded : all Characters -->
    <div v-else>
      <!-- At least 1 character : display -->
      <RowCardsCharacter v-if="characters.length !== 0" :characters="characters" />

      <!-- No character : error message -->
      <h1 v-else>
        Sorry, it seems that this universe does not have any character yet...
      </h1>
    </div>
  </v-container>
</template>

<script>
// Imports
import CustomProgressBar from '@/components/custom-progress-bar'
import RowCardsCharacter from '@/components/row-cards-character'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'PageCharacters',

  components: {
    CustomProgressBar,
    RowCardsCharacter
  },

  data: () => ({
    dialogNewCharacter: false,
    characters: [],
    isLoading: true
  }),

  computed: {
    ...mapState('auth', ['bIsConnected']),
    ...mapGetters('character', ['getCharacters']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    }
  },

  async mounted () {
    // We fetch all the Characters from this universe
    await this.fetchCharactersForUniverse(this.idUniverse)

    // We get these characters
    this.characters = await this.getCharacters()

    // We consider the loading done
    this.isLoading = false
  },

  methods: {
    ...mapActions('character', ['fetchCharactersForUniverse'])
  },

  head () {
    return { title: 'Characters' }
  }
}
</script>
