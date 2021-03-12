const traverson = require('traverson-promise')

const state = () => ({
  bIsConnected: false,
  connectedUser: {
    id: -1,
    username: '',
    universesOwns: [],
    universesPlays: [],
    uuid: 0
  },
  authentificationStatus: ''
})

const getters = {
}

const mutations = {
  AUTH_REQUEST (state) {
    state.authentificationStatus = 'loading'
  },
  AUTH_SUCCESS (state, { id, username, universesOwns, universesPlays }) {
    state.authentificationStatus = 'success'
    state.bIsConnected = true
    state.connectedUser.id = id
    state.connectedUser.username = username
    state.connectedUser.universesOwns = universesOwns
    state.connectedUser.universesPlays = universesPlays
    state.connectedUser = { ...state.connectedUser }
  },
  AUTH_ERROR (state) {
    state.authentificationStatus = 'error'
    state.bIsConnected = false
    state.connectedUser.id = -1
    state.connectedUser.username = ''
    state.connectedUser.universesOwns = []
    state.connectedUser.universesPlays = []
    state.connectedUser = { ...state.connectedUser }
  },
  UNSET_USER (state) {
    state.bIsConnected = false
    state.connectedUser.id = -1
    state.connectedUser.username = ''
    state.connectedUser.universesOwns = []
    state.connectedUser.universesPlays = []
    state.connectedUser = { ...state.connectedUser }
  },
  updateUuid (state) {
    if (state.connectedUser.id !== -1) {
      state.connectedUser.uuid = new Date().getTime()
      state.connectedUser = { ...state.connectedUser }
    }
  }
}

const actions = {
  async fetchLoggedUser ({ commit }) {
    commit('AUTH_REQUEST')
    try {
      const document = await traverson.from('/api/v1/auth/me')
        .json()
        .get().result
      if (document.ok) {
        const result = JSON.parse(document.text)
        commit('AUTH_SUCCESS', result)
      } else {
        commit('AUTH_ERROR')
      }
    } catch (err) {
      commit('AUTH_ERROR')
    }
  },

  async login ({ commit }, { username, password }) {
    commit('AUTH_REQUEST')
    try {
      const document = await traverson.from('/api/v1/auth/login')
        .json()
        .post({ username, password }).result

      if (document.ok) {
        const result = JSON.parse(document.text)
        commit('AUTH_SUCCESS', result)
      } else {
        commit('AUTH_ERROR')
      }
    } catch {
      commit('AUTH_ERROR')
    }
  },

  async logout ({ commit }) {
    commit('AUTH_REQUEST')
    try {
      await traverson.from('/api/v1/auth/logout')
        .json()
        .post().result

      commit('UNSET_USER')
    } catch {
      commit('AUTH_ERROR')
    }
  }

  /*
  async fetchUniverseOwn (context) {
    const document = await traverson.from('/api/v1/users/{userid}')
      .withTemplateParameters({ userid: context.state.iduser })
      .follow('$._links.universes.href')
      .json()
      .getResource().result

    context.commit('setUniverses', document.universes)
  },
  async fetchUniversePlay (context) {
    const document = await traverson.from('/api/v1/users/{userid}')
      .withTemplateParameters({ userid: context.state.iduser })
      .follow('$._links.universesPlays.href')
      .json()
      .getResource().result

    context.commit('setUniversePlay', document.universes)
  }
  */
}

export default {
  state,
  getters,
  mutations,
  actions
}
