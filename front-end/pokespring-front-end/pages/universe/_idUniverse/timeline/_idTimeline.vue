<template>
  <v-container>
    <h2 class="text-center">
      {{ timeline.name }}
    </h2>
    <div v-if="canEdit">
      <v-btn @click="openDialogEvent(0)">
        add
      </v-btn>
    </div>
    <LayoutEventDialog
      :is-dialog-active="isDialogEventActive"
      :event="eventDefault"
      :id-timeline="parseInt(this.$route.params.idTimeline)"
      @closeDialog="closeDialogEvent"
    />
    <WarningDialogEvent
      :is-dialog-active="warningActive"
      :event="eventId"
      @closeDialog="closeWarning"
    />
    <v-container
      id="scroll-target"
      style="max-height: 800px"
      class="overflow-y-auto"
    >
      <v-timeline
        align-top
        :dense="$vuetify.breakpoint.smAndDown"
      >
        <v-timeline-item
          v-for="(item, i) in events"
          :key="i"
          color="dark"
        >
          <v-card
            dark
            outlined
          >
            <v-card-title class="primary--text title">
              <v-row>
                <v-col>
                  {{ item.name }}
                  <br> {{ item.day !== undefined && item.day !==0 ? item.day + " /" : "" }} {{ item.month !== undefined && item.month !==0 ? item.month : "" }} {{ "year: " + item.year }}
                </v-col>
                <v-col>
                  <div v-if="canEdit">
                    <v-btn icon @click="openDialogEvent(item.id)">
                      <v-icon>mdi-feather</v-icon>
                    </v-btn>
                    <v-btn icon @click="openWarning(item.id)">
                      <v-icon>mdi-box-cutter</v-icon>
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <p> {{ item.description }} </p>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </v-container>
  </v-container>
</template>

<script>
// Imports
import { mapActions, mapGetters, mapState } from 'vuex'
import LayoutEventDialog from '@/components/layout-event-dialog'
import WarningDialogEvent from '@/components/warning-dialog-event'
export default {
  name: 'PageUniverseTimeline',

  components: {
    LayoutEventDialog,
    WarningDialogEvent
  },

  data: () => ({
    items: [
      {
        color: 'red lighten-2',
        icon: 'mdi-star'
      },
      {
        color: 'purple darken-1',
        icon: 'mdi-book-variant'
      },
      {
        color: 'green lighten-1',
        icon: 'mdi-airballoon'
      },
      {
        color: 'indigo',
        icon: 'mdi-buffer'
      }
    ],
    isDialogEventActive: false,
    eventId: 0,
    eventDefault: {
      id: -1,
      titre: 'Titre',
      desc: 'description',
      year: 0,
      month: 0,
      day: 0
    },
    warningActive: false,
    canEdit: false
  }),

  computed: {
    ...mapGetters('timeline', ['getTimelines', 'getTimeline', 'getTimelineByid']),
    ...mapGetters('event', ['getEvents', 'getEvent']),
    ...mapGetters('universe', ['getUniverse']),
    ...mapState('auth', ['connectedUser', 'authentificationStatus']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    },
    /** Return the id of the Universe, if he has one */
    idTimeline () {
      return parseInt(this.$route.params.idTimeline) || undefined
    },
    events () {
      return this.getEvents()
    },
    timeline () {
      return this.getTimelineByid(parseInt(this.$route.params.idTimeline)) || 'title'
    }
  },

  async mounted () {
    await this.fetchUniverse(parseInt(this.$route.params.idUniverse))
    await this.fetchEventForTimeline(parseInt(this.$route.params.idTimeline))
    await this.fetchTimeline(parseInt(this.$route.params.idTimeline))
    // this.canEdit = this.getUniverse(parseInt(this.$route.params.idUniverse)).idUser === this.getLogged().iduser
    const result = this.connectedUser.universesOwns.find(element => element.id === parseInt(this.$route.params.idUniverse))
    if (result !== undefined) {
      this.canEdit = true
    } else {
      const res = this.connectedUser.universesPlays.find(element => element.id === parseInt(this.$route.params.idUniverse))
      if (res !== undefined) {
        this.canEdit = res.bIsGM
      }
    }
  },

  methods: {
    ...mapActions('timeline', ['fetchTimeline', 'fetchTimelineWithEvent', 'addTimeline', 'putTimeline']),
    ...mapActions('event', ['fetchEvent', 'fetchEventForTimeline', 'addEvent', 'putEvent', 'deleteEvent']),
    ...mapActions('universe', ['fetchUniverse']),
    /** Opens the dialog */
    openDialogEvent (id) {
      if (id > 0) {
        const tmp = this.getEvent(id)
        if (tmp !== undefined) {
          this.eventDefault.id = tmp.id
          this.eventDefault.titre = tmp.name
          this.eventDefault.desc = tmp.description
          this.eventDefault.year = tmp.year
          this.eventDefault.day = tmp.day
          this.eventDefault.month = tmp.month
        }
      }
      this.isDialogEventActive = true
    },

    /** Close the dialog */
    closeDialogEvent () {
      this.isDialogEventActive = false
    },

    openWarning (id) {
      this.eventId = id
      this.warningActive = true
    },

    closeWarning () {
      this.warningActive = false
    }
  },

  head () {
    return { title: 'Timeline' }
  }
}
</script>
