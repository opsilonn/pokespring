<template>
  <v-container>
    <!-- 1 - create -->
    <div>
      <h1 class="ma-4">
        Create your own Universe !
      </h1>

      <!-- New universe -->
      <center class="pa-4">
        <!-- Dialog to create a new universe -->
        <v-dialog
          v-model="dialogNewUniverse"
          width="500"
        >
          <!-- Button : trigger of the dialog -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              x-large
              outlined
              color="primary"
              class="ma-2 zoom-xs"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon
                left
                dark
              >
                mdi-earth
              </v-icon>
              New Universe
            </v-btn>
          </template>

          <!-- Dialog if logged in : create a new universe -->
          <v-card v-if="bIsConnected">
            <v-card-title>
              <span class="headline">New Universe</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <!-- Form -->
                <v-form ref="formNewUniverse" v-model="formNewUniverse">
                  <!-- Inputs for the new universe -->
                  <v-row>
                    <!-- New universe : name -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="newUniverse.name"
                        label="Name"
                        :rules="[rules.required, rules.maxSmall]"
                      />
                    </v-col>

                    <!-- New universe : description -->
                    <v-col cols="12">
                      <div class="d-flex justify-center">
                        <v-textarea
                          v-model="newUniverse.description"
                          label="Description"
                          :rules="[rules.required, rules.maxBig]"
                          :placeholder="newUniverse.description || 'Please write the description of your universe !'"
                          outlined
                          auto-grow
                          rows="4"
                        />
                      </div>
                    </v-col>

                    <!-- New universe : isPublic -->
                    <v-col class="d-flex justify-center" cols="12">
                      <v-switch
                        v-model="newUniverse.bIsPublic"
                        inset
                        label="Is the universe public ?"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <!-- ALERT - displayed if an error occurs -->
            <v-container>
              <v-alert
                :value="errorMessage.length !== 0"
                dense
                outlined
                prominent
                type="error"
                transition="scale-transition"
              >
                {{ errorMessage }}
              </v-alert>
            </v-container>

            <!-- Divider -->
            <v-divider />

            <!-- Actions -->
            <v-card-actions>
              <v-spacer />

              <!-- Button - cancel -->
              <v-btn
                color="warning"
                text
                @click="dialogNewUniverse = false"
              >
                Cancel
              </v-btn>

              <!-- Button - create -->
              <v-btn
                color="primary"
                text
                @click="createUniverse"
              >
                Create new Universe !
              </v-btn>
            </v-card-actions>
          </v-card>

          <!-- Dialog if NOT logged in : warning -->
          <v-card v-else>
            <v-card-title>
              <span class="headline">Sign into your account !</span>
            </v-card-title>

            <v-container>
              Sorry, you are trying to access a feature that is only accessible to logged in users !
            </v-container>
            <v-container>
              Please log into your account or create a new one to access this feature.
            </v-container>

            <!-- Divider -->
            <v-divider />

            <!-- Actions -->
            <v-card-actions>
              <v-spacer />
              <!-- Button - dismiss -->
              <v-btn
                color="primary"
                text
                @click="dialogNewUniverse = false"
              >
                Dismiss
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </center>
    </div>

    <!-- divider -->
    <v-container>
      <v-divider class="ma-4" />
    </v-container>

    <!-- 2 - discover -->
    <h1 class="ma-4">
      Or discover the most popular ones !
    </h1>

    <!-- when loading : progress-bar -->
    <CustomProgressBar v-if="isLoading" message="Loading the universes..." />

    <!-- after loading : displaying the universes -->
    <div v-else>
      <RowCardsUniverse :universes="universes" />
    </div>
  </v-container>
</template>

<script>
// Imports
import CustomProgressBar from '@/components/custom-progress-bar'
import RowCardsUniverse from '@/components/row-cards-universe'
import MixinRules from '@/mixins/mixin-rules'
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  name: 'MostKnownUniverses',

  components: {
    CustomProgressBar,
    RowCardsUniverse
  },

  mixins: [MixinRules],

  data: () => ({
    // Universe to display
    universes: [],

    // Whether the form to add a dialog is valid or not
    formNewUniverse: false,
    dialogNewUniverse: false,
    newUniverse: {
      name: '',
      description: '',
      bIsPublic: true,
      user: {}
    },
    errorMessage: '',
    isLoading: true
  }),

  computed: {
    // Imports
    ...mapState('auth', ['bIsConnected', 'connectedUser']),
    ...mapGetters('universe', ['getUniverses'])
  },

  async mounted () {
    // We fetch all the Universes from the database
    await this.fetchAllUniverses()

    // We get these universes
    this.universes = await this.getUniverses()

    await Promise.all(this.getUniverses().map(async _ => await this.$store.dispatch('user/fetchUser', _.idUser)))

    // If the URL has a parameter to open the new Universe's dialog
    if (this.$route.query.newUniverse !== undefined) {
      this.dialogNewUniverse = this.$route.query.newUniverse === 'true'
    }

    // We consider the loading done
    this.isLoading = false
  },

  methods: {
    // Imports
    ...mapActions('universe', ['fetchAllUniverses', 'addUniverse']),

    async createUniverse () {
      // If the form is valid
      if (this.$refs.formNewUniverse.validate()) {
        // We check if a user is logged in
        if (this.bIsConnected) {
          // We create the object we'll send to the database
          const universe = {
            name: this.newUniverse.name,
            description: this.newUniverse.description,
            bIsPublic: this.newUniverse.bIsPublic,
            idUser: this.connectedUser.id
          }

          // We send the new universe and get the response
          const response = await this.addUniverse(universe)

          // If the response is positive : reforward the user to the page of the newly created universe
          // Otherwise : try again
          if (response.id >= 0) {
            document.location.href = '/universe/' + response.id
          } else {
            this.errorMessage = 'Something went wrong, please try again'
          }
        }
      }
    }
  },

  head () {
    return { title: 'Known universes' }
  }
}
</script>
