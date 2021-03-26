import axios from 'axios'
import config from '../config'

/** @param {String} path */
function api (path) {
  return config.API_URL + '/team' + path
}

const DEFAULT_TEAM = {
  id: -1,
  name: '',
  members: [],
  account: {
    id: -1,
    username: ''
  }
}

export const state = () => ({
  teams: [DEFAULT_TEAM]
})

export const getters = {
  getTeams: stateTeams => function () {
    return stateTeams.teams
  },
  getTeamById: stateTeams => (id) => {
    return stateTeams.teams.find(_ => _.id === id) || DEFAULT_TEAM
  }
}

export const actions = {
  /**
   * Fetch a Team given its Id
   * @param commit
   * @param {String} id
   * @return {Promise<void>}
   */
  async fetchTeamById ({ commit }, { id }) {
    const { data } = await axios.get(api('/' + id))

    // UPDATE the list of Teams with new information
    commit('updateStateTeam', data)
  },

  /**
   * Delete a Team from the app
   * @param {Number} id
   * @return {Promise<{err}>}
   */
  async deleteTeam ({ commit }, { id }) {
    try {
      await axios.delete(api('/' + id))
      commit('deleteFromStateTeams', id)
      return { err: false }
    } catch (err) {
      return { err: true, message: 'an error occured' }
    }
  }
}

export const mutations = {
  // Adds several teams
  updatestateTeams (stateTeams, teams) {
    // clear the state
    stateTeams.teams = []

    // add each new team
    teams.forEach(team => mutations.updateStateTeam(stateTeams, team))
  },

  // Adds one team
  updateStateTeam (stateTeams, team) {
    // check if the team already exists
    const existing = stateTeams.teams.findIndex(_ => _.id === team.id)

    // If it doesn't exist, we add it ; if it does, we update it
    if (existing === -1) {
      stateTeams.teams.push(team)
    } else {
      stateTeams.teams[existing] = team
      stateTeams.teams = [...stateTeams.teams]
    }
  },

  // Remove an account from the state
  deleteFromstateTeams (stateTeams, id) {
    const index = stateTeams.teams.findIndex(_ => _.id === id)
    stateTeams.teams.splice(index, 1)
  }
}
