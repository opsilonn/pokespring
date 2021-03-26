<template>
  <div>
    <!-- App bar (navbar) -->
    <v-app-bar
      app
      flat
      color="rgba(0, 0, 0, 0.4)"
    >
      <!-- LEFT -->
      <!-- Small size : drawer icon -->
      <v-app-bar-nav-icon class="shrink d-flex d-md-none" @click="drawer = true" />
    
      <!-- Big size : list of menus -->
      <div class="shrink d-none d-md-flex">
        <v-spacer />

        <!-- List of menus -->
        <v-menu
          v-for="(category, indexCategory) in categories"
          :key="indexCategory"
          open-on-hover
          offset-y
          bottom
          origin="center center"
          transition="scale-transition"
        >
          <template v-slot:activator="{ on, attrs }">
            <!-- button to activate menu -->
            <v-btn
              class="ma-2 white-on-hover"
              text
              x-large
              v-bind="attrs"
              v-on="on"
              :to="category.items[0].to"
            >
              {{ category.title }}
            </v-btn>
          </template>

          <!-- menu displaying a user's action -->
          <v-list>
            <v-list-item
              v-for="(item, indexItem) in category.items"
              :key="indexItem"
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
      </div>

      <v-spacer />

      <!-- App-bar logo -->
      <router-link to="/">
        <!-- Logo for big screens -->
        <v-img
          class="zoom-sm"
          src="/logo-text.png"
          max-height="100"
          max-width="200"
          contain
        />
      </router-link>

      <v-spacer />

      <!-- Buttons (Login / Signup OR account links) -->
      <div class="shrink d-none d-md-flex">
        <LayoutAppBarButtons />
      </div>
    </v-app-bar>
    
    <!-- Navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <!-- Buttons (Login / Signup OR account links) -->
      <center>
        <LayoutAppBarButtons />
      </center>

      <!-- We iterate through the categories-->
      <v-list
        v-for="(category, indexCategory) in categories"
        :key="indexCategory"
        nav
        dense
      >
        <!-- Divider -->
        <v-divider class="ma-6" />

        <!-- Category's title -->
        <v-subheader>{{ category.title }}</v-subheader>

        <!-- Category's items -->
        <v-list-item
          v-for="(item, indexItem) in category.items"
          :key="indexItem"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon> {{ item.icon }} </v-icon>
          </v-list-item-icon>
          <v-list-item-title> {{ item.title }} </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// Imports
import { mapGetters } from 'vuex'
import LayoutAppBarButtons from '@/components/layout/layout-app-bar-buttons'
import Cookies from 'js-cookie'

export default {
  name: 'LayoutAppBar',

  components: {
    LayoutAppBarButtons,
  },

  data: () => ({
    // Trigger for the drawer
    drawer: false,
    group: null,

    // List of categories to display (left)
    categories: [
      {
        title: 'Pokemon',
        items: [
          {
            icon: 'mdi-earth',
            title: 'Discover',
            to: '/pokemon/azerty'
          },
          {
            icon: 'mdi-magnify',
            title: 'Search',
            to: '/search/pokemon'
          },
          {
            icon: 'mdi-human-handsup',
            title: 'Select random',
            to: '/pokemon/qwerty'
          }
        ]
      },
      {
        title: 'Account',
        items: [
          {
            icon: 'mdi-earth',
            title: 'Discover',
            to: '/account/azerty'
          },
          {
            icon: 'mdi-magnify',
            title: 'Search',
            to: '/search/account'
          },
          {
            icon: 'mdi-human-handsup',
            title: 'Select random',
            to: '/account/qwerty'
          }
        ]
      }
    ]
  }),

  computed: {
    // Imports
    ...mapGetters('authentification', ['isLogged', 'username'])
  }
}
</script>
