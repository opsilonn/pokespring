<template>
  <v-dialog v-model="isDialogActive" max-width="750px" max-heidth="750px" @click:outside="closeDialog">
    <v-card>
      {{ error }}
      <v-container>
        <v-form ref="eventForm">
          <v-row>
            <v-text-field
              v-model="timeline.name"
              :rules="[rules.required, rules.maxSmall]"
              class="pa-4"
              counter="45"
              label="title"
            />
          </v-row>
          <v-row>
            <v-textarea
              v-model="timeline.description"
              :rules="[rules.required]"
              class="pa-4"
              counter="500"
              label="description"
              auto-grow
            />
          </v-row>
          <v-row class="ma-4">
            <v-col class="d-flex justify-center" cols="12">
              <v-switch
                v-model="timeline.bIsPublic"
                inset
                label="Is the timeline public ?"
              />
            </v-col>
          </v-row>
        </v-form>
        <v-card-actions>
          <v-spacer />
          <!-- Button - CLOSE -->
          <v-btn color="warning" text @click="closeDialog">
            Close
          </v-btn>

          <!-- Button - ACTION ! -->
          <v-btn color="success" text @click="timeline.id < 0 ? newTimeline() : changeTimeline()">
            {{ timeline.id > 0 ? "modify !" : " add !" }}
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex'
import MixinRules from '@/mixins/mixin-rules'
export default {
  mixins: [MixinRules],
  props: {
    timeline: {
      type: Object,
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

  methods: {
    ...mapActions('timeline', ['addTimeline', 'putTimeline']),
    closeDialog () {
      this.$emit('closeDialog')
    },
    async newTimeline () {
      if (this.$refs.eventForm.validate()) {
        const result = await this.addTimeline(this.timeline)
          .catch((err) => { this.error = err })
        if (result !== undefined) {
          this.closeDialog()
        }
      }
    },
    async changeTimeline () {
      if (this.$refs.eventForm.validate()) {
        const result = await this.putTimeline({ id: this.timeline.id, timeline: this.timeline })
          .catch((err) => { this.error = err })
        if (result !== undefined) {
          this.closeDialog()
        }
      }
    }
  }
}
</script>
