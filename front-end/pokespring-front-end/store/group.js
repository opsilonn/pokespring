const traverson = require('traverson-promise')

const state = () => ({
  groups: []
})

const getters = {
  getGroups: state => function () {
    return state.groups
  },
  getGroup: state => function (id) {
    return state.groups.find(element => element.id === id)
  }
}

const mutations = {
  setGroups (state, Groups) {
    state.groups = Groups
  },
  putGroup (state, group) {
    const id = state.groups.findIndex((element) => {
      return element.id === group.id
    })
    if (id === -1) {
      state.groups.push(group)
    } else {
      state.groups[id] = group
      state.groups = { ...state.groups }
    }
  },
  removeGroup (state, groupid) {
    const id = state.groups.findIndex((element) => {
      return element.id === groupid
    })
    if (id !== -1) {
      state.groups.splice(id, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllGroups (context) {
    const document = await traverson.from('/api/v1/groups/')
      .json()
      .getResource().result
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
    context.commit('setGroups', document.list)
  },
  async fetchGroup (context, id) {
    const document = await traverson.from('/api/v1/groups/{idTemplate}')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putGroup', document)
  },
  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putGroup', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchGroupForCharacter (context, id) {
    const document = await traverson.from('/api/v1/characters/{idcharacter}/groups')
      .withTemplateParameters({ idcharacter: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setGroups', document.list)
  },
  async fetchGroupForUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniverse}/groups')
      .withTemplateParameters({ iduniverse: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setGroups', document.list)
  },
  async addGroup (context, template) {
    const response = await traverson.from('/api/v1/groups/')
      .json()
      .post(template).result
      .catch((err) => { throw err })
    const result = JSON.parse(response.body)
    context.commit('putGroup', result)
    return result
  },
  async putGroup (context, { group, id }) {
    const response = await traverson.from('/api/v1/groups/{idgroup}')
      .withTemplateParameters({ idgroup: id })
      .json()
      .put(group).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putGroup', result)
    return result
  },
  async deleteGroup (context, id) {
    const document = await traverson.from('/api/v1/groups/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeGroup', id)
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
