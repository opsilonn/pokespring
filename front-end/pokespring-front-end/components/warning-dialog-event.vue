<template>
  <v-dialog v-model="isDialogActive" max-width="750px" max-heidth="750px" @click:outside="closeDialog">
    <v-card>
      {{ error }}
      <v-container>
        <v-card-text>
          <h3>etes vous sur de vouloir supprimer cette element</h3>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <!-- Button - CLOSE -->
          <v-btn color="warning" text @click="closeDialog">
            Close
          </v-btn>

          <!-- Button - ACTION ! -->
          <v-btn color="error" text @click="supprEvent()">
            supprimer!
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  props: {
    event: {
      type: Number,
      required: true
    },
    isDialogActive: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      error: ''
    }
  },
  computed: {
  },
  methods: {
    ...mapActions('event', ['deleteEvent']),
    closeDialog () {
      this.$emit('closeDialog')
    },
    async supprEvent () {
      const result = await this.deleteEvent(this.event)
        .catch((err) => { this.error = err })
      if (result.ok === true) {
        this.closeDialog()
      }
    }
  }
  /* idEvent: 0,
    isDialogActive: {
      type: Boolean,
      required: true
    } */
}
</script>
