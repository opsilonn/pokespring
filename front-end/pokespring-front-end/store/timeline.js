const traverson = require('traverson-promise')

const state = () => ({
  timelines: []
})

const getters = {
  getTimelines: state => function () {
    return state.timelines
  },
  getTimelineByid: state => function (id) {
    return state.timelines.find(element => element.id === id)
  }
}

const mutations = {
  setTimelines (state, Timelines) {
    state.timelines = Timelines
  },
  putTimeline (state, Timeline) {
    const id = state.timelines.findIndex((element) => {
      return element.id === Timeline.id
    })
    if (id === -1) {
      state.timelines.push(Timeline)
    } else {
      state.timelines[id] = Timeline
      state = { ...state }
    }
  },
  setEvents (state, { events, idevent }) {
    const id = state.timelines.findIndex((element) => {
      return element.id === idevent
    })
    state.timelines[id].events = events
  },
  removeTimeline (state, id) {
    const index = state.timelines.findIndex((element) => {
      return element.id === id
    })
    if (index !== -1) {
      state.timelines.splice(index, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllTimelines (context) {
    await traverson.from('/api/v1/timelines/')
      .json()
      .getResource().result
      .then((document) => {
        // eslint-disable-next-line no-console
        console.log(document)
        context.commit('setTimelines', document.list)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchTimeline (context, id) {
    const document = await traverson.from('/api/v1/timelines/{idTemplate}/')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putTimeline', document)
  },
  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putTimeline', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchTimelinesForUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniver}/timelines')
      .withTemplateParameters({ iduniver: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setTimelines', document.list)
  },
  async fetchTimelineWithEvent (context, id) {
    const values = await Promise.all([
      traverson.from('/api/v1/timelines/{idTimeline}/')
        .withTemplateParameters({ idTimeline: id })
        .json()
        .getResource().result,
      traverson.from('/api/v1/timelines/{idTimeline}/')
        .follow('$._links.events.href')
        .withTemplateParameters({ idTimeline: id })
        .json()
        .getResource().result
    ])
      .catch((err) => { throw err })
    const timeline = values[0]
    timeline.events = values[1]
    context.commit('putTimeline', timeline)
  },
  async setEventForTimeline (context, id) {
    const document = await traverson.from('/api/v1/timelines/{idtimeline}/events')
      .withTemplateParameters({ idtimeline: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setEvent', { events: document.list, idevent: id })
  },
  async addTimeline (context, timeline) {
    const response = await traverson.from('/api/v1/timelines/')
      .json()
      .post(timeline).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putTimeline', result)
    return result
  },
  async putTimeline (context, { timeline, id }) {
    const response = await traverson.from('/api/v1/timelines/{idtimeline}')
      .withTemplateParameters({ idtimeline: id })
      .json()
      .put(timeline).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putTimeline', result)
    return result
  },
  async deleteTimeline (context, id) {
    const document = await traverson.from('/api/v1/timelines/{idtimeline}')
      .withTemplateParameters({ idtimeline: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeTimeline', id)
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
