const traverson = require('traverson-promise')

const state = () => ({
  characters: [
    {
      id: 0
    }
  ]
})

const getters = {
  getCharacters: state => function () {
    return state.characters
  },
  getCharacterByid: state => function (id) {
    return state.characters.find(element => element.id === id)
  }
}

const mutations = {
  setCharacters (state, Characters) {
    state.characters = Characters
  },
  setSheetStatus (state, { sheetStatus, idChar }) {
    const index = state.characters.findIndex((element) => {
      return element.id === idChar
    })
    state.characters[index].sheetStatus = sheetStatus
    state = { ...state }
  },
  setStat (state, { stats, idchar }) {
    const index = state.characters.findIndex((element) => {
      return element.id === idchar
    })
    state.characters[index].stats = stats
    state = { ...state }
  },
  putCharacter (state, character) {
    const index = state.characters.findIndex((element) => {
      return element.id === character.id
    })
    if (index === -1) {
      state.characters.push(character)
    } else {
      state.characters[index] = character
      state = { ...state }
    }
  },
  removeCharacter (state, idCharacter) {
    const index = state.characters.findIndex((element) => {
      return element.id === idCharacter
    })
    if (index !== -1) {
      state.characters.splice(idCharacter, 1)
      state = { ...state }
    }
  },
  updateUuid (state, idChar) {
    const existing = state.characters.findIndex(e => e.id === idChar)
    if (existing !== -1) {
      state.characters[existing].uuid = new Date().getTime()
      state.characters = [...state.characters]
    }
  }
}

const actions = {
  async fetchAllCharacters (context) {
    await traverson.from('/api/v1/characters/')
      .json()
      .getResource().result
      .then((document) => {
        // eslint-disable-next-line no-console
        context.commit('setCharacters', document.list)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchCharacter (context, id) {
    // eslint-disable-next-line
    await traverson.from('/api/v1/characters/{idTemplate}/')
      .withTemplateParameters({ idTemplate: id })
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putCharacter', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchByUrl (context, url) {
    await traverson.from(url)
      .json()
      .getResource().result
      .then((document) => {
        context.commit('putCharacter', document)
      })
      .catch((err) => {
        // eslint-disable-next-line
        console.log(err)
      })
  },
  async fetchCharactersForUniverse (context, id) {
    const document = await traverson.from('/api/v1/universes/{iduniver}/characters')
      .withTemplateParameters({ iduniver: id })
      .json()
      .getResource().result
      .catch((err) => { throw err })
    context.commit('setCharacters', document.list)
  },
  async fetchCharactersForUser (context, id) {
    const document = await traverson.from('/api/v1/users/{iduser}/characters')
      .withTemplateParameters({ iduser: id })
      .json()
      .getResource().result
      .catch((err) => { throw err })
    context.commit('setCharacters', document.list)
  },
  async fetchCharactersForGroup (context, id) {
    const document = await traverson.from('/api/v1/groups/{idgroup}/characters')
      .withTemplateParameters({ idgroup: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setCharacters', document.list)
  },
  async fetchCharacterWithStat (context, id) {
    const values = await Promise.all([
      traverson.from('/api/v1/characters/{idCharacter}/')
        .withTemplateParameters({ idCharacter: id })
        .json()
        .getResource().result,
      traverson.from('/api/v1/characters/{idCharacter}/')
        .follow('$._links.stats.href')
        .withTemplateParameters({ idCharacter: id })
        .json()
        .getResource().result
    ])
      .catch((err) => { throw (err) })
    const character = values[0]
    character.stats = values[1].categories
    context.commit('putCharacter', character)
  },
  async fetchStatsOfCharacter (context, id) {
    const document = await traverson.from('/api/v1/characters/{idCharacter}/stats')
      .withTemplateParameters({ idCharacter: id })
      .json()
      .getResource().result
      .catch((err) => { throw (err) })
    context.commit('setStat', { stats: document.categories, idchar: id })
  },
  async addCharacter (context, character) {
    const response = await traverson.from('/api/v1/characters/')
      .json()
      .post(character).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putCharacter', result)
    return result
  },
  async putCharacter (context, { character, id }) {
    const response = await traverson.from('/api/v1/characters/{idcharacter}')
      .withTemplateParameters({ idcharacter: id })
      .json()
      .put(character).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('putCharacter', result)
    return result
  },
  async putSheetStatusForCharacter (context, { id, sheetStatus }) {
    const response = await traverson.from('/api/v1/characters/{idcharacter}/status')
      .withTemplateParameters({ idcharacter: id })
      .json()
      .put({ sheetStatus }).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    if (result) {
      context.commit('setSheetStatus', { sheetStatus, idChar: id })
    }
    return result
  },
  async putStatForCharacter (context, { stats, id }) {
    const response = await traverson.from('/api/v1/characters/{idcharacter}/stats')
      .withTemplateParameters({ idcharacter: id })
      .json()
      .put(stats).result
      .catch((err) => {
        throw err
      })
    const result = JSON.parse(response.body)
    context.commit('setStat', { stats: result, idchar: id })
    return result
  },
  async putCharacterInGroup (context, { idgroup, idCharacter }) {
    return await traverson.from('/api/v1/characters/{idcharacter}/groups')
      .withTemplateParameters({ idcharacter: idCharacter })
      .json()
      .post({ idGroup: idgroup }).result
  },
  async deleteCharacter (context, id) {
    const document = await traverson.from('/api/v1/characters/{idcharacter}')
      .withTemplateParameters({ idcharacter: id })
      .json()
      .delete().result
    if (document.ok === true) {
      context.commit('removeCharacter', id)
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
