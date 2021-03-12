<template>
  <v-container>
    <!-- when loading : progress-bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the settings..." />

    <!-- Card containing all data about the universe -->
    <v-card v-else shaped>
      <!-- Head of the card -->
      <v-container>
        <center>
          <v-img
            class="ma-4"
            :src="universe.src || '/logo.png'"
            max-height="200"
            max-width="200"
            contain
          />
          <h1 v-text="universe.name" />
        </center>
      </v-container>

      <!-- Divider -->
      <v-divider />

      <!-- Tabs for each data about the character -->
      <v-tabs
        v-model="tab"
        grow
        icons-and-text
        center-active
        centered
      >
        <v-tab
          v-for="(item, i) in tabItems"
          :key="i"
          exact
        >
          <span class="shrink d-none d-sm-flex">{{ item.title }}</span>
          <v-icon>{{ item.icon }}</v-icon>
        </v-tab>
      </v-tabs>

      <!-- Tabs -->
      <v-tabs-items v-model="tab">
        <!-- Tab n° 1 - Form the regular universe's data -->
        <v-tab-item>
          <v-container>
            <v-form ref="formUniverseData" v-model="formUniverseData">
              <!-- Name of the universe -->
              <v-row class="d-flex justify-center ma-4">
                <v-col cols="8" md="4">
                  <v-text-field
                    v-model="universePlaceholder.name"
                    label="Name of the universe"
                    :disabled="!isModifying"
                    :clearable="isModifying"
                    :rules="[rules.required, rules.maxSmall]"
                    type="text"
                  />
                </v-col>
              </v-row>

              <!-- Description of the universe -->
              <v-row class="d-flex justify-center ma-4">
                <v-col cols="12" md="8">
                  <v-textarea
                    v-model="universePlaceholder.description"
                    label="Description of the universe"
                    :disabled="!isModifying"
                    :rules="[rules.required]"
                    :placeholder="universePlaceholder.description || 'Please describe your universe !'"
                    outlined
                    auto-grow
                  />
                </v-col>
              </v-row>

              <!-- If the universe is public -->
              <v-row class="d-flex justify-center ma-4">
                <v-col class="d-flex justify-center" cols="12" md="4">
                  <v-switch
                    v-model="universePlaceholder.bIsPublic"
                    :disabled="!isModifying"
                    inset
                    label="Is the universe public ?"
                  />
                </v-col>
              </v-row>

              <!-- Buttons for modifications -->
              <ButtonsChanges
                :is-modifying="isModifying"
                text-activate="Modify the Universe"
                :activate="activateChanges"
                :discard="discardChangesUniverse"
                :validate="saveChangesUniverse"
              />
            </v-form>
          </v-container>
        </v-tab-item>

        <!-- Tab n° 2 - All users in the universe -->
        <v-tab-item>
          <v-container>
            <!-- Data table -->
            <v-data-table
              :headers="headers"
              :items="users"
              :hide-default-footer="true"
              sort-by="name"
            >
              <template v-slot:top>
                <!-- Toolbar -->
                <v-toolbar flat>
                  <v-toolbar-title>Users</v-toolbar-title>
                  <v-divider
                    class="mx-4"
                    inset
                    vertical
                  />
                  <v-spacer />

                  <!-- Dialog to add / modify a user -->
                  <v-form v-if="userIsGM" ref="formUser" v-model="formUser">
                    <v-dialog v-model="dialogUser" max-width="500px">
                      <template v-slot:activator="{ on, attrs }">
                        <!-- Button to add a user -->
                        <v-btn
                          color="primary"
                          text
                          v-bind="attrs"
                          v-on="on"
                          v-text="'New user'"
                        />
                      </template>

                      <!-- Form to add / modify a user -->
                      <v-card>
                        <v-card-title>
                          <span class="headline">{{ editedIndex === -1 ? 'New User' : 'Edit User' }}</span>
                        </v-card-title>

                        <v-card-text>
                          <v-container>
                            <v-row>
                              <!-- User's name (disabled if modifying a user) -->
                              <v-col cols="12" md="6">
                                <v-text-field
                                  v-model="editedUser.username"
                                  label="username"
                                  :disabled="editedIndex >= 0"
                                  :rules="[rules.required, rules.maxSmall]"
                                />
                              </v-col>

                              <!-- User's role -->
                              <v-col cols="12" md="6">
                                <v-select
                                  v-model="editedUser.role"
                                  :items="getRolesNamesCanAdd(isCreatorOfUniverse(connectedUser.id), userIsGM)"
                                  label="role"
                                  :rules="[rules.required]"
                                />
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>

                        <v-card-actions>
                          <v-spacer />
                          <v-btn color="warning" text @click="closeUser" v-text="'Cancel'" />
                          <v-btn color="success" text @click="saveUser" v-text="editedIndex > -1 ? 'Edit' : 'Invite'" />
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-form>
                </v-toolbar>
              </template>

              <!-- Column for Item's role -->
              <template v-slot:[`item.username`]="{ item }">
                <h3 :class="{ 'primary--text': item.id === connectedUser.id }">
                  {{ item.username }}
                </h3>
              </template>

              <!-- Column for Item's role -->
              <template v-slot:[`item.role`]="{ item }">
                <h3 :class="{ 'primary--text': item.id === connectedUser.id }">
                  {{ getRole(isCreatorOfUniverse(item.id), item.bIsGM).name }}
                </h3>
              </template>

              <!-- Column for Cpt character -->
              <template v-slot:[`item.characterCpt`]="{ item }">
                <h3 :class="{ 'primary--text': item.id === connectedUser.id }">
                  {{ characters.filter(c => c.idUser === item.id).length }}
                </h3>
              </template>

              <!-- Column to modify / delete a user -->
              <template v-slot:[`item.actions`]="{ item }">
                <!-- Edit -->
                <!-- logic is : MUST NOT BE MYSELF -> Am I the boss ? -> AM I a simple GM ? -->
                <v-icon
                  v-if="item.id !== connectedUser.id && (isCreatorOfUniverse(connectedUser.id) || (userIsGM && !item.bIsGM))"
                  :class="{ 'primary--text': item.id === connectedUser.id }"
                  small
                  class="mr-2"
                  @click="editUser(item)"
                >
                  mdi-pencil
                </v-icon>

                <!-- Delete -->
                <!-- logic is : Am I the boss (only if it is not my row) ? -> AM I a simple GM ? -> Is it my account (if not the Owner) ? -->
                <v-icon
                  v-if="(isCreatorOfUniverse(connectedUser.id) && connectedUser.id !== item.id)
                    || (userIsGM && !item.bIsGM)
                    || (!isCreatorOfUniverse(connectedUser.id) && connectedUser.id === item.id)"
                  :class="{ 'primary--text': item.id === connectedUser.id }"
                  small
                  @click="deleteUser(item)"
                >
                  mdi-delete
                </v-icon>
              </template>

              <!-- What to display if there no data in the table -->
              <template v-slot:no-data>
                <h2 class="pa-4">
                  Sorry, it seems there is no user in this universe :(
                </h2>
              </template>
            </v-data-table>
          </v-container>
        </v-tab-item>

        <!-- Tab n° 3 - Critical section -->
        <v-tab-item>
          <DialogDelete
            v-if="isCreatorOfUniverse(connectedUser.id)"
            v-model="deleteUniverseName"
            button-title="Delete the universe"
            dialog-title="Delete the universe"
            dialog-label="Name of the universe"
            dialog-message="This action is not reversible : if you delete this universe, no one will have access to any of its content afterwards !"
            :string-to-match="universe.name"
            :validate="deleteUniverseProtocol"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
// Imports
import CustomProgressBar from '@/components/custom-progress-bar'
import DialogDelete from '@/components/dialog-delete'
import MixinRoles from '@/mixins/mixin-roles'
import MixinRules from '@/mixins/mixin-rules'
import { mapActions, mapGetters, mapState } from 'vuex'
const lodash = require('lodash')

export default {
  name: 'PageUniverseSettings',

  components: {
    CustomProgressBar,
    DialogDelete
  },

  mixins: [MixinRoles, MixinRules],

  data: () => ({
    // Whether the page is loading its initial data or not
    isLoading: true,

    // User's data
    universe: {},
    users: [],
    characters: [],

    // Tabs
    tab: null,

    // Section 1 - Placeholder in which we modify the data of the universe
    formUniverseData: false,
    isModifying: false,
    universePlaceholder: {},

    // Section 2 - all users in the universe
    formUser: false,
    dialogUser: false,
    headers: [
      { text: 'username', value: 'username', sortable: true, align: 'center' },
      { text: 'Role', value: 'role', sortable: true, align: 'center' },
      { text: 'Number of characters', value: 'characterCpt', sortable: true, align: 'center' },
      { text: 'Actions', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedUser: {
      username: '',
      role: ''
    },

    // Section 3 - delete the universe
    formUniverseDelete: false,
    dialogDeleteUniverse: false,
    deleteUniverseName: ''
  }),

  computed: {
    ...mapState('auth', ['connectedUser']),
    ...mapGetters('character', ['getCharacters']),
    ...mapGetters('invitation', ['getUserInvite']),
    ...mapGetters('universe', ['getUniverse', 'getCurrentUniverse']),

    tabItems () {
      // We define the items
      const items = [
        { icon: 'mdi-earth', title: 'Universe' },
        { icon: 'mdi-human-handsup', title: 'Users' },
        { icon: 'mdi-alert', title: 'Danger Zone' }
      ]

      // If the user is not the Owner of the Universe : remove the dangerous zone
      if (!this.isCreatorOfUniverse(this.connectedUser.id)) {
        items.pop()
      }

      // We return the items
      return items
    },

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    },

    /** Whether the logged-in user is a Game Master */
    userIsGM () {
      const u = this.users.find(uu => uu.id === this.connectedUser.id)
      return u !== undefined ? u.bIsGM : false
    }
  },

  watch: {
    dialogUser (val) {
      val || this.closeUser()
    }
  },

  async mounted () {
    // We fetch the Universe
    await this.fetchUniverse(this.idUniverse)

    // We get the Universe
    this.universe = this.getUniverse(this.idUniverse)
    // We fill the placeholder with the universe's data
    this.universePlaceholder = lodash.cloneDeep(this.universe)

    // We fetch the Universe's members / nvititations
    await this.fetchInvitesForUniverse(this.idUniverse)
    // We get the Universe's members / nvititations
    this.users = this.getUserInvite(this.idUniverse)

    // We fetch the Universe's characters
    await this.fetchCharactersForUniverse(this.idUniverse)
    // We get the Universe's characters
    this.characters = this.getCharacters()

    // We consider the loading done
    this.isLoading = false
  },

  methods: {
    ...mapActions('character', ['fetchCharactersForUniverse']),
    ...mapActions('invitation', ['fetchInvitesForUniverse', 'addInviteInUniverse', 'putInviteInUniverse', 'deleteInviteInUniverse']),
    ...mapActions('universe', ['fetchUniverse', 'putUniverse', 'deleteUniverse']),

    /** Whether the user of given Id is the creator of the universe */
    isCreatorOfUniverse (id) {
      return id === this.universe.idUser
    },

    /** Activate the changes to the Universe */
    activateChanges () {
      this.isModifying = true
    },

    /** Discard the changes brought to the universe */
    discardChangesUniverse () {
      // We reset the Placeholder
      this.universePlaceholder = lodash.cloneDeep(this.universe)

      // We end the modification
      this.isModifying = false
    },

    /** Saves the changes brought to the universe, IF VALID */
    async saveChangesUniverse () {
      // If the form is valid
      if (this.$refs.formUniverseData.validate()) {
        // We modify the universe
        await this.putUniverse({ id: this.idUniverse, universe: this.universePlaceholder })

        // We re-get the Universe
        this.universe = this.getUniverse(this.idUniverse)

        // We close the modification
        this.isModifying = false
      }
    },

    /**
     * Edit the user currently selected
     * @param {[]} user The currently selected user
     */
    editUser (user) {
      this.editedIndex = this.users.indexOf(user)
      this.editedUser = lodash.cloneDeep(user)
      this.dialogUser = true
    },

    /**
     * Delete the user currently selected
     * @param {{}} user The currently selected user
     */
    async deleteUser (user) {
      await this.deleteInviteInUniverse({ idUniverse: this.idUniverse, idUser: user.id })
    },

    /** Close the dialog */
    closeUser () {
      // We close the dialog
      this.dialogUser = false

      // We reset the form
      this.$refs.formUser.reset()

      // We reset the index
      this.$nextTick(() => {
        this.editedIndex = -1
      })
    },

    /** Save a new user, or a selected user that has been modified */
    async saveUser () {
      // If the form is valid
      if (this.$refs.formUser.validate()) {
        // IF - modify an existing user
        // ELSE - invite a new user
        if (this.editedIndex > -1) {
          this.putInviteInUniverse(
            {
              id: this.idUniverse,
              invite: {
                username: this.editedUser.username,
                bIsGM: this.getRoleByName(this.editedUser.role).bIsGM
              }
            })
        } else {
          this.addInviteInUniverse(
            {
              id: this.idUniverse,
              invite: {
                username: this.editedUser.username,
                bIsGM: this.getRoleByName(this.editedUser.role).bIsGM
              }
            })
        }

        // We fetch the Universe's members / nvititations
        await this.fetchInvitesForUniverse(this.idUniverse)
        // We get the Universe's members / nvititations
        this.users = this.getUserInvite(this.idUniverse)

        // We close the dialog
        this.closeUser()
      }
    },

    /** Deletes this universe */
    deleteUniverseProtocol () {
      // If the form is valid
      if (this.universe.name === this.deleteUniverseName) {
        // We delete the universe
        this.deleteUniverse(this.idUniverse)

        // We redirect the user to the home page
        document.location.href = '/getting-started'
      }
    }
  },

  head () {
    return { title: this.universe.name + ' settings' }
  }
}
</script>
