<template>
  <v-container>
    <!-- Titre -->
    <div>
      <v-row>
        <h1 class="ma-4">
          Welcome to {{ universe !==undefined ? universe.name : '' }}'s wiki
        </h1>

        <v-spacer />
        <!-- Add -->
        <v-dialog
          v-if="bIsGM"
          v-model="dialogAdd"
          width="500"
        >
          <!--Button : trigger of the dialog -->
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="ma-4"
              fab
              dark
              color="dark"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon dark>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>

          <!-- Dialog -->
          <v-card>
            <v-card-title>
              <span class="headline">New Topic</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                {{ newTopicError }}
                <!-- Form -->
                <v-form ref="formAdd" v-model="formAdd">
                  <!-- Inputs for Add -->
                  <v-row>
                    <!-- New Add: name -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="newTopicName"
                        label="Topic's name"
                        :rules="[rules.required]"
                      />
                    </v-col>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <!-- Divider -->
            <v-divider />

            <!-- Actions -->
            <v-card-actions>
              <v-spacer />

              <!-- Button to create the Topic -->
              <v-btn
                color="primary"
                text
                :disabled="!formAdd"
                :loading="newTopicLoading"
                @click="createTopic"
              >
                Create !
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </div>
    <v-divider />
    <!-- All topic V3 -->
    <v-card
      v-for="topic in topics"
      :key="topic.id"
      class="ma-4"
    >
      <v-row>
        <v-col cols="12" md="3">
          <NuxtLink class="text-decoration-none" :to="`wiki/topic/${topic.id}`">
            <v-card-title class="primary--text">
              {{ topic.name }}
            </v-card-title>
          </NuxtLink>
        </v-col>
        <v-col cols="12" md="9">
          <div class="d-flex">
            <v-divider vertical />
            <v-row dense no-gutters>
              <v-col
                v-for="subtopic in getSubtopic(topic.id)"
                :key="subtopic.id"
                cols="12"
                md="6"
                lg="4"
              >
                <NuxtLink :to="`wiki/subtopic/${subtopic.id}`" class="text-decoration-none">
                  <v-container>
                    <v-card color="grey darken-3" elevation="8">
                      <v-card-title class="primary--text">
                        <div class="text-truncate">
                          {{ subtopic.name }}
                        </div>
                      </v-card-title>
                    </v-card>
                  </v-container>
                </NuxtLink>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-card>
    <div v-if="topics.length === 0">
      <v-divider class="ma-8" />
      <h2>
        Sorry, it seems that this universe does not have any topic yet...
      </h2>
    </div>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PageWiki',

  data: () => ({
    formAdd: false,
    dialogAdd: false,
    newTopicName: null,
    newTopicLoading: false,
    newTopicError: null,
    rules: {
      required: value => !!value || 'Required'
    }
  }),

  computed: {
    ...mapState('auth', ['connectedUser']),

    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('topic', ['getTopicsByUniverse']),
    ...mapGetters('subTopic', ['getSubTopicsByTopic']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    universe () {
      return this.idUniverse ? this.getUniverse(this.idUniverse) : null
    },
    topics () {
      return this.getTopicsByUniverse(this.idUniverse)
    },
    bIsGM () {
      if (!this.connectedUser) { return false }
      const universe = this.connectedUser.universesPlays.find(_ => _.id === this.idUniverse)
      if (!universe) { return false }
      return universe.bIsGM
    }
  },

  async mounted () {
    // We get the universe
    await this.$store.dispatch('topic/fetchTopicsForUniverse', { idUniverse: this.idUniverse })
    await Promise.all(this.topics.map((element) => {
      return this.$store.dispatch('subTopic/fetchSubTopicsForTopic', { idTopic: element.id })
    }))
  },

  methods: {
    async createTopic () {
      this.newTopicError = null
      this.newTopicLoading = true
      try {
        await this.$store.dispatch('topic/createTopic', {
          topic: {
            idUniverse: this.idUniverse,
            name: this.newTopicName
          }
        })

        this.dialogAdd = false
        this.newTopicName = null
      } catch (err) {
        this.newTopicError = err.message
      } finally {
        this.newTopicLoading = false
      }
    },

    getSubtopic (id) {
      return this.getSubTopicsByTopic(id)
    }
  },

  head () {
    return { title: 'Wiki' }
  }
}
</script>
