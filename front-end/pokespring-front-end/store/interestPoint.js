const traverson = require('traverson-promise')

const state = () => ({
  interestPoints: []
})

const getters = {
  getInterestPoint: state => function (id) {
    return state.interestPoints.find(element => element.id === id)
  },
  getInterestPointsByMap: state => function (idMap) {
    return state.interestPoints.filter(_ => _.idMap === idMap)
  }
}

const mutations = {
  addInterestPoint (state, { interestPoint }) {
    const existing = state.interestPoints.findIndex(e => e.id === interestPoint.id)
    if (existing !== -1) {
      state.interestPoints[existing] = interestPoint
      state.interestPoints = [...state.interestPoints]
    } else {
      state.interestPoints.push(interestPoint)
    }
  },

  deleteInterestPoint (state, { idInterestPoint }) {
    const existing = state.interestPoints.findIndex(e => e.id === idInterestPoint)
    if (existing !== -1) {
      state.interestPoints.splice(existing, 1)
    }
  }
}

const actions = {
  async fetchInterestPoints (context) {
    const document = await traverson.from('/api/v1/interest-points')
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addInterestPoint', { interestPoint: _ }))
  },

  async fetchInterestPoint (context, { idInterestPoint }) {
    const document = await traverson.from('/api/v1/interest-points/{idInterestPoint}')
      .withTemplateParameters({ idInterestPoint })
      .json()
      .getResource().result

    context.commit('addInterestPoint', { interestPoint: document })
  },

  async fetchByUrl (context, { url }) {
    const document = await traverson.from(url)
      .json()
      .getResource().result

    context.commit('addInterestPoint', { interestPoint: document })
  },

  async fetchInterestPointByMap (context, { idMap }) {
    const document = await traverson.from('/api/v1/maps/{idMap}/interest-points')
      .withTemplateParameters({ idMap })
      .json()
      .getResource().result

    document.list.forEach(_ => context.commit('addInterestPoint', { interestPoint: _ }))
  },

  async createInterestPoint (context, { interestPoint }) {
    const response = await traverson.from('/api/v1/interest-points/')
      .json()
      .post(interestPoint).result

    const result = JSON.parse(response.body)
    context.commit('addInterestPoint', { interestPoint: result })
    return result
  },
  async updateInterestPoint (context, { interestPoint }) {
    const response = await traverson.from('/api/v1/interest-points/{idInterestPoint}')
      .withTemplateParameters({ idInterestPoint: interestPoint.id })
      .json()
      .put(interestPoint).result

    const result = JSON.parse(response.body)
    context.commit('addInterestPoint', { interestPoint: result })
  },

  async removeInterestPoint (context, { idInterestPoint }) {
    await traverson.from('/api/v1/interest-points/{idInterestPoint}')
      .withTemplateParameters({ idInterestPoint })
      .json()
      .delete().result

    if (document.ok) {
      context.commit('removeInterestPoint', { idInterestPoint })
    }
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
