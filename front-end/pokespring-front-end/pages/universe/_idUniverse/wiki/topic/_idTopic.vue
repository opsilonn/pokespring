<template>
  <v-container>
    <!-- Topic -->
    {{ updateTopicError }}
    <v-row>
      <h1 v-if="!modif" class="ma-4">
        {{ topic ? topic.name : 'Topic' }}
      </h1>
      <v-text-field v-else v-model="topicName" />

      <v-spacer />
      <!-- button modify -->
      <div v-if="bIsGM">
        <v-btn
          v-if="!modif"
          class="ma-4"
          fab
          dark
          color="dark"
          @click="modif = true"
        >
          <v-icon dark>
            mdi-pencil
          </v-icon>
        </v-btn>
        <div v-else>
          <v-btn
            class="ma-4"
            fab
            dark
            color="red"
            :loading="deleteTopicLoading"
            @click="deleteTopic"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn
            class="ma-4"
            fab
            dark
            color="green"
            :disabled="topic ? topicName === topic.name : true"
            :loading="updateTopicLoading"
            @click="updateTopic"
          >
            <v-icon dark>
              mdi-checkbox-marked-circle
            </v-icon>
          </v-btn>
          <v-btn
            class="ma-4"
            fab
            dark
            color="dark"
            @click="modif = false"
          >
            <v-icon dark>
              mdi-cancel
            </v-icon>
          </v-btn>
        </div>
      </div>
    </v-row>
    <v-divider />
    <!-- SubTopics -->
    <v-card class="mt-8">
      <v-row class="ma-4" align="center">
        <h2>
          Sub-topics
        </h2>
        <v-spacer />
        <v-dialog
          v-if="bIsGM"
          v-model="dialogAdd"
          width="500"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              fab
              dark
              small
              color="dark"
              class="ma-4"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon primary>
                mdi-plus
              </v-icon>
            </v-btn>
          </template>

          <!-- Dialog -->
          <v-card>
            <v-card-title>
              <span class="headline">New Sub-topic</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                {{ newSubTopicError }}
                <!-- Form -->
                <v-form ref="formAdd" v-model="formAdd">
                  <!-- Inputs for Add -->
                  <v-row>
                    <!-- New Add: name -->
                    <v-col cols="12">
                      <v-text-field
                        v-model="newSubTopicName"
                        label="Sub-topic's name"
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
                :loading="newSubTopicLoading"
                @click="createSubTopic"
              >
                Create !
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
      <!-- All subtopic -->
      <v-row class="ma-4">
        <v-col
          v-for="subTopic in subTopics"
          :key="subTopic.id"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <NuxtLink :to="`../../wiki/subTopic/${subTopic.id}`" class="text-decoration-none">
            <v-card
              elevation="8"
              color="grey darken-3"
            >
              <!-- Title of the subtopic -->
              <v-card-title>
                <h4 class="primary--text text-truncate">
                  {{ subTopic.name }}
                </h4>
              </v-card-title>
            </v-card>
          </NuxtLink>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PageTopic',

  data: () => ({
    topicName: null,
    modif: null,
    updateTopicLoading: null,
    updateTopicError: null,
    deleteTopicLoading: null,
    formAdd: false,
    dialogAdd: false,
    newSubTopicName: null,
    newSubTopicLoading: false,
    newSubTopicError: null,
    rules: {
      required: value => !!value || 'Required'
    }
  }),

  computed: {
    ...mapState('auth', ['connectedUser']),

    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('topic', ['getTopicById']),
    ...mapGetters('subTopic', ['getSubTopicsByTopic']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    universe () {
      return this.idUniverse ? this.getUniverse(this.idUniverse) : null
    },
    idTopic () {
      return parseInt(this.$route.params.idTopic) || null
    },
    topic () {
      return this.idTopic ? this.getTopicById(this.idTopic) : null
    },
    subTopics () {
      return this.idTopic ? this.getSubTopicsByTopic(this.idTopic) : null
    },
    bIsGM () {
      if (!this.connectedUser) { return false }
      const universe = this.connectedUser.universesPlays.find(_ => _.id === this.idUniverse)
      if (!universe) { return false }
      return universe.bIsGM
    }
  },

  async mounted () {
    // We fetch the Universe from the database
    await Promise.all([
      this.$store.dispatch('topic/fetchTopic', { idTopic: this.idTopic }),
      this.$store.dispatch('subTopic/fetchSubTopicsForTopic', { idTopic: this.idTopic })
    ])
    this.topicName = this.topic.name
  },

  methods: {
    async createSubTopic () {
      this.newSubTopicError = null
      this.newSubTopicLoading = true
      try {
        await this.$store.dispatch('subTopic/createSubTopic', {
          subTopic: {
            idTopic: this.idTopic,
            name: this.newSubTopicName
          }
        })

        this.dialogAdd = false
        this.newSubTopicName = null
      } catch (err) {
        this.newSubTopicError = err.message
      } finally {
        this.newSubTopicLoading = false
      }
    },
    async updateTopic () {
      this.updateTopicError = null
      this.updateTopicLoading = true
      try {
        await this.$store.dispatch('topic/updateTopic', {
          topic: {
            id: this.idTopic,
            name: this.topicName
          }
        })
        this.modif = false
        this.$refs.formAdd.reset()
      } catch (err) {
        this.updateTopicError = err.message
      } finally {
        this.updateTopicLoading = false
      }
    },
    async deleteTopic () {
      this.deleteTopicLoading = true
      try {
        await this.$store.dispatch('topic/removeTopic', { idTopic: this.idTopic })
        this.$router.push(`/universe/${this.idUniverse}/wiki`)
      } finally {
        this.deleteTopicLoading = false
      }
    }
  },

  head () {
    return { title: 'Wiki topic' }
  }
}
</script>
