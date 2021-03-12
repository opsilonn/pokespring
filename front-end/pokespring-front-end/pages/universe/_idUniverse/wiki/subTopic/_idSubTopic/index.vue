<template>
  <v-container>
    <!-- SubTopic -->
    {{ updateSubTopicError }}
    <v-row>
      <h1 v-if="!modif" class="ma-4">
        {{ subTopic ? subTopic.name : 'SubTopic' }}
      </h1>
      <v-text-field v-else v-model="subTopicName" />

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
            :loading="deleteSubTopicLoading"
            @click="deleteSubTopic"
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
            :disabled="subTopic ? subTopicName === subTopic.name : true"
            :loading="updateSubTopicLoading"
            @click="updateSubTopic"
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
    <!-- Articles -->
    <v-card class="mt-8">
      <v-row class="ma-4" align="center">
        <h2>
          Articles
        </h2>
        <v-spacer />
        <NuxtLink v-if="bIsGM" :to="`${idSubTopic}/article`">
          <v-btn
            fab
            dark
            small
            color="dark"
            class="ma-4"
          >
            <v-icon primary>
              mdi-plus
            </v-icon>
          </v-btn>
        </NuxtLink>
      </v-row>
      <!-- All articles -->
      <v-list>
        <v-list-item
          v-for="article in articles"
          :key="article.id"
          :to="`../../wiki/article/${article.id}`"
        >
          <v-list-item-content>
            <v-list-item-title v-text="article.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'PageSubTopic',

  data: () => ({
    subTopicName: null,
    modif: null,
    updateSubTopicLoading: null,
    updateSubTopicError: null,
    deleteSubTopicLoading: null,
    rules: {
      required: value => !!value || 'Required'
    }
  }),

  computed: {
    ...mapState('auth', ['connectedUser']),

    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('subTopic', ['getSubTopicById']),
    ...mapGetters('article', ['getArticleBySubTopic']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    universe () {
      return this.idUniverse ? this.getUniverse(this.idUniverse) : null
    },
    idSubTopic () {
      return parseInt(this.$route.params.idSubTopic) || null
    },
    subTopic () {
      return this.idSubTopic ? this.getSubTopicById(this.idSubTopic) : null
    },
    articles () {
      return this.idSubTopic ? this.getArticleBySubTopic(this.idSubTopic) : null
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
      this.$store.dispatch('subTopic/fetchSubTopic', { idSubTopic: this.idSubTopic }),
      this.$store.dispatch('article/fetchArticlesForSubTopic', { idSubTopic: this.idSubTopic })
    ])
    this.subTopicName = this.subTopic.name
  },

  methods: {
    async updateSubTopic () {
      this.updateSubTopicError = null
      this.updateSubTopicLoading = true
      try {
        await this.$store.dispatch('subTopic/updateSubTopic', {
          subTopic: {
            id: this.idSubTopic,
            name: this.subTopicName
          }
        })
        this.modif = false
      } catch (err) {
        this.updateSubTopicError = err.message
      } finally {
        this.updateSubTopicLoading = false
      }
    },
    async deleteSubTopic () {
      this.deleteSubTopicLoading = true
      try {
        await this.$store.dispatch('subTopic/removeSubTopic', { idSubTopic: this.idSubTopic })
        this.$router.push(`/universe/${this.idUniverse}/wiki`)
      } finally {
        this.deleteSubTopicLoading = false
      }
    }
  },

  head () {
    return { title: 'Wiki sub-topic' }
  }
}
</script>
