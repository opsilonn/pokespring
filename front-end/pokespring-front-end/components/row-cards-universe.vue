<template>
  <v-row>
    <!-- Iterate through the universes -->
    <v-col
      v-for="universe in universes"
      :key="universe.id"
      class="d-flex child-flex"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <NuxtLink :to="'/universe/' + getTo(universe)" class="text-decoration-none">
        <!-- Card for the current universe -->
        <v-card
          class="zoom-xs"
          elevation="8"
        >
          <!-- Title of the universe -->
          <v-card-title>
            <v-container class="pa-0">
              <v-row class="ma-0 pa-0" align="center" justify="center">
                <!-- Logo (flexible according to the screen size) -->
                <v-col sm="4" md="4" align="right">
                  <v-img class="shrink d-flex d-md-none" src="/logo.png" max-height="50" max-width="50" contain />
                  <v-img class="shrink d-none d-md-flex" src="/logo.png" max-height="75" max-width="75" contain />
                </v-col>

                <!-- Title -->
                <v-col sm="8" md="8">
                  <h3 class="primary--text text-truncate">
                    {{ universe.name }}
                  </h3>
                </v-col>
              </v-row>
            </v-container>
          </v-card-title>

          <!-- Some stuff -->
          <v-card-subtitle>
            <!-- <i>{{ (getUser(universe.idUser) || {username: 'unknown' }).username }}</i> -->
            <v-row>
              <v-col cols="8" class="text-left">
                <i>{{ (getUser(universe.idUser) || {username: 'unknown' }).username }}</i>
              </v-col>
              <v-col cols="4" class="text-right">
                <v-icon v-if="!universe.bIsPublic">
                  mdi-lock
                </v-icon>
              </v-col>
            </v-row>
          </v-card-subtitle>

          <!-- Description of the universe -->
          <v-card-text>
            <v-container>
              <h3>{{ universe.description }}</h3>
            </v-container>
          </v-card-text>
        </v-card>
      </NuxtLink>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'RowCardsUniverse',

  props: {
    universes: {
      type: Array,
      required: true
    }
  },

  computed: {
    ...mapGetters('user', ['getUser'])
  },

  methods: {
    getTo (universe) {
      return universe.id !== undefined ? universe.id : universe.idUniverse
    }
  }
}
</script>
