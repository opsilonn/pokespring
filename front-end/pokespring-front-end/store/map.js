const traverson = require('traverson-promise')

const state = () => ({
  maps: []
})

const getters = {
  getMapById: state => function (id) {
    return state.maps.find(element => element.id === id)
  },

  getMapByUniverse: state => function (id) {
    return state.maps.filter(element => element.idUniverse === id)
  }
}

const mutations = {
  addMap (state, { map }) {
    map.uuid = new Date().getTime()
    const existing = state.maps.findIndex(e => e.id === map.id)
    if (existing !== -1) {
      state.maps[existing] = map
      state.maps = [...state.maps]
    } else {
      state.maps.push(map)
    }
  },

  updateUuid (state, { idMap }) {
    const existing = state.maps.findIndex(e => e.id === idMap)
    if (existing !== -1) {
      state.maps[existing].uuid = new Date().getTime()
      state.maps = [...state.maps]
    }
  },

  deleteMap (state, { idMap }) {
    const existing = state.maps.findIndex(e => e.id === idMap)
    if (existing !== -1) {
      state.maps.splice(existing, 1)
    }
  }
}

const actions = {
  async fetchAllMaps (context) {
    const document = await traverson.from('/api/v1/maps')
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addMap', { map: _ }))
  },

  async fetchMap (context, { idMap }) {
    const document = await traverson.from('/api/v1/maps/{idMap}')
      .withTemplateParameters({ idMap })
      .json()
      .getResource().result
    context.commit('addMap', { map: document })
  },

  async fetchByUrl (context, { url }) {
    const document = await traverson.from(url)
      .json()
      .getResource().result

    context.commit('addMap', { map: document })
  },

  async fetchMapsForUniverse (context, { idUniverse }) {
    const document = await traverson.from('/api/v1/universes/{idUniverse}/maps')
      .withTemplateParameters({ idUniverse })
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addMap', { map: _ }))
  },

  async createMap (context, { map }) {
    const response = await traverson.from('/api/v1/maps')
      .json()
      .post(map).result

    if (response.status !== 201) { throw JSON.parse(response.text) }

    const result = JSON.parse(response.body)
    context.commit('addMap', { map: result })
    return result
  },

  async updateMap (context, { map }) {
    const response = await traverson.from('/api/v1/maps/{idMap}')
      .withTemplateParameters({ idMap: map.id })
      .json()
      .put(map).result

    if (response.status !== 200) { throw JSON.parse(response.text) }

    const result = JSON.parse(response.body)
    context.commit('addMap', { map: result })
  },

  async removeMap (context, { idMap }) {
    const document = await traverson.from('/api/v1/maps/{idMap}')
      .withTemplateParameters({ idMap })
      .json()
      .delete().result

    if (document.ok) {
      context.commit('deleteMap', { idMap })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
