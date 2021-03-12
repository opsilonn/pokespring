<template>
  <v-container>
    <ArticleEditorComponent v-model="articleValue" :update="false" @save="addArticle" />
  </v-container>
</template>

<script>
import MixinRules from '@/mixins/mixin-rules'
import ArticleEditorComponent from '@/components/article-editor-component.vue'
import { mapGetters, mapActions, mapState } from 'vuex'
export default {

  components: {
    ArticleEditorComponent
  },

  mixins: [MixinRules],

  data: () => ({
    articleValue: {
      title: 'Test is a test',
      content: 'this is another test'
    },
    upadate: false,
    idReceived: 0,
    canEdit: false
  }),

  computed: {
    ...mapGetters('article', ['getArticleById']),
    ...mapGetters('subTopic', ['getSubTopicByid']),
    ...mapState('auth', ['connectedUser']),
    idSubtopic () {
      return parseInt(this.$route.params.idSubTopic) || undefined
    }
  },

  async mounted () {
  },

  methods: {
    ...mapActions('article', ['createArticle']),
    async addArticle () {
      const result = await this.createArticle({
        article: {
          title: this.articleValue.title,
          content: this.articleValue.content,
          idSubTopic: this.idSubtopic
        }
      })
      if (result.id > 0) {
        this.$router.push(`/universe/${this.idUniverse}/wiki`)
      }
    }
  }

}
</script>
