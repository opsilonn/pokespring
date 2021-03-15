<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col sm="8" md="6" lg="4">
        <v-card shaped>
          <v-container>
            <v-form ref="form" v-model="form">
              <!-- Text -->
              <h3 class="pa-4" align="center">
                Fill the form to create your account
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

              <!-- Field : Email -->
              <v-text-field
                v-model="email"
                class="pa-4"
                maxlength="50"
                counter
                filled
                prepend-icon="mdi-at"
                label="Email"
                :rules="[rules.required, rules.maxSmall, rules.email]"
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

              <!-- Field : Password -->
              <v-text-field
                v-model="passwordVerif"
                class="pa-4"
                maxlength="50"
                counter
                filled
                prepend-icon="mdi-lock"
                label="Password Verification"
                :append-icon="showPasswordVerif ? 'mdi-eye' : 'mdi-eye-off'"
                :rules="[rules.required, rules.maxSmall, rules.passwordMatch(password)]"
                :type="showPasswordVerif ? 'text' : 'password'"
                @click:append="showPasswordVerif = !showPasswordVerif"
              />
            </v-form>

            <!-- Button to sign up -->
            <center>
              <v-btn
                class="ma-4 zoom-xs"
                color="primary"
                large
                outlined
                @click="trySignup()"
              >
                Sign up !
              </v-btn>
            </center>
            
            <v-divider
              class="ma-6"
            />

            <!-- Button that redirects to log in -->
            <p class="text-center font-italic">
                <NuxtLink to="/auth/login">
                  Already have an account ?
                </NuxtLink>
              </span>
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
import { mapState, mapActions } from 'vuex'

export default {
  name: "PageAuthSignup",

  mixins: [MixinRules],

  data: () => ({
      // Data - login
      username: '',
      email: '',
      password: '',
      passwordVerif: '',

      // Whether to display some inputs or not
      showPassword: false,
      showPasswordVerif: false,

      // Form holder
      form: false,

      // Whether the form failed or not
      error: false,
      errorMessage: ''
    }),

  methods: {
    // Imports
    ...mapActions('authentification', ['signup']),

    /** Tries to signup using the inputs */
    async trySignup () {
      // We verify that the inputs are valid
      if (this.$refs.form.validate()) {
        // We create a credentials instance
        const credentials = {
          username: this.username,
          email: this.email,
          password: this.password
        }

        // We try to login
        const res = await this.signup(credentials)

        if (res.err) {
          this.error = true
          this.errorMessage = this.mxRules_errorMessages.failedSignup
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
    return { title: 'Sign up' }
  }
}
</script>
