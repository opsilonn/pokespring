<template>
  <v-dialog v-model="isDialogActive" max-width="750px" max-heidth="750px" @click:outside="closeDialog">
    <v-card>
      {{ error }}
      <v-container>
        <v-form ref="eventForm" v-model="eventForm">
          <v-row>
            <v-text-field
              v-model="event.titre"
              :rules="[rules.required, rules.maxSmall]"
              class="pa-4"
              counter="45"
              label="title"
              required
            />
          </v-row>
          <v-row>
            <v-textarea
              v-model="event.desc"
              :rules="[rules.required]"
              class="pa-4"
              counter="500"
              label="description"
              auto-grow
              required
            />
          </v-row>
          <v-row>
            <v-col>
              <v-text-field
                v-model="event.year"
                :rules="[numberRule, rules.required]"
                label="year"
                hide-details
                type="number"
                required
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="event.month"
                :rules="[numberRule]"
                label="month"
                hide-details
                type="number"
              />
            </v-col>
            <v-col>
              <v-text-field
                v-model="event.day"
                :rules="[numberRule]"
                label="day"
                hide-details
                type="number"
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
          <v-btn color="success" text @click="event.id < 0 ? newEvent() : changeEvent()">
            {{ event.id > 0 ? "modify !" : " add !" }}
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import MixinRules from '@/mixins/mixin-rules'
export default {
  mixins: [MixinRules],
  props: {
    event: {
      type: Object,
      required: true
    },
    isDialogActive: {
      type: Boolean,
      required: true
    },
    idTimeline: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      titre: 'Titre',
      desc: 'description',
      year: 0,
      month: 0,
      day: 0,
      numberRule: (v) => {
        if (!isNaN(parseInt(v)) && v >= 0 && v <= 9999) { return true }
        return 'Number has to be between 0 and 999'
      },
      error: '',
      eventForm: false
    }
  },
  computed: {
    ...mapGetters('event', ['getEvent'])
  },
  methods: {
    ...mapActions('event', ['addEvent', 'putEvent']),
    closeDialog () {
      this.$emit('closeDialog')
    },
    async newEvent () {
      if (this.$refs.eventForm.validate()) {
        const add = { name: this.event.titre, year: this.event.year, month: this.event.month, day: this.event.day, description: this.event.desc, idTimeline: this.idTimeline }
        const result = await this.addEvent(add)
          .catch((err) => { this.error = err })
        if (result !== undefined) {
          this.closeDialog()
        }
      }
    },
    async changeEvent () {
      if (this.$refs.eventForm.validate()) {
        const mod = { name: this.event.titre, year: this.event.year, month: this.event.month, day: this.event.day, description: this.event.desc, idTimeline: this.idTimeline }
        const result = await this.putEvent({ id: this.event.id, event: mod })
          .catch((err) => { this.error = err })
        if (result !== undefined) {
          this.closeDialog()
        }
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
