<template>
  <div>
    <v-row>
      <v-text-field
        v-model="value.title"
        label="Article's title"
        prepend-icon="mdi-format-title"
      />
    </v-row>
    <v-row v-if="update">
      <ImageUploader
        v-model="image"
        label="thumbnail"
        :upload-to="`${urlOrigin}/api/v1/articles/${value.idArticle}?universe=${value.idUniverse}`"
        upload-name="article-image"
        :default-image="thumbnail"
        :max-height="200"
        @error="uploadError = $event"
      />
    </v-row>
    <v-row>
      <ComplexEditor
        v-model="value.content"
        :max-height="500"
        :min-height="400"
      />
    </v-row>
    <v-row>
      <v-col>
        <v-btn text color="success" large outlined @click="saveArticle">
          {{ update ? 'Save' : 'Create' }}
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ComplexEditor from '@/components/complex-editor.vue'
import ImageUploader from '@/components/image-uploader.vue'
import { mapGetters } from 'vuex'
export default {

  name: 'ArticleEditorComponent',

  components: {
    ComplexEditor,
    ImageUploader
  },

  props: {
    value: {
      type: Object,
      required: false,
      default: () => ({
        idArticle: -1,
        idUniverse: -1,
        title: null,
        content: null
      })
    },
    update: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    image: null,
    urlOrigin: window.location.origin
  }),

  computed: {
    ...mapGetters('article', ['getArticleById']),

    article () {
      return this.value.idArticle > 0 ? this.getArticleById(this.value.idArticle) : null
    },
    thumbnail () {
      if (this.value.idArticle > 0) {
        return `${this.urlOrigin}/back/universes/${this.value.idUniverse}/articles/${this.value.idArticle}/article.jpg#${this.article.uuid}`
      }
      return ' '
    }
  },

  watch: {
    image () {
      if (this.article.id <= 0) { return }

      this.$store.commit('article/updateUuid', { idArticle: this.article.id })
    },
    'value.title' (value) {
      this.$emit('input', this.value)
    },
    'value.content' (value) {
      this.$emit('input', this.value)
    }
  },

  mouted () {
  },
  methods: {
    saveArticle () {
      this.$emit('save')
    }
  }

}
</script>
