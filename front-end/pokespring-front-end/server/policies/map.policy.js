import mariadb from '../services/mariadb.services.js'

class MapPolicy {
  /**
   * @param { Number } idMap
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idMap) {
    return (await mariadb.client.query('SELECT universe_idUniverse FROM map WHERE idMap = ?', idMap))[0].universe_idUniverse
  }
}

export default MapPolicy
