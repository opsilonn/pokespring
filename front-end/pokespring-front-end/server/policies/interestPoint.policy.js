import mariadb from '../services/mariadb.services.js'

class InterestPointPolicy {
  /**
   * @param { Number } idInterestPoint
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idInterestPoint) {
    return (await mariadb.client.query(`
      SELECT m.universe_idUniverse FROM interestpoint it
      INNER JOIN map m
        ON m.idMap = it.map_idMap
      WHERE idInterestPoint = ?
      `, idInterestPoint))[0].universe_idUniverse
  }
}

export default InterestPointPolicy
