<template>
  <!-- add align="center" justify="center" to center -->
  <v-row>
    <!-- Iterate through the characters -->
    <v-col
      v-for="character in characters"
      :key="character.id"
      class="pa-6"
      cols="12"
      sm="6"
      lg="4"
      xl="3"
    >
      <!-- Card for the current character -->
      <NuxtLink class="text-decoration-none" :to="'/universe/' + character.idUniverse + '/character/' + character.id">
        <v-card class="zoom-sm">
          <v-row class="ma-0 pa-0">
            <!-- Image on the left -->
            <v-col class="ma-0 pa-0" cols="4">
              <v-img min-height="200" max-height="200" lazy-src="/logo.png" :src="(character.src !== undefined) ? character.src : 'https://tse4.mm.bing.net/th?id=OIP.P36GNbnyP3PBzBiGfOOZnQHaE8&pid=Api'" />
            </v-col>

            <!-- Text on the right -->
            <v-col cols="8">
              <!-- Character's name -->
              <h2 class="font-weight-bold pl-4">
                {{ character.name }}
              </h2>

              <br>

              <!-- Character's creator -->
              <!--
              <h3>
                by
                <router-link class="text-decoration-none white--text" :to="'/user/' + character.user.username">
                  <v-tooltip top :open-delay="250">
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        class="font-italic"
                        v-bind="attrs"
                        v-on="on"
                      >{{ character.user.username }}</span>
                    </template>
                    <span>{{ character.user.username }}'s user page</span>
                  </v-tooltip>
                </router-link>
              </h3>
              -->

              <br>
              <h3>
                <!-- Character's race... -->
                <!--
                <router-link class="text-decoration-none white--text" :to="'/universe/wiki/' + character.work">
                  <v-tooltip bottom :open-delay="250">
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ character.race }}</span>
                    </template>
                    <span>{{ character.race }}'s wiki page</span>
                  </v-tooltip>
                </router-link>
              -->

                <!-- ...and work -->
                <!--
                <router-link class="text-decoration-none white--text" :to="'/universe/wiki/' + character.work">
                  <v-tooltip bottom :open-delay="250">
                    <template v-slot:activator="{ on, attrs }">
                      <span
                        v-bind="attrs"
                        v-on="on"
                      >{{ character.job.toLowerCase() }}</span>
                    </template>
                    <span>{{ character.job }}'s wiki page</span>
                  </v-tooltip>
                </router-link>
              -->
              </h3>
            </v-col>
          </v-row>
        </v-card>
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'RowCardsCharacter',

  props: {
    characters: {
      type: Array,
      required: true
    }
  }
}
</script>
