<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col sm="8" md="6" lg="4">
        <v-card shaped>
          <v-container>
            <v-form ref="form" v-model="form">
              <!-- Text -->
              <h3 class="pa-4" align="center">
                Please enter your credentials
              </h3>

              <!-- ALERT - displayed if the credentials are incorrect -->
              <v-alert
                v-model="error"
                dense
                outlined
                prominent
                dismissible
                type="error"
                transition="scale-transition"
              >
                {{ errorMessage }}
              </v-alert>

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

              <!-- Field : Password -->
              <v-text-field
                v-model="password"
                class="pa-4"
                maxlength="50"
                counter
                filled
                prepend-icon="mdi-lock"
                label="Password"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.maxSmall]"
                :type="showPassword ? 'text' : 'password'"
                @click:append="showPassword = !showPassword"
              />
            </v-form>

            <!-- Button to log in -->
            <center>
              <v-btn
                class="ma-4 zoom-xs"
                color="primary"
                large
                outlined
                @click="tryLogin()"
              >
                Log in !
              </v-btn>
            </center>
            
            <!-- Divider -->
            <v-divider class="ma-6" />

            <!-- Button that redirects to sign up -->
            <p class="text-center">
              New to Pokespring ?
              <span class="font-italic">
                <NuxtLink to="/auth/signup">
                  Create your account !
                </NuxtLink>
              </span>
            </p>
            
            <!-- Button that redirects to forgot-password -->
            <p class="text-center font-italic">
              <NuxtLink to="/auth/forgot-password">
                Forgot your password ?
              </NuxtLink>
            </p>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Imports
import MixinRules from '@/mixins/mixin-rules'
import { mapActions } from 'vuex'

export default {
  name: 'PageAuthLogin',
  transition: 'slide-bottom',

  mixins: [MixinRules],

  data: () => ({
      // Data - login
      username: '',
      password: '',

      // Whether to display some inputs or not
      showPassword: false,

      // Form's holder
      form: false,

      // Whether the form failed or not
      error: false,
      errorMessage: ''
    }),

  methods: {
    // Imports
    ...mapActions('authentification', ['login']),

    /** Tries to login using the inputs */
    async tryLogin () {
      // We verify that the inputs are valid
      if (this.$refs.form.validate()) {
        // We create a credentials instance
        const credentials = {
          username: this.username,
          password: this.password
        }

        // We try to login
        const res = await this.login(credentials)

        if (res.err) {
          this.error = true
          this.errorMessage = this.mxRules_errorMessages.failedLogin
        } else {
          /*
          const path = (this.$route.query.redirect !== undefined) ? decodeURI(this.$route.query.redirect) : '/'
          this.$router.push({ path })
          */

          // Refresh, and let the middlewares take us to the right URL
          await location.reload()
        }
      }
    }
  },

  head() {
    return { title: 'Log in' }
  }
}
</script>
