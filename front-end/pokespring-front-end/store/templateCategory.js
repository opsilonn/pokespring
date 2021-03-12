const traverson = require('traverson-promise')

const state = () => ({
  templateCategories: [{
    name: 'Essential',
    id: -1,
    bIsSpecial: false,
    order: null,
    idUniverse: -1,
    stats: {
      list: []
    }
  }]
})

const getters = {
  getTemplateCategories: state => function () {
    return state.templateCategories
  },

  getTemplateCategory: state => function (id) {
    return state.templateCategories.find(element => element.id === id)
  }
}

const mutations = {
  setTemplateCategories (state, TemplateCategories) {
    state.templateCategories = TemplateCategories
  },

  putTemplateCategory (state, TemplateCategory) {
    const id = state.templateCategories.findIndex((element) => {
      return element.id === TemplateCategory.id
    })
    if (id === -1) {
      state.templateCategories.push(TemplateCategory)
    } else {
      state.templateCategories[id] = TemplateCategory
      state = { ...state }
    }
  },
  setTemplateStat (state, { idtemp, templateStat }) {
    const id = state.templateCategories.findIndex((element) => {
      return element.id === idtemp
    })
    state.templateCategories[id].templateStat = templateStat
  },

  removeTemplateCategory (state, id) {
    const index = state.templateCategories.findIndex(element => element.id === id)

    if (index !== -1) {
      state.templateCategories.splice(index, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllTemplateCategories (context) {
    await traverson.from('/api/v1/template-categories/')
      .json()
      .getResource().result
      .then((document) => {
        context.commit('setTemplateCategories', document.list)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },

  async fetchTemplateCategory (context, id) {
    const document = await traverson.from('/api/v1/template-categories/{idTemplate}')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putTemplateCategory', document)
  },

  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putTemplateCategory', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },

  async fetchTemplateCategoryForUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniver}/template-categories')
      .withTemplateParameters({ iduniver: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setTemplateCategories', document.list)
  },

  async fetchTemplateCategorywithTemplateStat (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniver}/template-categories')
      .withTemplateParameters({ iduniver: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    const result = await Promise.all(document.list.map((item) => {
      return traverson.from(item._links['template-stats'].href).json().getResource().result
    }))
    let iterator = 0
    context.commit('setTemplateCategories', document.list.map((item) => {
      item.stats = result[iterator]
      iterator++
      return item
    }))
  },

  async fetchStatForCategories (context, id) {
    const document = await traverson.from('/api/v1/template-categories/{idtemplate}/template-stats')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setTemplateStat', { templateStat: document.list, idtemp: id })
  },

  addTemplateCategory (context, template) {
    traverson.from('/api/v1/template-categories/')
      .json()
      .post(template).result
      .then((response) => {
        const result = JSON.parse(response.body)
        context.commit('putTemplateCategory', result)
        return result
      })
      .catch((err) => {
        throw err
      })
  },

  putTemplateCategory (context, { template, id }) {
    // eslint-disable-next-line no-console
    traverson.from('/api/v1/template-categories/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .put(template).result
      .then((response) => {
        const result = JSON.parse(response.body)
        context.commit('putTemplateCategory', result)
      })
      .catch((err) => {
        throw err
      })
  },

  async deleteTemplateCategory (context, id) {
    const document = await traverson.from('/api/v1/template-categories/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeTemplateCategory', id)
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
