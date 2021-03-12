import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataTemplateStat extends HalResourceData {
  /** @type { String } */
  name
  /** @type { Boolean } */
  bIsNumber
  /** @type { Boolean } */
  bIsRequired
}

class HalToOneLinksTemplateStat extends HalToOneLinks {
  /** @type { Number } */
  templateCategory
}

export default class TemplateStat extends HalResource {
  /** @type { HalResourceDataTemplateStat } */
  data
  /** @type { HalToOneLinksTemplateStat } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = []

  /**
   * @param { TemplateStat } templateStat
   */
  constructor(templateStat) {
    super()

    this.id = templateStat.idTemplateStat || templateStat.id

    this.data = new HalResourceDataTemplateStat()
    this.data.name = templateStat.name || templateStat.name
    this.data.bIsNumber = (templateStat.bIsNumber !== undefined) ? !!templateStat.bIsNumber : templateStat.bIsNumber
    this.data.bIsRequired = (templateStat.bIsRequired !== undefined) ? !!templateStat.bIsRequired : templateStat.bIsRequired

    this.toOneLinks = new HalToOneLinksTemplateStat()
    this.toOneLinks.templateCategory = templateStat.templateCategory_idTemplateCategory || templateStat.toOneLinks.templateCategory
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'template-stats') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'template-stats', resourcePath = 'template-stats') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, TemplateStat)
  }

  /// GET

  // /**
  //  * @returns { Promise<TemplateStat[]> }
  //  */
  // static async getAll () {
  //   return await mariadb.client.query('SELECT * FROM templatestat')
  // }

  /**
   * @param { Number } id id of the templateStat
   * @returns { Promise<TemplateStat> }
   */
  static async get (id) {
    return new TemplateStat((await mariadb.client.query('SELECT * FROM templatestat WHERE idTemplateStat = ?', id))[0])
  }

  /**
   * @param { Number } id id of the templateCategory
   * @returns { Promise<TemplateStat[]> }
   */
  static async getByTemplateCategory (id) {
    return await mariadb.client.query('SELECT * FROM templatestat WHERE templateCategory_idTemplateCategory = ?', id)
  }

  /// POST

  /**
   * @param { { name: String, bIsNumber: Boolean, bIsRequired: Boolean?, idTemplateCategory: Number } } templateStat
   * @returns { Promise<TemplateStat> } the id of the new inserted templateStat
   */
  static async add (templateStat) {
    const sql = `
      INSERT INTO
        templatestat(name, bIsNumber, bIsRequired, templateCategory_idTemplateCategory) 
        VALUES(?, ?, ` + (templateStat.bIsRequired !== undefined ? '?' : 'DEFAULT(bIsRequired)') + `, ?)
      RETURNING *`
    // All the params we have to put to insert a new row in the table
    const params = [templateStat.name, templateStat.bIsNumber]
    if (templateStat.bIsRequired !== undefined) { params.push(templateStat.bIsRequired) }
    params.push(templateStat.idTemplateCategory)

    return new TemplateStat((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the templateStat
   * @param { { name: String, bIsNumber: Boolean, bIsRequired: Boolean } } templateStat
   * @returns { Promise<TemplateStat> } if the templateStat could have been updated
   */
  static async update (id, templateStat) {
    const sql = `
      INSERT INTO
        templatestat(idTemplateStat) VALUES(?)
      ON DUPLICATE KEY UPDATE
        name = ?, bIsNumber = ?, bIsRequired = ?
      RETURNING *`
    const params = [id, templateStat.name, templateStat.bIsNumber, templateStat.bIsRequired]

    return new TemplateStat((await mariadb.client.query(sql, params))[0])
  }

  /// DELETE

  /**
   * @param { Number } id id of the templateStat
   * @returns { Promise<Boolean> } if the templateStat could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM templatestat
        WHERE idTemplateStat = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }
}
