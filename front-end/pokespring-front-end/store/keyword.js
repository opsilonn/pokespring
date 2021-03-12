const traverson = require('traverson-promise')

const state = () => ({
  keywords: []
})

const getters = {
  getKeywordByid: state => function (id) {
    return state.keywords.find(element => element.id === id)
  },

  getKeywordByArticle: state => function (id) {
    return state.keywords.filter(element => element.idArticle === id)
  }
}

const mutations = {
  addKeyword (state, { keyword }) {
    const existing = state.keywords.findIndex(e => e.id === keyword.id)
    if (existing !== -1) {
      state.keywords[existing] = keyword
      state.keywords = [...state.keywords]
    } else {
      state.keywords.push(keyword)
    }
  },

  deleteKeyword (state, { idKeyword }) {
    const existing = state.keywords.findIndex(e => e.id === idKeyword)
    if (existing !== -1) {
      state.keywords.splice(existing, 1)
    }
  }
}

const actions = {
  async fetchAllKeywords (context) {
    const document = await traverson.from('/api/v1/keywords')
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addKeyword', { keyword: _ }))
  },

  async fetchKeyword (context, { idKeyword }) {
    const document = await traverson.from('/api/v1/keywords/{idKeyword}')
      .withTemplateParameters({ idKeyword })
      .json()
      .getResource().result

    context.commit('addKeyword', { keyword: document })
  },

  async fetchByUrl (context, { url }) {
    const document = await traverson.from(url)
      .json()
      .getResource().result

    context.commit('addKeyword', { keyword: document })
  },

  async fetchKeywordForArticle (context, { idArticle }) {
    const document = await traverson.from('/api/v1/articles/{idArticle}/keywords')
      .withTemplateParameters({ idArticle })
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addKeyword', { keyword: _ }))
  },

  async createKeyword (context, { keyword }) {
    const response = await traverson.from('/api/v1/keywords')
      .json()
      .post(keyword).result

    const result = JSON.parse(response.body)
    context.commit('addKeyword', { keyword: result })
    return result
  },

  async updateKeyword (context, { keyword }) {
    const response = await traverson.from('/api/v1/keywords/{idKeyword}')
      .withTemplateParameters({ idKeyword: keyword.id })
      .json()
      .put(keyword).result

    const result = JSON.parse(response.body)
    context.commit('addKeyword', { keyword: result })
  },

  async removeKeyword (context, { idKeyword }) {
    const document = await traverson.from('/api/v1/keywords/{idKeyword}')
      .withTemplateParameters({ idKeyword })
      .json()
      .delete().result

    if (document.ok) {
      context.commit('removeKeyword', { idKeyword })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
