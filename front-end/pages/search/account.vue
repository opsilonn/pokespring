<template>
  <v-container>
    <v-card>
      <!-- Title -->
      <v-card-title>
        Search for an account
      </v-card-title>

      <!-- Input -->
      <v-row align="center" justify="center">
        <v-col cols="6">
          <!-- Field : Username -->
          <v-text-field
            v-model="username"
            class="pa-4"
            maxlength="20"
            counter
            filled
            prepend-icon="mdi-face"
            label="Username"
            :rules="[rules.required, rules.maxSmall]"
          />
        </v-col>
      </v-row>
      
      <!-- Divider -->
      <v-divider class="ma-6" />

      <!-- If the user has not entered anything yet -->
      <!-- If no search has been done yet -->
      <h3 v-if="waitingForInput" class="pa-4 text-center font-italic">
        Please search for an account !
      </h3>

      <div v-else>
        <!-- Waiting for the data to be fetched -->
        <CustomProgressBar v-if="waitingForResult" message="fetching data..." />

        <!-- The data have been fetched -->
        <div v-else>
          <!-- If there's no result -->
          <h3 v-if="accounts.length === 0" class="pa-4 text-center font-italic">
            No account matches your research...
          </h3>

          <!-- If there's a result : list of all the matching Accounts -->
          <v-list v-else style="background-color: inherit">
            <v-list-group
              v-for="account in accounts"
              :key="account.id"
              v-model="account.selected"
              no-action
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <!-- Title : Account's username -->
                  <v-list-item-title>
                    <router-link :to="'/account/' + account.username">
                      {{ account.username }}
                    </router-link>
                  </v-list-item-title>

                  <!-- Subtitle : Account's username -->
                  <v-list-item-subtitle v-text="'Number of teams : ' + account.teams.length" />
                </v-list-item-content>
              </template>

              <!-- We iterate through the Account's Teams -->
              <v-list-item
                v-for="team in account.teams"
                :key="team.id"
                :to="'/team/' + team.id"
              >
                <!-- Team's name -->
                <v-list-item-content>
                  <v-list-item-title v-text="team.name" />
                </v-list-item-content>
              </v-list-item>
            </v-list-group>
          </v-list>
        </div>
      </div>
    </v-card>
  </v-container>
</template>

<script>
// Imports
import MixinRules from '@/mixins/mixin-rules'
import Constants from '@/constants'
const lodash = require('lodash')
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PageSearchAccount',
  transition: 'slide-bottom',

  mixins: [MixinRules],
  data: () => ({
    // Form's data
    username: '',

    // Whether the user has searched for an account
    waitingForInput: true,
    waitingForResult: false,

    accounts: [],

    selectedAccount: false
  }),

  computed: {
    // Imports
    ...mapGetters('accounts', ['getAccounts'])
  },

  watch: {
    username () {
      // We get the username
      const currentUsername = this.username

      // We wait a given time
      setTimeout(async () => {
        // If the username is still the same (the user has stopped modifying it) AND the username is not empty
        if(currentUsername === this.username && currentUsername.length !== 0) {
          // The user has entered something
          this.waitingForInput = false

          // We consider that we begin fetching data
          this.waitingForResult = true

          // We search for the accounts with matching username (if any)
          await this.searchAccountsByUsername({ username: this.username })

          // hello
          this.accounts = lodash.cloneDeep(this.getAccounts())
          this.accounts.forEach(account => account.active = false)
          console.log(this.accounts)

          // We consider that we've finished fetching data
          this.waitingForResult = false
        } else {
          // If there the field is empty, we consider the that we're waiting for the user
          this.waitingForInput = true
        }
      },

      // We wait for a specific amount of time before using the method above
      Constants.TIME_BEFORE_SEARCHING)
    },

    selectedAccount () {
      console.log(this.selectedAccount)
    }
  },

  methods: {
    // Imports
    ...mapActions('accounts', ['searchAccountsByUsername'])
    },

  head () {
    return { title: 'Search account' }
  }
}
</script>
