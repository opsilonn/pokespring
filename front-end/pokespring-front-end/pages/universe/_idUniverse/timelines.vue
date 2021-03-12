<template>
  <v-card>
    <TimelineDialog
      :timeline="timelineTmp"
      :is-dialog-active="isDialogTimelineActive"
      @closeDialog="closeDialogueTimeline"
    />
    <WarningDialogTimeline
      :timeline="idTimeline"
      :is-dialog-active="isWarningActive"
      @closeDialog="closeDialogueWarning"
    />
    <h1 style="text-align:center">
      timelines
    </h1>
    <div v-if="canEdit">
      <v-btn
        color="pink"
        dark
        small
        absolute
        bottom
        right
        fab
        @click="openDialogueTimeline(0)"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
    <v-list v-for="timeline in timelines" :key="timeline.id">
      <v-list-item>
        <v-row>
          <v-col>
            <v-card>
              <v-card-title class="primary--text title">
                <v-row>
                  <v-col />
                  <v-col />
                  <v-col>
                    {{ timeline.name }}
                  </v-col>
                  <v-col />
                  <v-col>
                    <div v-if="canEdit">
                      <v-btn icon @click="openDialogueTimeline(timeline.id)">
                        <v-icon>mdi-feather</v-icon>
                      </v-btn>
                      <v-btn icon @click="openDialogueWarning(timeline.id)">
                        <v-icon>mdi-box-cutter</v-icon>
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col />
                  <v-col>
                    {{ timeline.description }}
                  </v-col>
                  <v-col>
                    <NuxtLink :to="'/universe/' + idUniverse + '/timeline/' + timeline.id" class="text-decoration-none">
                      <v-btn icon>
                        <v-icon>mdi-eye</v-icon>
                      </v-btn>
                    </NuxtLink>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import TimelineDialog from '@/components/timeline-dialog'
import WarningDialogTimeline from '@/components/warning-dialog-timeline'
export default {
  name: 'PageUniverseTimelines',

  components: {
    TimelineDialog,
    WarningDialogTimeline
  },
  data: () => ({
    isDialogTimelineActive: false,
    isWarningActive: false,
    idTimeline: -1,
    timelineTmp: {
      id: -1,
      name: 'Title',
      description: 'Description',
      bIsPublic: true,
      idUniverse: 0
    },
    canEdit: false
  }),
  computed: {
    ...mapGetters('timeline', ['getTimelines', 'getTimeline', 'getTimelineByid']),
    ...mapState('auth', ['connectedUser', 'authentificationStatus']),
    timelines () {
      return this.getTimelines()
    },
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || undefined
    }
  },

  async mounted () {
    // If the URL has a parameter to open the new Timeline's dialog
    if (this.$route.query.add !== undefined) {
      this.isDialogTimelineActive = this.$route.query.add === 'true'
    }

    await this.fetchTimelinesForUniverse(parseInt(this.$route.params.idUniverse))
    this.timelineTmp.idUniverse = parseInt(this.$route.params.idUniverse)
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
    ...mapActions('timeline', ['fetchTimeline', 'fetchTimelinesForUniverse', 'addTimeline', 'putTimeline']),

    closeDialogueTimeline () {
      this.isDialogTimelineActive = false
    },

    openDialogueTimeline (id) {
      if (id > 0) {
        this.timelineTmp = { ...this.getTimelineByid(id) }
      }
      this.isDialogTimelineActive = true
    },

    closeDialogueWarning () {
      this.isWarningActive = false
    },

    openDialogueWarning (id) {
      if (id > 0) {
        this.idTimeline = id
      }
      this.isWarningActive = true
    }
  }
}
</script>
