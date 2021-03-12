<template>
  <v-dialog v-model="value" max-width="750px" @click:outside="closeDialog">
    <!-- Login Dialog -->
    <v-card>
      <v-tabs
        v-model="tabModel"
        background-color="secondary"
        grow
      >
        <!-- All the menus Tabs-->
        <!-- 1 - Login -->
        <v-tab>
          <!-- icon -->
          <v-icon left>
            mdi-login
          </v-icon>

          <!-- text -->
          <div class="shrink mt-1 d-none d-lg-flex">
            Login
          </div>
        </v-tab>

        <!-- 2 - Sign in -->
        <v-tab>
          <!-- icon -->
          <v-icon left>
            mdi-account-plus
          </v-icon>

          <!-- text -->
          <div class="shrink mt-1 d-none d-lg-flex">
            New account
          </div>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tabModel">
        <!-- All the menu's contents -->
        <!-- 1 - Login -->
        <v-tab-item>
          <v-card-text>
            <v-container>
              <v-form ref="formLogin" v-model="formLogin">
                <!-- Text -->
                <h3 class="pa-4" align="center">
                  Please enter your credentials
                </h3>

                <v-spacer />

                <!-- Field : Username -->
                <v-text-field
                  v-model="loginUsername"
                  class="pa-4"
                  counter="50"
                  filled
                  prepend-icon="mdi-face"
                  label="Username"
                  :rules="[rules.required, rules.maxSmall]"
                />

                <!-- Field : Password -->
                <v-text-field
                  v-model="loginPassword"
                  class="pa-4"
                  counter="50"
                  filled
                  prepend-icon="mdi-lock"
                  label="Password"
                  :append-icon="showLoginPw ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.maxSmall]"
                  :type="showLoginPw ? 'text' : 'password'"
                  @click:append="showLoginPw = !showLoginPw"
                />
              </v-form>

              <br><br><br>

              <!-- ALERT - displayed if the credentials are incorrect -->
              <v-alert
                v-model="loginFailed"
                dense
                outlined
                prominent
                dismissible
                type="error"
                transition="scale-transition"
              >
                {{ loginErrorMessage }}
              </v-alert>
            </v-container>
          </v-card-text>
        </v-tab-item>

        <!-- 2 - Sign up -->
        <v-tab-item>
          <v-card-text>
            <v-container>
              <v-form ref="refFormSignup" v-model="formSignup">
                <!-- Text -->
                <h3 class="pa-4" align="center">
                  Having an account allows you to keep track of your scores
                </h3>

                <v-spacer />

                <!-- Field : Username -->
                <v-text-field
                  v-model="signUpUsername"
                  class="pa-4"
                  counter="50"
                  filled
                  prepend-icon="mdi-face"
                  label="Username"
                  :rules="[rules.required, rules.maxSmall]"
                />

                <!-- Field : Password -->
                <v-text-field
                  v-model="signUpPassword"
                  class="pa-4"
                  counter="50"
                  filled
                  prepend-icon="mdi-lock"
                  label="Password"
                  :append-icon="showSignUpPw ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.maxSmall]"
                  :type="showSignUpPw ? 'text' : 'password'"
                  @click:append="showSignUpPw = !showSignUpPw"
                />

                <!-- Field : Password verif -->
                <v-text-field
                  v-model="signUpPasswordVerif"
                  class="pa-4"
                  counter="50"
                  filled
                  prepend-icon="mdi-lock"
                  label="Password verification"
                  :append-icon="showSignUpPwVerif ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.maxSmall]"
                  :type="showSignUpPwVerif ? 'text' : 'password'"
                  @click:append="showSignUpPwVerif = !showSignUpPwVerif"
                />
              </v-form>
              <br><br><br>

              <!-- ALERT - displayed if the credentials are incorrect -->
              <v-alert
                v-model="signUpFailed"
                dense
                outlined
                dismissible
                prominent
                type="error"
                transition="scale-transition"
              >
                {{ signUpErrorMessage }}
              </v-alert>
            </v-container>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>

      <!-- Buttons -->
      <v-card-actions>
        <v-spacer />
        <!-- Button - CLOSE -->
        <v-btn color="warning" text @click="closeDialog">
          Close
        </v-btn>

        <!-- Button - ACTION ! -->
        <v-btn color="success" text @click="tabModel == 0 ? logIn() : signUp()">
          {{ tabModel == 0 ? "Login !" : "Sign up !" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// Imports
import { mapState, mapActions } from 'vuex'
import MixinRules from '@/mixins/mixin-rules'

export default {
  name: 'DialogLogin',

  mixins: [MixinRules],

  props: {
    value: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      tabModel: null,

      // Data - login
      loginUsername: '',
      loginPassword: '',

      // Data -signIn
      signUpUsername: '',
      signUpPassword: '',
      signUpPasswordVerif: '',

      // Whether to display some inputs or not
      showLoginPw: false,
      showSignUpPw: false,
      showSignUpPwVerif: false,

      // Form holder
      formLogin: false,
      formSignup: false,

      // Whether a form failed or not
      loginFailed: false,
      loginErrorMessage: '',
      signUpFailed: false,
      signUpErrorMessage: ''
    }
  },

  computed: {
    ...mapState('auth', ['bIsConnected'])
  },

  methods: {
    // Imports
    ...mapActions('auth', ['login']),
    ...mapActions('user', ['addUser']),

    /** Close dialog */
    closeDialog () {
      // We reset the error stuff
      this.loginFailed = false
      this.signUpFailed = false
      this.loginErrorMessage = ''
      this.signUpErrorMessage = ''

      this.$emit('input', false)
    },

    /** Method to Log in (connect to account) */
    async logIn () {
      // If the form is valid
      if (this.$refs.formLogin.validate()) {
        // We create a credentials instance
        const credentials = {
          username: this.loginUsername,
          password: this.loginPassword
        }

        // We try to login
        await this.login(credentials)

        // If the response has an ID : success !
        // Otherwise : failed login
        if (this.bIsConnected) {
          // We reset the inputs
          this.$refs.formLogin.reset()
          if (this.$refs.refFormSignup) {
            this.$refs.refFormSignup.reset()
          }

          // We close the dialog
          this.closeDialog()
        } else {
          this.loginFailed = true
          this.loginErrorMessage = 'Wrong username or password !'
        }
      }
    },

    /** Method to Sign up (create new account) */
    async signUp () {
      // If the form is valid
      if (this.$refs.refFormSignup.validate()) {
        // We create a credentials instance
        const credentials = {
          username: this.signUpUsername,
          password: this.signUpPassword
        }

        // We try to login
        const response = await this.addUser(credentials)

        // If the sign-up is successful : log into the new account
        // Otherwise : error
        if (response.ok) {
          // We try to login with the very new credentials
          await this.login(credentials)

          // If the user is considered Logged : success !
          // Otherwise : failed signUp
          if (this.bIsConnected) {
            // We reset the inputs
            this.$refs.formLogin.reset()
            this.$refs.refFormSignup.reset()

            // We close the dialog
            this.closeDialog()
          } else {
            this.signUpFailed = true
            this.signUpE = response.message
          }
        } else {
          this.signUpFailed = true
          this.signUpE = 'Error at the sign Up, please try again'
        }
      } else {
        this.signUpFailed = true
        this.signUpErrorMessage = 'Nice try mate, but you\'re not going any further :3'
      }
    }
  }
}
</script>
