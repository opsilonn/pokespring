<template>
  <div class="custom-appbar" :class="bg">
    <v-row>
        <v-col align="left">
            <v-tabs color="inherit">
                <v-menu
                    v-for="(category, indexCategory) in categories" :key="indexCategory"
                    open-on-hover
                    offset-y
                    bottom
                    origin="center center"
                    transition="scale-transition"
                >
                    <template v-slot:activator="{ on, attrs }">
                    <!-- button to activate menu -->    
                        <v-tab
                            v-bind="attrs"
                            v-on="on"
                        >
                            {{ category.title }}
                        </v-tab>
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
                        <v-list-item-title class="shrink d-none d-lg-flex">
                        - {{ item.title }}
                        </v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
            </v-tabs>
        </v-col>

        <!-- App-bar logo -->
        <v-col align="center">
            <router-link to="/">
                <!-- Logo for small screens -->
                <v-img
                    class="zoom-sm shrink d-flex d-md-none"
                    src="/logo.png"
                    max-height="50"
                    max-width="50"
                    contain
                />

                <!-- Logo for big screens -->
                <v-img
                class="zoom-sm shrink d-none d-md-flex"
                src="/logo-text.png"
                max-height="80"
                max-width="180"
                contain
                />
            </router-link>
        </v-col>

        <v-col align="right">
            <v-btn
                class="ma-2 zoom-xs"
                color="primary"
                text
            >
                Log in
            </v-btn>
            <v-btn
                class="ma-2 zoom-xs"
                outlined
                color="primary"
            >
                Sign up
            </v-btn>
        </v-col>
    </v-row>
  </div>
</template>

<script>
// Imports

export default {
  name: 'LayoutAppBar',

  data: () => ({
    bg: 'transparent',
    categories: [
        {
            title: 'Pokemon',
            items: [
                {
                    icon: 'mdi-earth',
                    title: 'Discover',
                    to: '/user/my-universes'
                },
                {
                    icon: 'mdi-human-handsup',
                    title: 'Select random',
                    to: '/user/my-characters'
                }
            ]
        },
        {
            title: 'Account',
            items: [
                {
                    icon: 'mdi-earth',
                    title: 'Discover',
                    to: '/user/my-universes'
                },
                {
                    icon: 'mdi-human-handsup',
                    title: 'Select random',
                    to: '/user/my-characters'
                }
            ]
        }
    ]
  }),

  computed: {
    /** whenever the user's logged in / out */
    bIsConnected () {
      // Re-compute whether the user is an admin
      return false
    }
  },

  mounted() {
    window.onscroll = () => {
      this.changeColor();
    };
  },

  methods: {
    /** Change the color of the Navbar */
    changeColor() {
      if (
        document.body.scrollTop < 100 &&
        document.documentElement.scrollTop < 100
      ) {
          console.log('set to ORANGE')
        this.bg = 'orange'
      } else {
          console.log('set to TRANSPARENT')
        this.bg = 'transparent'
      }
    }
  }
}
</script>
