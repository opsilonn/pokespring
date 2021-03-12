import mariadb from '../services/mariadb.services.js'

class UniversePolicy {
  /**
   * @param { Number } idUser
   * @param { Number } idUniverse
   * @returns { Promise<Boolean> }
   */
  static async canGet (idUser, idUniverse) {
    if (isNaN(idUniverse)) { return false }

    const sql = `
      SELECT u.bIsPublic, uiu.bIsGM FROM universe u
      LEFT JOIN (
        SELECT * FROM userinuniverse
        WHERE idUniverse = ? AND idUser = ?
      ) AS uiu ON uiu.idUniverse = u.idUniverse 
      WHERE u.idUniverse = ?
    `
    const param = [idUniverse, idUser || 0, idUniverse]
    const result = (await mariadb.client.query(sql, param))[0]

    if (!result) { return false }
    if (result.bIsPublic) { return true }
    return result.bIsGM !== null
  }

  /**
   * @param { Number } idUser
   * @param { Number } idUniverse
   * @returns { Promise<Boolean> }
   */
  static async canEdit (idUser, idUniverse) {
    if (isNaN(idUniverse)) { return false }

    const sql = `
      SELECT uiu.bIsGM FROM universe u
      LEFT JOIN (
        SELECT * FROM userinuniverse
        WHERE idUniverse = ? AND idUser = ?
        ) AS uiu ON uiu.idUniverse = u.idUniverse 
      WHERE u.idUniverse = ?
    `
    const param = [idUniverse, idUser, idUniverse]
    const result = (await mariadb.client.query(sql, param))[0]

    if (!result) { return false }
    return result.bIsGM === 1
  }

  /**
   * @param { Number } idUser
   * @param { Number } idUniverse
   * @returns { Promise<Boolean> }
   */
  static async isOwner (idUser, idUniverse) {
    const sql = `
      SELECT 1 FROM universe
      WHERE idUniverse = ? AND user_idUser = ?
    `
    const param = [idUniverse, idUser]
    const result = (await mariadb.client.query(sql, param))[0]

    return !!result
  }
}

export default UniversePolicy
