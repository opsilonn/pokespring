import axios from 'axios'
import Cookies from 'js-cookie'
import config from '../config'

/** @param {String} path */
function api (path) {
    return config.API_URL + '/account' + path
}

export const state = () => ({})

export const getters = {
    idUser: () => parseInt(Cookies.get('id')) || -1,
    isLogged: () => Cookies.get('id') !== undefined || false,
    username: () => Cookies.get('username') || ''
}

export const actions = {
    /**
     * Register the user with the credentials given
     * @param commit
     * @param {String} username
     * @param {String} email
     * @param {String} password
     * @return {Promise<{err}>}
     */
    async signup ({ commit }, { username, email, password }) {
        try {
            const { data } = await axios.post(api(''), { username, email, password })
            console.log(data)
            commit('loginUser', data)
        } catch (err) {
            return { err: true, message: 'not registered' }
        }

        return { err: false }
    },

    /**
     * Log in the user with the credentials given
     * @param commit
     * @param {String} username
     * @param {String} password
     * @returns {Promise<{err}>}
     */
    async login ({ commit }, { username, password }) {
        try {
            const { data } = await axios.post(api('/login'), { username, password })
            commit('loginUser', data)
        } catch (err) {
            return { err: true, message: 'not logged in' }
        }
        return { err: false }
    },

    /**
     * Log out the user
     * @param commit
     * @returns {Promise<void>}
     */
    logout ({ commit }) {
        commit('logoutUser')
    }
}

export const mutations = {
    /**
     * Store in the state the information of the logged in user
     * @param stateUser
     * @param {Number} idUser
     * @param {String} nameFirst
     * @param {String} nameLast
     * @param {String} email
     * @constructor
     */
    loginUser (stateUser, { id, username }) {
        // We set the cookie for the authentificated status
        Cookies.set('id', id)
        Cookies.set('username', username)
    },

    /**
     * Take out the information regarding the user from the store
     * @param stateUser
     * @constructor
     */
    logoutUser (stateUser) {
        // We erase all the cookies
        Cookies.remove('id')
        Cookies.remove('username')
    }
}