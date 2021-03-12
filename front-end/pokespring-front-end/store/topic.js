const traverson = require('traverson-promise')

const state = () => ({
  topics: []
})

const getters = {
  getTopicById: state => function (id) {
    return state.topics.find(element => element.id === id)
  },

  getTopicsByUniverse: state => function (id) {
    return state.topics.filter(element => element.idUniverse === id)
  }
}

const mutations = {
  addTopic (state, { topic }) {
    const existing = state.topics.findIndex(e => e.id === topic.id)
    if (existing !== -1) {
      state.topics[existing] = topic
      state.topics = [...state.topics]
    } else {
      state.topics.push(topic)
    }
  },

  deleteTopic (state, { idTopic }) {
    const existing = state.topics.findIndex(e => e.id === idTopic)
    if (existing !== -1) {
      state.topics.splice(existing, 1)
    }
  }
}

const actions = {
  async fetchAllTopics (context) {
    const document = await traverson.from('/api/v1/topics')
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addTopic', { topic: _ }))
  },

  async fetchTopic (context, { idTopic }) {
    const document = await traverson.from('/api/v1/topics/{idTopic}')
      .withTemplateParameters({ idTopic })
      .json()
      .getResource().result

    context.commit('addTopic', { topic: document })
  },

  async fetchByUrl (context, { url }) {
    const document = await traverson.from(url)
      .json()
      .getResource().result

    context.commit('addTopic', { topic: document })
  },

  async fetchTopicsForUniverse (context, { idUniverse }) {
    const document = await traverson.from('/api/v1/universes/{idUniverse}/topics')
      .withTemplateParameters({ idUniverse })
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addTopic', { topic: _ }))
  },

  async createTopic (context, { topic }) {
    const response = await traverson.from('/api/v1/topics')
      .json()
      .post(topic).result

    if (response.status !== 201) { throw JSON.parse(response.text) }

    const result = JSON.parse(response.body)
    context.commit('addTopic', { topic: result })
    return result
  },

  async updateTopic (context, { topic }) {
    const response = await traverson.from('/api/v1/topics/{idTopic}')
      .withTemplateParameters({ idTopic: topic.id })
      .json()
      .put(topic).result

    if (response.status !== 200) { throw JSON.parse(response.text) }

    const result = JSON.parse(response.body)
    context.commit('addTopic', { topic: result })
  },

  async removeTopic (context, { idTopic }) {
    const document = await traverson.from('/api/v1/topics/{idTopic}')
      .withTemplateParameters({ idTopic })
      .json()
      .delete().result

    if (document.ok) {
      context.commit('deleteTopic', { idTopic })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
