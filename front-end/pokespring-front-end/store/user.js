const traverson = require('traverson-promise')

const state = () => ({
  users: [{
    id: -1,
    username: ''
  }]
})

const getters = {
  getUsers: state => function () {
    return state.users
  },
  getUser: state => function (id) {
    return state.users.find(element => element.id === id) || { id: -1, username: '' }
  }
}

const mutations = {
  setUsers (state, users) {
    state.users = users
  },

  putUser (state, user) {
    const index = state.users.findIndex((element) => {
      return element.id === user.id
    })

    if (index === -1) {
      state.users.push(user)
    } else {
      state.users[index] = user
      // state = { ...state }
      state.users = [...state.users]
    }
  },

  removeUser (state, id) {
    const index = state.users.findIndex((element) => {
      return element.id === id
    })
    if (index !== -1) {
      state.users.splice(index, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllUsers (context) {
    const document = await traverson.from('/api/v1/users/')
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setUsers', document.list)
  },

  async fetchUser (context, id) {
    const document = await traverson.from('/api/v1/users/{idUser}')
      .withTemplateParameters({ idUser: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })

    context.commit('putUser', document)
  },

  async fetchPlayersOfUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{idUniverse}/users-playing')
      .withTemplateParameters({ idUniverse: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setUsers', document.list)
  },

  async addUser (context, user) {
    const response = await traverson.from('/api/v1/users/')
      .json()
      .post(user).result
    context.commit('putUser', response)
    return response
  },

  async putUser (context, { user, id }) {
    const response = await traverson.from('/api/v1/users/{userid}')
      .withTemplateParameters({ userid: id })
      .json()
      .put(user).result

    const result = JSON.parse(response.body)

    context.commit('putUser', result)

    return result
  },

  async deleteUser (context, id) {
    const document = await traverson.from('/api/v1/users/{userid}')
      .withTemplateParameters({ userid: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeUser', id)
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
