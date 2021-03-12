import mariadb from '../services/mariadb.services.js'

class CharacterPolicy {
  /**
   * @param { Number } idCharacter
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idCharacter) {
    return (await mariadb.client.query('SELECT universe_idUniverse FROM `character` WHERE idCharacter = ?', idCharacter))[0].universe_idUniverse
  }

  /**
   * @param { Number } idCharacter
   * @returns { Promise<Boolean> }
   */
  static async getUserId (idCharacter) {
    return (await mariadb.client.query('SELECT user_idUser FROM `character` WHERE idCharacter = ?', idCharacter))[0].user_idUser
  }

  /**
   * @param { Number } idUser
   * @param { Number } idCharacter
   * @param { { id: Number, value: String|Number }[] } stats
   * @returns { Promise<Boolean> }
   */
  static async verifyStats (idUser, idCharacter, stats) {
    if (!stats.length) { return true }

    // We verify that all the categories of the inputs are from the same universe of the character
    /** @type [] */
    const templateStats = await mariadb.client.query(`
      SELECT ts.idTemplateStat FROM templatestat ts
      INNER JOIN templatecategory tc
        ON tc.idTemplateCategory = ts.templateCategory_idTemplateCategory
      INNER JOIN universe u
        ON u.idUniverse = tc.universe_idUniverse
      INNER JOIN \`character\` c
        ON c.universe_idUniverse = u.idUniverse
      WHERE c.idCharacter = ?
    `, idCharacter)

    try {
      stats.forEach((stat) => {
        let bValideStat = false
        const Break = class {}
        try {
          templateStats.forEach((_) => {
            if (_.idTemplateStat === stat.id) {
              bValideStat = true
              throw Break
            }
          })
        } catch { }
        if (bValideStat === false) { throw Error }
      })
      return true
    } catch {
      return false
    }
  }
}

export default CharacterPolicy
