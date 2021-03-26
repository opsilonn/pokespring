import axios from 'axios'
import config from '../config'

/** @param {String} path */
function api (path) {
  return config.API_URL + '/account' + path
}

const DEFAULT_ACCOUNT = {
  id: -1,
  username: '',
  email: '',
  teams: []
}

export const state = () => ({
  accounts: [DEFAULT_ACCOUNT]
})

export const getters = {
  getAccounts: stateAccounts => function () {
    return stateAccounts.accounts
  },
  getAccountById: stateAccounts => (id) => {
    return stateAccounts.accounts.find(_ => _.id === id) || DEFAULT_ACCOUNT
  },
  getAccountByUsername: stateAccounts => (username) => {
    return stateAccounts.accounts.find(_ => _.username === username) || DEFAULT_ACCOUNT
  }
}

export const actions = {
  /**
   * Fetch an Account given its Id
   * @param commit
   * @param {String} id
   * @return {Promise<void>}
   */
  async fetchAccountById ({ commit }, { id }) {
    const { data } = await axios.get(api('/' + id))

    // UPDATE the list of accounts with new information
    commit('updateStateAccount', data)
  },


  /**
   * Fetch an Account given its username
   * @param commit
   * @param {String} username
   * @return {Promise<void>}
   */
  async fetchAccountByUsername ({ commit }, { username }) {
    const { data } = await axios.get(api('/username/' + username))

    // UPDATE the list of accounts with new information
    commit('updateStateAccount', data)
  },


  /**
   * Fetch an Account given its username
   * @param commit
   * @param {String} username Username we are searching for
   * @return {Promise<void>}
   */
  async searchAccountsByUsername ({ commit }, { username }) {
    const { data } = await axios.get(api('/username/search/' + username))

    // UPDATE the list of accounts with new information
    commit('updateStateAccounts', data)
  },

  /**
   * Modifies an account
   * @param commit
   * @param {Number} id
   * @param {String} username
   * @param {String} email
   * @param {String} password
   * @return {Promise<{err}>}
   */
  async modifyAccount ({ commit }, { id, username, email, password }) {
    /*
    try {
      const { data } = await axios.put(api('/' + idUser + '/admin'), {
        nameFirst,
        nameLast,
        email,
        role: {
          idrole: idRole
        }
      })
      commit('updateStateUser', data)
      return { err: false }
    } catch (err) {
      return { err: true, message: 'an error occured' }
    }
    */
  },

  /**
   * Delete an Account from the app
   * @param {Number} id
   * @return {Promise<{err}>}
   */
  async deleteAccount ({ commit }, { id }) {
    try {
      await axios.delete(api('/' + id))
      commit('deleteFromStateAccounts', id)
      return { err: false }
    } catch (err) {
      return { err: true, message: 'an error occured' }
    }
  }
}

export const mutations = {
  // Adds several accounts
  updateStateAccounts (stateAccounts, accounts) {
    // clear the state
    stateAccounts.accounts = []

    // add each new account
    accounts.forEach(account => mutations.updateStateAccount(stateAccounts, account))
  },

  // Adds one account
  updateStateAccount (stateAccounts, account) {
    // check if the account already exists
    const existing = stateAccounts.accounts.findIndex(_ => _.id === account.id)

    // If it doesn't exist, we add it ; if it does, we update it
    if (existing === -1) {
      stateAccounts.accounts.push(account)
    } else {
      stateAccounts.accounts[existing] = account
      stateAccounts.accounts = [...stateAccounts.accounts]
    }
  },

  // Remove an account from the state
  deleteFromStateAccounts (stateAccounts, id) {
    const index = stateAccounts.accounts.findIndex(_ => _.id === id)
    stateAccounts.accounts.splice(index, 1)
  }
}
