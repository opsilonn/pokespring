const traverson = require('traverson-promise')

const state = () => ({
  universes: [],
  currentUniverse: -1
})

const getters = {
  getUniverses: state => function () {
    return state.universes
  },
  getUniverse: state => function (id) {
    return state.universes.find(element => element.id === id)
  },
  getCurrentUniverse: state => function () {
    return state.currentUniverse
  }
}

const mutations = {
  setUniverses (state, universes) {
    state.universes = universes
  },
  putUniverse (state, universe) {
    const index = state.universes.findIndex((element) => {
      return element.id === universe.id
    })
    if (index === -1) {
      state.universes.push(universe)
    } else {
      state.universes[index] = universe
      state = { ...state }
    }
  },
  changeCurrentUniverse (state, id) {
    state.currentUniverse = id
  },
  removeUniverse (state, id) {
    const index = state.universes.findIndex((element) => {
      return element.id === id
    })
    if (id !== -1) {
      state.universes.splice(index, 1)
      state = { ...state }
    }
  }

}

const actions = {
  async fetchAllUniverses (context) {
    const document = await traverson.from('/api/v1/universes/')
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setUniverses', document.list)
  },
  async fetchUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{idUniverse}')
      .withTemplateParameters({ idUniverse: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putUniverse', document)
    context.commit('changeCurrentUniverse', id)
  },
  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putUniverse', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async addUniverse (context, universe) {
    const response = await traverson.from('/api/v1/universes/')
      .json()
      .post(universe).result
      .catch((err) => { throw err })
    const result = JSON.parse(response.body)
    context.commit('putUniverse', result)
    return result
  },
  async putUniverse (context, { universe, id }) {
    const response = await traverson.from('/api/v1/universes/{iduniverse}')
      .withTemplateParameters({ iduniverse: id })
      .json()
      .put(universe).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putUniverse', result)
    return result
  },
  async deleteUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniverse}')
      .withTemplateParameters({ iduniverse: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeUniverse', id)
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
