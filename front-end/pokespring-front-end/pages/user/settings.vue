<template>
  <v-container>
    <!-- Card containing all data about the user -->
    <v-card shaped>
      <!-- Head of the card -->
      <v-container>
        <center>
          <v-img
            class="ma-4"
            :src="user.src || '/logo.png'"
            max-height="200"
            max-width="200"
            contain
          />
          <h1 v-text="user.username" />
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
        <!-- Tab n° 1 - user's data -->
        <v-tab-item>
          <v-container>
            <v-form ref="formUserData" v-model="formUserData">
              <!-- Name of the user -->
              <v-row class="d-flex justify-center ma-4">
                <v-col cols="8" md="4">
                  <v-text-field
                    v-model="userPlaceholder.username"
                    label="Your username"
                    :disabled="!isModifying"
                    :clearable="isModifying"
                    :rules="[rules.required, rules.maxSmall]"
                    type="text"
                  />
                </v-col>
              </v-row>

              <v-row>
                <v-col />
                <v-col>
                  <ImageUploader
                    v-model="image"
                    label="Avatar"
                    :upload-to="`${urlOrigin}/api/v1/users/${connectedUser.id}`"
                    upload-name="user-image"
                    :default-image="avatarUri"
                    :max-height="200"
                    :disabled="!isModifying"
                    @error="uploadError = $event"
                  />
                </v-col>
                <v-col />
              </v-row>
              <!-- Buttons for modifications -->
              <ButtonsChanges
                :is-modifying="isModifying"
                text-activate="Modify the User"
                :activate="activateChangesUser"
                :discard="discardChangesUser"
                :validate="saveChangesUser"
              />
            </v-form>
          </v-container>
        </v-tab-item>

        <!-- Tab n° 2 - Critical section -->
        <v-tab-item>
          <v-container>
            <!-- Button to delete my account -->
            <DialogDelete
              v-model="deleteUsername"
              button-title="Delete my account"
              dialog-title="Delete my account"
              dialog-label="Your username"
              dialog-message="This action is not reversible : if you delete this user, you won't access any of its content afterwards !"
              :string-to-match="user.username"
              :validate="callDeleteUser"
            />
          </v-container>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-container>
</template>

<script>
// Imports
import MixinRules from '@/mixins/mixin-rules'
import DialogDelete from '@/components/dialog-delete'
import ImageUploader from '@/components/image-uploader.vue'
import { mapActions, mapGetters, mapState } from 'vuex'
const lodash = require('lodash')

export default {
  name: 'PageSettings',

  components: {
    DialogDelete,
    ImageUploader
  },

  mixins: [MixinRules],

  data () {
    return {
      // Tabs
      tab: null,
      tabItems: [
        { icon: 'mdi-account', title: 'My Account' },
        { icon: 'mdi-alert', title: 'Danger Zone' }
      ],

      // Section 1 - Placeholder in which we modify the data of the universe
      formUserData: false,
      isModifying: false,
      userPlaceholder: {
        id: -1,
        username: ''
      },

      // Section 2 - delete the user
      formUserDelete: false,
      dialogDeleteUser: false,
      deleteUsername: '',

      // for image upload
      urlOrigin: window.location.origin,
      image: null

    }
  },

  computed: {
    // Imports
    ...mapState('auth', ['bIsConnected', 'connectedUser']),
    ...mapGetters('user', ['getUser']),

    /** User's data */
    user () {
      return this.getUser(this.connectedUser.id)
    },

    /** User's picture */
    avatarUri () {
      return this.connectedUser.id !== -1 ? `${this.urlOrigin}/back/users/${this.connectedUser.id}/user.jpg#${this.connectedUser.uuid}` : ''
    }
  },

  watch: {
    image () {
      if (this.connectedUser.id <= 0) { return }

      this.$store.commit('auth/updateUuid')
    },

    bIsConnected () {
      if (!this.bIsConnected) {
        this.redirectToMainPage()
      }
    }
  },

  async mounted () {
    // We fetch the logged user for its id
    await this.fetchLoggedUser()

    // We fetch the user's data
    // await this.fetchUser(this.connectedUser.id)

    // We clone it with the placeholder
    this.userPlaceholder = lodash.cloneDeep(this.connectedUser)
  },

  methods: {
    ...mapActions('auth', ['fetchLoggedUser']),
    ...mapActions('user', ['fetchUser', 'putUser', 'deleteUser']),

    /** Redirects the user to the main page */
    redirectToMainPage () {
      this.$router.push({ name: '/' })
    },

    /** Activate the changes to the user */
    activateChangesUser () {
      this.isModifying = true
    },

    /**
     * Discard the changes brought to the user
     */
    discardChangesUser () {
      // We reset the Placeholder
      this.userPlaceholder = lodash.cloneDeep(this.user)

      // We end the modification
      this.isModifying = false
    },

    /**
     * Saves the changes brought to the user, IF VALID
     */
    async saveChangesUser () {
      // If the form is valid
      if (this.$refs.formUserData.validate()) {
        // We set the data received to the user
        await this.putUser({ id: this.user.id, user: this.userPlaceholder })

        // We close the modification
        this.isModifying = false
      }
    },

    /** Deletes the user */
    async callDeleteUser () {
      // We delete the user
      await this.deleteUser(this.user.id)

      // We log out the user
      this.logout()

      // We redirect the user
      this.redirectToMainPage()
    }
  },

  head () {
    return { title: this.user.username + ' Settings' }
  }
}
</script>
