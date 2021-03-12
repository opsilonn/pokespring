const traverson = require('traverson-promise')

const state = () => ({
  articles: []
})

const getters = {
  getArticleById: state => function (id) {
    return state.articles.find(element => element.id === id)
  },

  getArticleBySubTopic: state => function (id) {
    return state.articles.filter(element => element.idSubTopic === id)
  }
}

const mutations = {
  addArticle (state, { article }) {
    article.uuid = new Date().getTime()
    const existing = state.articles.findIndex(e => e.id === article.id)
    if (existing !== -1) {
      state.articles[existing] = article
      state.articles = [...state.articles]
    } else {
      state.articles.push(article)
    }
  },

  updateUuid (state, { idArticle }) {
    const existing = state.articles.findIndex(e => e.id === idArticle)
    if (existing !== -1) {
      state.articles[existing].uuid = new Date().getTime()
      state.articles = [...state.articles]
    }
  },

  deleteArticle (state, { idArticle }) {
    const existing = state.articles.findIndex(e => e.id === idArticle)
    if (existing !== -1) {
      state.articles.splice(existing, 1)
    }
  }
}

const actions = {
  async fetchAllArticles (context) {
    const document = await traverson.from('/api/v1/articles')
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addArticle', { article: _ }))
  },

  async fetchArticle (context, { idArticle }) {
    const document = await traverson.from('/api/v1/articles/{idArticle}/')
      .withTemplateParameters({ idArticle })
      .json()
      .getResource().result

    context.commit('addArticle', { article: document })
  },

  async fetchByUrl (context, { url }) {
    const document = await traverson.from(url)
      .json()
      .getResource().result

    context.commit('addArticle', { article: document })
  },

  async fetchArticlesForSubTopic (context, { idSubTopic }) {
    const document = await traverson.from('/api/v1/sub-topics/{idSubTopic}/articles?truncate=1')
      .withTemplateParameters({ idSubTopic })
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addArticle', { article: _ }))
  },

  async createArticle (context, { article }) {
    const response = await traverson.from('/api/v1/articles')
      .json()
      .post(article).result

    const result = JSON.parse(response.body)
    context.commit('addArticle', { article: result })
    return result
  },

  async updateArticle (context, { article }) {
    const response = await traverson.from('/api/v1/articles/{idArticle}')
      .withTemplateParameters({ idArticle: article.id })
      .json()
      .put(article).result

    const result = JSON.parse(response.body)
    context.commit('addArticle', { article: result })
    return result
  },

  async removeArticle (context, { idArticle }) {
    const document = await traverson.from('/api/v1/articles/{idArticle}')
      .withTemplateParameters({ idArticle })
      .json()
      .delete().result

    if (document.ok) {
      context.commit('deleteArticle', { idArticle })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
