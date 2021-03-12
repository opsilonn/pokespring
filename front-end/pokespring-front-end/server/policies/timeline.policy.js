import mariadb from '../services/mariadb.services.js'

class TimelinePolicy {
  /**
   * @param { Number } idTimeline
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idTimeline) {
    return (await mariadb.client.query('SELECT universe_idUniverse FROM timeline WHERE idTimeline = ?', idTimeline))[0].universe_idUniverse
  }
}

export default TimelinePolicy
