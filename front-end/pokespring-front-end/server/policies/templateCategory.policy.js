import mariadb from '../services/mariadb.services.js'

class TemplateCategoryPolicy {
  /**
   * @param { Number } idTemplateCategory
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idTemplateCategory) {
    if (isNaN(idTemplateCategory)) { throw new TypeError('No TemplateCategory specified !') }

    const result = await mariadb.client.query('SELECT universe_idUniverse FROM templatecategory WHERE idTemplateCategory = ?', idTemplateCategory)

    if (result.length === 0) { throw new Error('TemplateCategory undefined !') }
    return result[0].universe_idUniverse
  }
}

export default TemplateCategoryPolicy
