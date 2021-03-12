<template>
  <v-container>
    <v-dialog v-model="isOpen">
      <v-card>
        <v-container>
          <ArticleEditorComponent v-model="articleValue" :update="true" @save="changeArticle" />
        </v-container>
      </v-card>
    </v-dialog>
    <v-card class="pa-5" color="#42424233" rounded="0">
      <!-- Article title and GM's actions -->
      <v-row>
        <h1 class="ma-4">
          {{ article ? article.title : 'Article' }}
        </h1>

        <v-spacer />
        <!-- button modify -->
        <div v-if="canEdit">
          <v-btn
            class="ma-4"
            fab
            dark
            color="dark"
            @click="openDialog"
          >
            <v-icon dark>
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn
            class="ma-4"
            fab
            dark
            color="dark"
            @click="suprArticle"
          >
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </div>
      </v-row>

      <v-row justify="center">
        <v-img
          min-height="200"
          max-height="200"
          contain
          :src="articleUri"
          @load="replaceByDefault"
        />
      </v-row>
      <v-row v-if="!!article" class="mt-5">
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p v-html="article.content" />
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import MixinRules from '@/mixins/mixin-rules'
import ArticleEditorComponent from '@/components/article-editor-component.vue'
export default {
  name: 'PageArticle',

  components: {
    ArticleEditorComponent
  },

  mixins: [MixinRules],

  data: () => ({
    isOpen: false,
    text: '<h1>default</h1>',
    urlOrigin: window.location.origin,
    onError: null,
    articleValue: {
      title: 'Test is a test',
      content: 'this is another test',
      idArticle: -1,
      idUniverse: -1
    },
    idReceived: 0,
    canEdit: false
  }),

  computed: {
    ...mapGetters('universe', ['getUniverse']),
    ...mapGetters('article', ['getArticleById']),
    ...mapState('auth', ['connectedUser']),

    /** Return the id of the Universe, if he has one */
    idUniverse () {
      return parseInt(this.$route.params.idUniverse) || null
    },
    universe () {
      return this.idUniverse ? this.getUniverse(this.idUniverse) : null
    },
    idArticle () {
      return parseInt(this.$route.params.idArticle) || null
    },
    article () {
      return this.idArticle ? this.getArticleById(this.idArticle) : null
    },
    articleUri () {
      if (this.onError !== null) {
        return this.onError
      }
      return this.idArticle > 0 && this.article !== undefined ? `${this.urlOrigin}/back/universes/${this.idUniverse}/articles/${this.idArticle}/article.jpg#${this.article.uuid}` : ''
    }
  },

  async mounted () {
    // We fetch the Universe from the database
    await Promise.all([
      this.$store.dispatch('article/fetchArticle', { idArticle: this.idArticle })
    ])
    await this.fetchLoggedUser()
    this.articleValue.content = this.article.content
    this.articleValue.title = this.article.title
    this.articleValue.idArticle = this.idArticle
    this.articleValue.idUniverse = this.idUniverse

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
    ...mapActions('article', ['updateArticle', 'removeArticle']),
    ...mapActions('auth', ['fetchLoggedUser']),
    openDialog () {
      this.isOpen = true
    },
    closeDialog () {
      this.isOpen = false
    },
    changeText (newText) {
      this.text = newText
    },
    async changeArticle () {
      const art = { title: this.articleValue.title, content: this.articleValue.content, id: this.articleValue.idArticle }
      const result = await this.updateArticle({ article: art })
      if (result.id > 0) {
        this.isOpen = false
      }
    },
    replaceByDefault () {
      const image = new Image()
      image.onload = (e) => {
        if (e.originalTarget.width === 1 && e.originalTarget.height === 1) {
          this.onError = '/logo.png'
        }
      }
      image.src = this.characterUri
    },
    async suprArticle () {
      try {
        await this.removeArticle({ idArticle: this.idArticle })
        this.$router.push(`/universe/${this.idUniverse}/wiki`)
      } catch {

      }
    }
  },

  head () {
    return { title: 'Wiki article' }
  }
}
</script>
