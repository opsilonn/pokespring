<template>
  <v-container>
    <v-card
      class="pa-4 ma-4"
      shaped
    >
      <v-container>
        <!-- 1 : Account's data -->
        <v-row align="center">
          <!-- Column image -->
          <v-col
            align="center"
            cols="12"
            sm="4"
            md="3"
          >
            <!-- Image -->
            <v-img
              src="/default_account.jfif"
              lazy-src="/logo.png`"
              aspect-ratio="1"
              max-height="200"
              max-width="200"
            >
              <!-- Image's placeholder -->
              <template v-slot:placeholder>
                <v-row
                  class="fill-height ma-0"
                  align="center"
                  justify="center"
                >
                  <v-progress-circular
                    indeterminate
                    color="grey lighten-5"
                  ></v-progress-circular>
                </v-row>
              </template>
            </v-img>
          </v-col>

          <!-- Column text -->
          <v-col
            cols="12"
            sm="8"
            md="9"
          >
            <h1 class="text-center text-sm-left">{{ account.username }}</h1>
            <h3 class="text-center text-sm-left text--secondary">Number of teams : {{ account.teams.length }}</h3>
          </v-col>
        </v-row>

        <!-- Divider -->
        <v-divider class="ma-6" />
      
        <!-- 1 : Teams' data -->
        <v-container>
          <!-- We iterate through the teams -->
          <v-card
            v-for="team in account.teams"
            :key="team.id"
            class="ma-4"
            :to="'/team/' + team.id"
          >
            <!-- Name of the team -->
            <v-card-title>
              {{ team.name }}
            </v-card-title>

            <!-- We iterate through the team's pokemons -->
            <v-row>
              <v-col
                v-for="pokemonInstance in team.members"
                :key="pokemonInstance.id"
                align-self="center"
                md="4"
                lg="2"
              >
                <center>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <!-- Picture of the pokemon -->
                      <v-img
                        v-bind="attrs"
                        v-on="on"
                        class="zoom"
                        :src="pokemonInstance.pokemon.imagePath || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokemonInstance.pokemon.pokedexNumber + '.png'"
                        lazy-src="/logo.png`"
                        aspect-ratio="1"
                        max-height="100"
                        max-width="100"
                      >
                      </v-img>
                    </template>

                      <!-- Tooltip that displays the name of the pokemon -->
                    <span>
                      {{
                        (pokemonInstance.surname !== null && pokemonInstance.surname.length !== 0)
                        ? pokemonInstance.surname + ' (' + pokemonInstance.pokemon.name + ')'
                        : pokemonInstance.pokemon.name
                      }}
                    </span>
                  </v-tooltip>
                </center>
              </v-col>
            </v-row>
          </v-card>
        </v-container>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
// Imports
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PageAccountById',

  components: {
  },

  data: () => ({
  }),

  computed: {
    // Imports
    ...mapGetters('accounts', ['getAccountByUsername']),

    /** Id of the Account, if any */
    accountUsername () {
      return this.$route.params.accountUsername
    },

    /** account, if any */
    account () {
      return this.getAccountByUsername(this.accountUsername)
    },
  },

  async mounted () {
    // We fetch the account's data
    await this.fetchAccountByUsername({ username: this.accountUsername })
  },

  methods: {
    // Imports
    ...mapActions('accounts', ['fetchAccountByUsername'])
  },

  head () {
    return { title: 'Account' }
  }
}
</script>
