<template>
  <v-container>
    <v-card class="pa-4 ma-4" shaped>
      <v-container>
        <!-- 1 : Teams's data -->
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
              src="/default_team.png"
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
                  />
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
            <h1 class="text-center text-sm-left">{{ team.name }}</h1>
            <h3 class="text-center text-sm-left text--secondary">
              Team of 
              <a :href="'/account/' + team.account.id">
                {{ team.account.username }}
              </a>
            </h3>
          </v-col>
        </v-row>

        <!-- Divider -->
        <v-divider class="ma-6" />
      
        <!-- 1 : Members' data -->
        <v-container>
          <!-- We iterate through the team's members -->
          <div
            v-for="(member, index) in team.members"
            :key="member.id"
            class="ma-4"
          >
            <!-- 1 : Teams's data -->
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
                  :src="member.pokemon.imagePath || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + member.pokemon.pokedexNumber + '.png'"
                  lazy-src="/logo.png`"
                  aspect-ratio="1"
                  max-height="150"
                  max-width="150"
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
                      />
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
                <!-- Name (and surname ?) of the pokemon -->
                <h2 class="text-center text-sm-left">
                  {{
                    (member.surname !== null && member.surname.length !== 0)
                    ? member.surname + ' (' + member.pokemon.nameEnglish + ')'
                    : member.pokemon.nameEnglish
                  }}
                </h2>

                <!-- Type(s ?) pokemon -->
                <h2 class="text-center text-sm-left">
                  <!-- Type 1 (mandatory) -->
                  <span :class="'type-' + member.pokemon.type1.id">
                    {{ member.pokemon.type1.name }}
                  </span>

                  <!-- Type 2 (if any) -->
                  <span v-if="member.pokemon.type2 !== null">
                    -
                    <span :class="'type-' + member.pokemon.type2.id">
                      {{ member.pokemon.type2.name }}
                    </span>
                  </span>
                </h2>

                <!-- Table -->
                <v-container>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <tbody>
                        <tr>
                          <td>HP</td>
                          <td>{{ member.pokemon.hp }}</td>
                        </tr>
                        <tr>
                          <td>Attack</td>
                          <td>{{ member.pokemon.attack }}</td>
                        </tr>
                        <tr>
                          <td>Defense</td>
                          <td>{{ member.pokemon.defense }}</td>
                        </tr>
                        <tr>
                          <td>Special Attack</td>
                          <td>{{ member.pokemon.specialAttack }}</td>
                        </tr>
                        <tr>
                          <td>Special Defense</td>
                          <td>{{ member.pokemon.specialDefense }}</td>
                        </tr>
                        <tr>
                          <td>Speed</td>
                          <td>{{ member.pokemon.speed }}</td>
                        </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-container>
              </v-col>
            </v-row>

            <!-- Divider -->
            <v-divider
              v-if="index !== team.members.length"
              class="ma-6 mx-12"
            />
          </div>
        </v-container>
      </v-container>
    </v-card>
  </v-container>
</template>

<script>
// Imports
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PageTeamById',

  components: {
  },

  data: () => ({
  }),

  computed: {
    // Imports
    ...mapGetters('teams', ['getTeamById']),

    /** Id of the Team, if any */
    idTeam () {
      return parseInt(this.$route.params.idTeam)
    },

    /** team, if any */
    team () {
      console.log(this.getTeamById(this.idTeam))
      return this.getTeamById(this.idTeam)
    },
  },

  async mounted () {
    // We fetch the team's data
    await this.fetchTeamById({ id: this.idTeam })
  },

  methods: {
    // Imports
    ...mapActions('teams', ['fetchTeamById'])
  },

  head () {
    return { title: 'Team n°' + this.idTeam }
  }
}
</script>
