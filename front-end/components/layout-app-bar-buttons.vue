<template>
  <v-menu
    v-if="isLogged"
    open-on-hover
    offset-y
    bottom
    origin="center center"
    transition="scale-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <!-- button to activate menu -->
      <v-btn
        class="ma-2"
        outlined
        x-large
        v-bind="attrs"
        v-on="on"
      >
        <v-badge
          class="ma-2"
          bordered
          bottom
          color="red lighten-1"
          dot
          offset-x="10"
          offset-y="10"
        >
          <v-avatar size="40">
            <v-img
              src="/logo.png"
            />
          </v-avatar>
        </v-badge>
        
        <span>My account</span>
      </v-btn>
    </template>

    <!-- menu displaying a user's action -->
    <v-list>
      <center>
      <span class="d-inline-block text-truncate font-italic" style="max-width: 150px;">{{ username }}</span>
      </center>
      <v-list-item
        v-for="(item, index) in itemsUser"
        :key="index"
        :to="item.to"
      >
        <v-icon
          class="ma-2"
        >
          {{ item.icon }}
        </v-icon>
        <v-list-item-title>
          - {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <!-- otherwise : login / signin tab -->
  <div v-else>
    <!-- Button Login -->
    <v-btn
      class="ma-2 zoom-xs"
      color="primary"
      to="/auth/login"
      large
      text
    >
      Log in
    </v-btn>

    <!-- Button Signup -->
    <v-btn
      class="ma-2 zoom-xs"
      color="primary"
      to="/auth/signup"
      large
      outlined
    >
      Sign up
    </v-btn>
  </div>
</template>


<script>
// Imports
import { mapGetters } from 'vuex'

export default {
  name: 'LayoutAppBarButtons',

  data: () => ({
    // List of items to display beneath the user's trigger
    itemsUser: [
      {
        icon: 'mdi-human-handsup',
        title: 'osef',
        to: '/osef'
      },
      {
        icon: 'mdi-logout-variant',
        title: 'Logout',
        to: '/auth/logout'
      }
    ]
  }),

  computed: {
    // Imports
    ...mapGetters('authentification', ['isLogged', 'username'])
  }
}
</script>
