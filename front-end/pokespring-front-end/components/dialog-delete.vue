<template>
  <v-container>
    <!-- Button to delete -->
    <center class="pa-16">
      <v-btn
        large
        outlined
        color="error"
        class="ma-2"
        @click.stop="dialog = true"
      >
        <v-icon left>
          mdi-delete
        </v-icon>
        {{ buttonTitle }}
      </v-btn>
    </center>

    <!-- Dialog to delete -->
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <!-- Title -->
        <v-card-title class="headline error--text">
          {{ dialogTitle }}
        </v-card-title>

        <!-- Content -->
        <v-card-text>
          <!-- Content -->
          {{ dialogMessage }}

          <!-- Universe's name (for verification) -->
          <v-form ref="form" v-model="form">
            <v-container>
              <v-text-field
                v-model="model"
                :label="dialogLabel"
                clearable
                :rules="[rules.required, rules.maxSmall, rules.nameMatch(stringToMatch)]"
                type="text"
              />
            </v-container>
          </v-form>
        </v-card-text>

        <!-- Actions -->
        <v-card-actions>
          <v-spacer />

          <!-- Button : cancel -->
          <v-btn
            color="warning"
            text
            @click="dialog = false"
            v-text="'Cancel'"
          />

          <!-- Button : delete -->
          <v-btn
            color="error"
            text
            @click="action"
            v-text="'Delete'"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
// Imports
import MixinRules from '@/mixins/mixin-rules'

export default {
  name: 'DialogDelete',

  mixins: [MixinRules],

  props: {
    buttonTitle: {
      type: String,
      required: true
    },
    dialogTitle: {
      type: String,
      required: true
    },
    dialogLabel: {
      type: String,
      required: true
    },
    dialogMessage: {
      type: String,
      required: true
    },
    stringToMatch: {
      type: String,
      required: true
    },
    validate: {
      type: Function,
      required: true
    }
  },

  data: () => ({
    dialog: false,
    form: false,
    model: ''
  }),

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
    }
  },

  methods: {
    action () {
      // If the form is valid
      if (this.$refs.form.validate()) {
        // We launch the method given as a prop
        this.validate()
      }
    }
  }
}
</script>
