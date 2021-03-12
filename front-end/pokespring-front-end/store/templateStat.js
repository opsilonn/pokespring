const traverson = require('traverson-promise')

const state = () => ({
  templateStats: []
})

const getters = {
  getTemplateStats: state => function () {
    return state.templateStats
  },
  getTemplateStat: state => function (id) {
    return state.templateStats.find(element => element.id === id)
  }
}

const mutations = {
  setTemplateStats (state, TemplateStats) {
    state.templateStats = TemplateStats
  },

  putTemplateStat (state, TemplateStat) {
    const id = state.templateStats.findIndex((element) => {
      return element.id === TemplateStat.id
    })
    if (id === -1) {
      state.templateStats.push(TemplateStat)
    } else {
      state.templateStats[id] = TemplateStat
      state = { ...state }
    }
  },

  removeTemplateStat (state, id) {
    const index = state.templateStats.findIndex((element) => {
      return element.id === id
    })
    if (index !== -1) {
      state.templateStats.splice(index, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllTemplateStats (context) {
    await traverson.from('/api/v1/template-stats/')
      .json()
      .getResource().result
      .then((document) => {
        context.commit('setTemplateStats', document.list)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },

  async fetchTemplateStat (context, id) {
    const document = await traverson.from('/api/v1/template-stats/{idTemplate}')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putTemplateStat', document)
  },

  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putTemplateStat', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },

  async fetchTemplateStatForCategory (context, id) {
    const document = await traverson.from('/api/v1/template-categories/{idcategory}/template-stats')
      .withTemplateParameters({ idcategory: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setTemplateStats', document.list)
  },

  async addTemplateStat (context, template) {
    const response = await traverson.from('/api/v1/template-stats/')
      .json()
      .post(template).result
      .catch((err) => { throw err })
    const result = JSON.parse(response.body)
    context.commit('putTemplateStat', result)
    return result
  },

  async putTemplateStat (context, { template, id }) {
    const response = await traverson.from('/api/v1/template-stats/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .put(template).result
      .catch((err) => { throw err })
    const result = JSON.parse(response.body)
    context.commit('putTemplateStat', result)
    return result
  },

  async deleteTemplateStat (context, id) {
    const document = await traverson.from('/api/v1/template-stats/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeTemplateStat', id)
    }
    return document
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
