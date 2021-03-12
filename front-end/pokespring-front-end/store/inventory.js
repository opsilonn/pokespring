const traverson = require('traverson-promise')

const state = () => ({
  inventories: []
})

const getters = {
  getInventories: state => function () {
    return state.inventories
  },
  getInventory: state => function (id) {
    return state.inventories.find(element => element.id === id)
  }
}

const mutations = {
  setInventories (state, Inventories) {
    state.inventories = Inventories
  },
  putInventory (state, Inventory) {
    const id = state.inventories.findIndex((element) => {
      return element.id === Inventory.id
    })
    if (id === -1) {
      state.inventories.push(Inventory)
    } else {
      state.inventories[id] = Inventory
      state = { ...state }
    }
  },
  removeInventory (state, Inventoryid) {
    const id = state.inventories.findIndex((element) => {
      return element.id === Inventoryid
    })
    if (id !== -1) {
      state.inventories.splice(id, 1)
      state = { ...state }
    }
  }
}

const actions = {
  async fetchAllInventories (context) {
    await traverson.from('/api/v1/inventories/')
      .json()
      .getResource().result
      .then((document) => {
        context.commit('setInventories', document.list)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchInventory (context, id) {
    const document = await traverson.from('/api/v1/inventories/{idTemplate}')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('putInventory', document)
  },
  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putInventory', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchInventoryForCharacter (context, id) {
    const document = await traverson.from('/api/v1/characters/{idcharacter}/inventories')
      .withTemplateParameters({ idcharacter: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setInventories', document.list)
  },
  async addInventory (context, template) {
    const response = await traverson.from('/api/v1/inventories/')
      .json()
      .post(template).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putInventory', result)
    return result
  },
  async putInventory (context, { inventory, id }) {
    const response = await traverson.from('/api/v1/inventories/{idIventory}')
      .withTemplateParameters({ idIventory: id })
      .json()
      .put(inventory).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putInventory', result)
    return result
  },
  async deleteInventory (context, id) {
    const document = await traverson.from('/api/v1/inventories/{idtemplate}')
      .withTemplateParameters({ idtemplate: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeInventory', id)
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
