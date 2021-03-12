const traverson = require('traverson-promise')

const state = () => ({
  usersInvite: []
})

const getters = {
  getUserInvite: state => function () {
    return state.usersInvite
  },
  getUserInviteById: state => function (id) {
    return state.usersInvite.find(element => element.id === id)
  }
}

const mutations = {
  setInvites (state, invites) {
    state.usersInvite = invites
  },
  putInvite (state, invite) {
    const id = state.usersInvite.findIndex((element) => {
      return element.id === invite.id
    })
    if (id === -1) {
      state.usersInvite.push(invite)
    } else {
      state.usersInvite[id] = invite
      state = { ...state }
    }
  },
  removeInvite (state, inviteid) {
    const id = state.usersInvite.findIndex((element) => {
      return element.id === inviteid
    })
    if (id !== -1) {
      state.usersInvite.splice(id, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchInvitesForUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniv}/users-playing')
      .withTemplateParameters({ iduniv: id })
      .json()
      .getResource().result
      .catch((err) => { throw err })
    context.commit('setInvites', document.list)
    return document
  },
  async addInviteInUniverse (context, { id, invite }) {
    const document = await traverson.from('/api/v1/universes/{iduniv}/users-playing')
      .withTemplateParameters({ iduniv: id })
      .json()
      .post(invite).result
      .catch((err) => { throw (err) })
    if (document === 1) {
      const user = await traverson.from('/api/v1/users/{idus}/')
        .withTemplateParameters({ idus: invite.idUser })
        .json()
        .getResource().result
        .catch((err) => { throw err })
      context.commit('putInvite', user)
    }
  },
  async putInviteInUniverse (context, { id, invite }) {
    const document = await traverson.from('/api/v1/universes/{iduniv}/users-playing')
      .withTemplateParameters({ iduniv: id })
      .json()
      .put(invite).result
      .catch((err) => { throw (err) })
    if (document === true) {
      const user = await traverson.from('/api/v1/users/{idus}/')
        .withTemplateParameters({ idus: invite.idUser })
        .json()
        .getResource.result
        .catch((err) => { throw err })
      context.commit('putInvite', user)
    }
  },
  async deleteInviteInUniverse (context, { idUniverse, idUser }) {
    const document = await traverson.from('/api/v1/universes/{idUniverse}/users-playing/{idUser}')
      .withTemplateParameters({ idUniverse, idUser })
      .json()
      .delete().result
      .catch((err) => { throw (err) })
    if (document.ok === true) {
      context.commit('removeInvite', idUser)
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
