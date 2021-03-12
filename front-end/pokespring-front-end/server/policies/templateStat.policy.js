import mariadb from '../services/mariadb.services.js'

class TemplateStatPolicy {
  /**
   * @param { Number } idTemplateStat
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idTemplateStat) {
    return (await mariadb.client.query(`
      SELECT tc.universe_idUniverse FROM templatestat ts
      INNER JOIN templatecategory tc
        ON tc.idTemplateCategory = ts.templateCategory_idTemplateCategory
      WHERE idTemplateStat = ?
      `, idTemplateStat))[0].universe_idUniverse
  }
}

export default TemplateStatPolicy
