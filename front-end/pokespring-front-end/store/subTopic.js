const traverson = require('traverson-promise')

const state = () => ({
  subTopics: []
})

const getters = {
  getSubTopicById: state => function (id) {
    return state.subTopics.find(element => element.id === id)
  },

  getSubTopicsByTopic: state => function (id) {
    return state.subTopics.filter(element => element.idTopic === id)
  }
}

const mutations = {
  addSubTopic (state, { subTopic }) {
    const existing = state.subTopics.findIndex(e => e.id === subTopic.id)
    if (existing !== -1) {
      state.subTopics[existing] = subTopic
      state.subTopics = [...state.subTopics]
    } else {
      state.subTopics.push(subTopic)
    }
  },

  deleteSubTopic (state, { idSubTopic }) {
    const existing = state.subTopics.findIndex(e => e.id === idSubTopic)
    if (existing !== -1) {
      state.subTopics.splice(existing, 1)
    }
  }
}

const actions = {
  async fetchAllSubTopics (context) {
    const document = await traverson.from('/api/v1/sub-topics')
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addSubTopic', { subTopic: _ }))
  },

  async fetchSubTopic (context, { idSubTopic }) {
    const document = await traverson.from('/api/v1/sub-topics/{idSubTopic}')
      .withTemplateParameters({ idSubTopic })
      .json()
      .getResource().result

    context.commit('addSubTopic', { subTopic: document })
  },

  async fetchByUrl (context, { url }) {
    const document = await traverson.from(url)
      .json()
      .getResource().result

    context.commit('addSubTopic', { subTopic: document })
  },

  async fetchSubTopicsForTopic (context, { idTopic }) {
    const document = await traverson.from('/api/v1/topics/{idTopic}/sub-topics')
      .withTemplateParameters({ idTopic })
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addSubTopic', { subTopic: _ }))
  },

  async createSubTopic (context, { subTopic }) {
    const response = await traverson.from('/api/v1/sub-topics')
      .json()
      .post(subTopic).result

    if (response.status !== 201) { throw JSON.parse(response.text) }

    const result = JSON.parse(response.body)
    context.commit('addSubTopic', { subTopic: result })
    return result
  },

  async updateSubTopic (context, { subTopic }) {
    const response = await traverson.from('/api/v1/sub-topics/{idSubTopic}')
      .withTemplateParameters({ idSubTopic: subTopic.id })
      .json()
      .put(subTopic).result

    if (response.status !== 200) { throw JSON.parse(response.text) }

    const result = JSON.parse(response.body)
    context.commit('addSubTopic', { subTopic: result })
  },

  async removeSubTopic (context, { idSubTopic }) {
    const document = await traverson.from('/api/v1/sub-topics/{idSubTopic}')
      .withTemplateParameters({ idSubTopic })
      .json()
      .delete().result

    if (document.ok) {
      context.commit('deleteSubTopic', { idSubTopic })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
