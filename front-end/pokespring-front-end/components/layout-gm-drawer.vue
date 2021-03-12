<template>
  <!-- GM's drawer -->
  <v-navigation-drawer
    v-model="model"
    temporary
    fixed
    app
  >
    <!-- Head of the drawer -->
    <center>
      <v-img
        class="ma-4"
        :src="universe.src || '/logo.png'"
        max-height="50"
        max-width="50"
        contain
      />
      <h3 v-text="universe.name" />
    </center>

    <!-- Divider -->
    <v-divider class="mt-4" />

    <!-- List of links -->
    <v-list dense>
      <v-subheader>Links</v-subheader>
      <v-list-item-group
        v-model="selectedItem"
        color="primary"
      >
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon v-text="item.icon" />
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>

    <!-- Divider -->
    <v-divider class="mt-4" />

    <!-- Dialog to invite new user -->
    <v-dialog
      v-model="dialogInviteUser"
      max-width="600px"
    >
      <!-- Dialog's trigger -->
      <template v-slot:activator="{ on, attrs }">
        <center>
          <v-btn
            class="ma-4"
            color="primary"
            dark
            text
            v-bind="attrs"
            v-on="on"
            v-text="'Invite user'"
          />
        </center>
      </template>

      <!-- Dialog -->
      <!-- Form -->
      <v-form ref="formInviteUser" v-model="formInviteUser">
        <v-card>
          <!-- Dialog's title -->
          <v-card-title>
            <span class="headline">Invite User</span>
          </v-card-title>

          <!-- Dialog's input(s) -->
          <v-card-text>
            <!-- New user's name -->
            <v-container>
              <v-text-field
                v-model="newUser.username"
                label="username"
                :rules="[rules.required, rules.maxSmall]"
              />
            </v-container>

            <!-- New user's role -->
            <v-container>
              <v-select
                v-model="newUser.role"
                :items="getRolesNames()"
                label="role"
                :rules="[rules.required]"
              />
            </v-container>
          </v-card-text>

          <!-- Dialog's actions -->
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="warning"
              text
              @click="dialogInviteUser = false"
            >
              Close
            </v-btn>
            <v-btn
              color="success"
              text
              @click="inviteUser"
            >
              Invite
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <!-- Divider -->
    <v-divider class="mt-4" />

    <!-- List of useful data -->
    <v-list dense>
      <!-- Cpt players -->
      <v-list-item>
        <v-list-item-content>Players :</v-list-item-content>
        <v-list-item-content class="align-end" v-text="characters.length" />
      </v-list-item>

      <!-- Cpt players ready -->
      <v-list-item>
        <v-list-item-content class="success--text" v-text="'Ready'" />
        <v-list-item-content class="success--text align-end" v-text="characters.filter(c => c.sheetStatus === 'Validated').length" />
      </v-list-item>

      <!-- Cpt players waiting validation -->
      <v-list-item>
        <v-list-item-content class="warning--text" v-text="'Waiting validation'" />
        <v-list-item-content class="warning--text align-end" v-text="characters.filter(c => c.sheetStatus === 'To validate').length" />
      </v-list-item>

      <!-- Cpt players wip -->
      <v-list-item>
        <v-list-item-content class="error--text" v-text="'Work in progress'" />
        <v-list-item-content class="error--text align-end" v-text="characters.filter(c => c.sheetStatus === 'Work In Progress' || c.sheetStatus === 'Refused').length" />
      </v-list-item>

      <!-- Divider small -->
      <v-container>
        <v-divider class="mx-8" />
      </v-container>

      <!-- Cpt maps -->
      <v-list-item>
        <v-list-item-content v-text="'Maps'" />
        <v-list-item-content class="align-end" v-text="maps.length" />
      </v-list-item>

      <!-- Cpt timelines -->
      <v-list-item>
        <v-list-item-content v-text="'Timelines'" />
        <v-list-item-content class="align-end" v-text="timelines.length" />
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
// Imports
import MixinRules from '@/mixins/mixin-rules'
import MixinRoles from '@/mixins/mixin-roles'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'LayoutGmDrawer',

  mixins: [MixinRules, MixinRoles],

  props: {
    value: {
      type: Boolean,
      required: true
    },
    characters: {
      type: Array,
      required: true
    },
    maps: {
      type: Array,
      required: true
    },
    timelines: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    group: null,
    selectedItem: -1,
    model: false,

    // All about the form to invite a user
    dialogInviteUser: false,
    formInviteUser: false,
    newUser: {
      username: '',
      role: ''
    }
  }),

  computed: {
    ...mapGetters('universe', ['getUniverse']),

    items () {
      return [
        { title: 'Character template', icon: 'mdi-human-handsup', to: '/universe/' + this.idUniverse + '/character-template' },
        { title: 'New map', icon: 'mdi-map', to: '/universe/' + this.idUniverse + '/maps?add=true' },
        { title: 'New timeline', icon: 'mdi-chart-timeline-variant', to: '/universe/' + this.idUniverse + '/timelines?add=true' },
        { title: 'Settings', icon: 'mdi-cog', to: '/universe/' + this.idUniverse + '/settings' }
      ]
    },

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    },

    universe () {
      return this.getUniverse(this.idUniverse) || {}
    }
  },

  watch: {
    /** whenever the user's logged in / out */
    model () {
      // Re-compute whether the user is an admin
      this.$emit('input', this.model)
    },

    /** whenever the user's logged in / out */
    value () {
      // Re-compute whether the user is an admin
      this.model = this.value
    },

    async idUniverse () {
      // We fetch the Universe from the database
      await this.fetchUniverse(this.idUniverse)
    }
  },

  async mounted () {
    // We fetch the Universe from the database
    await this.fetchUniverse(this.idUniverse)
  },

  methods: {
    ...mapActions('universe', ['fetchUniverse']),

    /** Invites a user to the universe */
    inviteUser () {
      // If the form is valid
      if (this.$refs.formInviteUser.validate()) {
        // We display the name of the invited user
        alert('inviting ' + this.newUser.username + ' as a ' + this.newUser.role)

        // We reset the form
        this.$refs.formInviteUser.reset()

        // We close the dialog
        this.dialogInviteUser = false
      }
    }
  }
}
</script>
