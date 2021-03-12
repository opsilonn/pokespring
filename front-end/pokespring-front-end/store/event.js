const traverson = require('traverson-promise')

const state = () => ({
  events: []
})

const getters = {
  getEvents: state => function () {
    return state.events
  },
  getEvent: state => function (id) {
    return state.events.find(element => element.id === id)
  }
}

const mutations = {
  setEvents (state, Events) {
    state.events = Events
  },
  putEvent (state, Event) {
    const id = state.events.findIndex((element) => {
      return element.id === Event.id
    })
    if (id === -1) {
      state.events.push(Event)
    } else {
      state.events[id] = Event
      state = { ...state }
    }
  },
  removeEvent (state, idEvent) {
    const id = state.events.findIndex((element) => {
      return element.id === idEvent
    })
    if (id !== -1) {
      state.events.splice(id, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllEvents (context) {
    await traverson.from('/api/v1/events/')
      .json()
      .getResource().result
      .then((document) => {
        context.commit('setEvents', document.list)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchEvent (context, id) {
    const document = await traverson.from('/api/v1/events/{idTemplate}')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putEvent', document)
  },
  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putEvent', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchEventForTimeline (context, id) {
    const document = await traverson.from('/api/v1/timelines/{idtimeline}/events')
      .withTemplateParameters({ idtimeline: id })
      .json()
      .getResource().result
      .catch((err) => { throw err })
    context.commit('setEvents', document.list)
  },
  async addEvent (context, template) {
    const response = await traverson.from('/api/v1/events/')
      .json()
      .post(template).result
      .catch((err) => { throw err })
    const result = JSON.parse(response.body)
    context.commit('putEvent', result)
    return result
  },
  async putEvent (context, { event, id }) {
    const response = await traverson.from('/api/v1/events/{idEvent}')
      .withTemplateParameters({ idEvent: id })
      .json()
      .put(event).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putEvent', result)
    return result
  },
  async deleteEvent (context, id) {
    const document = await traverson.from('/api/v1/events/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .delete().result
      .catch((err) => { throw err })
    if (document.ok === true) {
      context.commit('removeEvent', id)
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
