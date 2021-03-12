<template>
  <div>
    <LayoutGmDrawer
      v-if="isUniverseAdmin"
      v-model="gmDrawer"
      :characters="characters"
      :maps="maps"
      :timelines="timelines"
    />

    <!-- App bar (navbar) -->
    <v-app-bar
      hide-on-scroll
      app
    >
      <!-- GM's drawer activator -->
      <v-app-bar-nav-icon v-if="isUniverseAdmin" class="zoom-xs ml-2">
        <h2 class="primary--text" @click.stop="gmDrawer = true">
          GM
        </h2>
      </v-app-bar-nav-icon>

      <v-spacer />

      <!-- App-bar logo -->
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

      <v-spacer />

      <!-- Search bar -->
      <!-- Search bar (on small screen) -->
      <!-- <v-text-field
        class="shrink d-flex d-md-none"
        placeholder="..."
        hide-details
        single-line
        clearable
      >
        <v-icon slot="prepend">
          mdi-magnify
        </v-icon>
      </v-text-field> -->

      <!-- Search bar (on big screen) -->
      <!-- <v-text-field
        class="shrink d-none d-md-flex"
        :placeholder="populateSearchBar"
        hide-details
        single-line
        clearable
      >
        <v-icon slot="prepend">
          mdi-magnify
        </v-icon>
      </v-text-field> -->

      <v-spacer />

      <!-- if logged : profile tab -->
      <v-menu
        v-if="bIsConnected"
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
                  :src="avatarUri"
                  @load="replaceByDefault"
                />
              </v-avatar>
            </v-badge>
            <span class="shrink d-none d-lg-flex">{{ user.username }}</span>
          </v-btn>
        </template>

        <!-- menu displaying a user's action -->
        <v-list>
          <v-list-item
            v-for="(item, index) in itemsProfile"
            :key="index"
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

      <!-- otherwise : login / signin tab -->
      <v-btn
        v-else
        class="ma-2"
        outlined
        x-large
        @click="openDialog"
      >
        <v-icon class="shrink d-flex d-md-none">
          mdi-account-circle
        </v-icon>
        <v-icon class="shrink d-none d-md-flex mr-2">
          mdi-account-circle
        </v-icon>
        <span class="shrink d-none d-md-flex">Login / Sign in</span>
      </v-btn>

      <v-spacer />

      <!-- Tabs -->
      <template v-slot:extension>
        <v-tabs
          v-model="tab"
          grow
          icons-and-text
          center-active
          centered
          optional
        >
          <v-menu
            v-for="(item, i) in itemsTab"
            :key="i"
            offset-y
            open-on-hover
            origin="center center"
            transition="scale-transition"
          >
            <!-- TRIGGER -->
            <template v-slot:activator="{ on, attrs }">
              <v-tab
                :to="item.to"
                router
                exact
                v-bind="attrs"
                v-on="on"
              >
                <span class="shrink d-none d-sm-flex">{{ item.title }}</span>
                <v-icon>{{ item.icon }}</v-icon>
              </v-tab>
            </template>

            <!-- LIST (if any) -->
            <v-list v-if="(typeof item.content !== `undefined` && item.content.length !== 0)">
              <v-list-item
                v-for="(content, index) in item.content"
                :key="index"
                :to="content.to"
              >
                <!-- image (if exists !) -->
                <v-img
                  v-if="(typeof content.src !== 'undefined')"
                  class="ma-2"
                  :src="content.src"
                  max-height="25"
                  max-width="25"
                  contain
                />

                <!-- icon (if exists !) -->
                <v-icon
                  v-if="(typeof content.icon !== 'undefined')"
                  class="ma-2"
                >
                  {{ content.icon }}
                </v-icon>

                <!-- text -->
                <v-list-item-title>{{ content.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-tabs>
      </template>
    </v-app-bar>

    <!-- Login Form -->
    <DialogLogin v-model="isDialogActive" @closeDialog="closeDialog" />
  </div>
</template>

<script>
// Imports
import LayoutGmDrawer from '@/components/layout-gm-drawer'
import DialogLogin from '@/components/dialog-login'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'LayoutAppBar',

  components: {
    LayoutGmDrawer,
    DialogLogin
  },

  props: {
    isUniverseSelected: {
      type: Boolean,
      required: true
    }
  },

  data () {
    return {
      isUniverseAdmin: false,
      isDialogActive: false,
      tab: null,
      gmDrawer: false,
      universes: [],

      // for images display
      urlOrigin: window.location.origin,
      lazyImg: 'https://tse1.mm.bing.net/th?id=OIP.UYxX1vxsuqp7EKw6eFQr7QHaE8&pid=Api',
      onError: null
    }
  },

  computed: {
    // Imports
    ...mapState('auth', ['bIsConnected', 'connectedUser']),
    ...mapState('map', ['maps']),
    ...mapGetters('character', ['getCharacters']),
    ...mapGetters('map', ['getMapByUniverse']),
    ...mapGetters('timeline', ['getTimelines']),
    ...mapGetters('universe', ['getUniverses']),
    ...mapGetters('user', ['getUser']),

    /** Items to display when a user is NOT browsing an universe */
    itemsTabDefault () {
      return [
        {
          icon: 'mdi-login',
          title: 'Getting Started',
          to: '/getting-started'
        },
        {
          icon: 'mdi-earth',
          title: 'Create / Discover Universes',
          to: '/most-known-universes',
          content: this.universes.slice(0, 5).map(u => (
            {
              title: u.name,
              src: 'https://i.pinimg.com/originals/48/cb/53/48cb5349f515f6e59edc2a4de294f439.png',
              to: '/universe/' + u.id + '/characters'
            }))
        },
        {
          icon: 'mdi-account-group',
          title: 'About us...',
          to: '/about-us'
        }
      ]
    },

    /** Items to display when a user is browsing an universe */
    itemsTabInUniverse () {
      // We declare some items
      const items = [
        {
          icon: 'mdi-human-handsup',
          title: 'Characters',
          to: '/universe/' + this.idUniverse + '/characters',
          content: this.characters.slice(0, 5).map(c => (
            {
              title: c.name,
              src: 'http://pngimg.com/uploads/witcher/witcher_PNG56.png',
              to: '/universe/' + this.idUniverse + '/character/' + c.id
            }))
        },
        {
          icon: 'mdi-feather',
          title: 'Wiki',
          to: '/universe/' + this.idUniverse + '/wiki',
          content: []
        },
        {
          icon: 'mdi-map-legend',
          title: 'Maps',
          to: '/universe/' + this.idUniverse + '/maps',
          content: this.maps.slice(0, 5).map(m => (
            {
              title: m.name,
              icon: 'mdi-map-legend',
              to: '/universe/' + this.idUniverse + '/map/' + m.id
            }))
        },
        {
          icon: 'mdi-chart-timeline-variant',
          title: 'Timelines',
          to: '/universe/' + this.idUniverse + '/timelines',
          content: []
        }
      ]

      // We return the items
      return items
    },

    /** Returns the items to display in the App bar Tabs depending on the situation */
    itemsTab () {
      if (this.isUniverseSelected) {
        return this.itemsTabInUniverse
      } else {
        return this.itemsTabDefault
      }
    },

    itemsProfile () {
      return [
        {
          icon: 'mdi-earth',
          title: 'My universes',
          to: '/user/my-universes'
        },
        {
          icon: 'mdi-human-handsup',
          title: 'My characters',
          to: '/user/my-characters'
        },
        {
          icon: 'mdi-cog',
          title: 'Settings',
          to: '/user/settings'
        },
        {
          icon: 'mdi-logout-variant',
          title: 'Logout',
          to: '/user/logout?redirect=' + encodeURI(this.$route.path)
        }
      ]
    },

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return this.isUniverseSelected ? parseInt(this.$route.params.idUniverse) : undefined
    },

    /** Items to put in the search bar */
    searchBarItems () {
      return [
        'John Frusciante',
        'James Hetlfield',
        'Kirk Hammett',
        'Cliff Burton',
        'Tobias Forge',
        'Synister Gate',
        'Corey Taylor',
        'Jim Root',
        'Louka Diamond',
        'Dawn Pearl',
        'Luke Skywalker',
        'Darth Maul',
        'Darth Tyrannus',
        'Darth Sidious',
        'Darth Vader',
        'Darth Nihilus',
        'Kylo Ren',
        'General Grievous',
        'Karl Franz',
        'Krog-Gar',
        'Ulthuan',
        'Archaon',
        'Tobby-One-Eye'
      ]
    },

    /** Fills the Search bar with a string containing some of the items from a list */
    populateSearchBar () {
      // We create a copy of the searchBarItems (since we'll use slice)
      const items = this.searchBarItems

      // We initialize a random number (from 1 to 3)
      const rnd = Math.floor(Math.random() * 3) + 1

      // We initialize a string
      let placeholder = ''

      // We add all the questions to our List several times
      for (let i = 0; i < rnd; i++) {
        // We initialize a 2nd random number
        const rnd2 = Math.floor(Math.random() * items.length)

        // We update the placeholder
        placeholder += items[rnd2]

        // Add '...' or ', ' depending on whether we add something after or not
        if (i === rnd - 1) {
          placeholder += '...'
        } else {
          placeholder += ', '
        }

        // We remove the used string from the list
        items.splice(rnd2, 1)
      }

      // We return the placeholder
      return placeholder
    },

    /** User's data */
    user () {
      return this.getUser(this.connectedUser.id)
    },

    /** Characters of the current universe */
    characters () {
      return this.idUniverse ? this.getCharacters() : []
    },

    /** Maps of the current universe */
    maps () {
      return this.idUniverse ? this.getMapByUniverse(this.idUniverse) : []
    },

    /** Timelines of the current universe */
    timelines () {
      return this.idUniverse ? this.getTimelines() : []
    },

    // for images avatar display
    avatarUri () {
      if (this.onError !== null) {
        return this.onError
      }
      return this.connectedUser.id !== -1 ? `${this.urlOrigin}/back/users/${this.connectedUser.id}/user.jpg#${this.connectedUser.uuid}` : null
    }
  },

  watch: {
    // whenever the universe's id changes
    async idUniverse () {
      // We check that we are in a Universe (if not, it means that the id is undefined, so the following code MUST NOT RUN)
      if (this.isUniverseSelected) {
        // We fetch all the Characters from this universe
        await this.fetchCharactersForUniverse(this.idUniverse)

        // We fetch all the Maps from this universe
        await this.fetchMapsForUniverse({ idUniverse: this.idUniverse })

        // We fetch all the Timelines from this universe
        await this.fetchTimelinesForUniverse(this.idUniverse)
      }

      // Re-compute whether the user is an admin
      await this.setIsUniverseAdmin()
    },

    /** whenever the user's logged in / out */
    async bIsConnected () {
      // Re-compute whether the user is an admin
      await this.setIsUniverseAdmin()
    }
  },

  async mounted () {
    // When loading the appbar for the first time, we check what to fetch
    if (this.isUniverseSelected) {
      // We fetch all the Characters from this universe
      await this.fetchCharactersForUniverse(this.idUniverse)

      // We fetch all the Maps from this universe
      await this.fetchMapsForUniverse({ idUniverse: this.idUniverse })

      // We fetch all the Timelines from this universe
      await this.fetchTimelinesForUniverse(this.idUniverse)

      // Compute whether the user is an admin
      await this.setIsUniverseAdmin()
    } else {
      // We fetch all the Universes
      await this.fetchAllUniverses()

      // We get these universes
      this.universes = await this.getUniverses()
    }

    // We fetch the user from the authentification
    await this.fetchLoggedUser()

    // If the user's logged in
    if (this.bIsConnected) {
      // We fetch the user's data
      await this.fetchUser(this.connectedUser.id)
    }
  },

  methods: {
    ...mapActions('auth', ['fetchLoggedUser']),
    ...mapActions('character', ['fetchCharactersForUniverse']),
    ...mapActions('map', ['fetchMapsForUniverse']),
    ...mapActions('timeline', ['fetchTimelinesForUniverse']),
    ...mapActions('universe', ['fetchAllUniverses']),
    ...mapActions('user', ['fetchUser', 'fetchPlayersOfUniverse']),

    replaceByDefault () {
      const image = new Image()
      image.onload = (e) => {
        // If there is an error with the image : default one
        if (e.originalTarget === undefined || (e.originalTarget.width === 1 && e.originalTarget.height === 1)) {
          this.onError = 'https://tse1.mm.bing.net/th?id=OIP.UYxX1vxsuqp7EKw6eFQr7QHaE8&pid=Api'
        }
      }
      image.src = this.avatarUri
    },

    /** Opens the dialog */
    openDialog () {
      this.isDialogActive = true
    },

    /** Close the dialog */
    closeDialog () {
      this.isDialogActive = false
    },

    /** Sets whether the user is the admin of the current universe */
    async setIsUniverseAdmin () {
      // We check that the user is logged AND in a universe
      // Otherwise : always false
      if (this.isUniverseSelected && this.bIsConnected) {
        // We get the user's reference from this universe
        await this.fetchPlayersOfUniverse(this.idUniverse)
        const user = this.getUser(this.connectedUser.id)

        // If found, we return whether he's a GM or not
        this.isUniverseAdmin = user !== undefined ? user.bIsGM : false
      } else {
        this.isUniverseAdmin = false
      }
    }
  }
}
</script>
