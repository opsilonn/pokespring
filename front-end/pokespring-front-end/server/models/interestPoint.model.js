import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataInterestPoint extends HalResourceData {
  /** @type { String } */
  name
  /** @type { String } */
  coordinates
}

class HalToOneLinksInterestPoint extends HalToOneLinks {
  /** @type { Number } */
  map
  /** @type { Number? } */
  article
}

export default class InterestPoint extends HalResource {
  /** @type { HalResourceDataInterestPoint } */
  data
  /** @type { HalToOneLinksInterestPoint } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = []

  /**
   * @param { InterestPoint } interestPoint
   */
  constructor (interestPoint) {
    super()

    this.id = interestPoint.idInterestPoint || interestPoint.id

    this.data = new HalResourceDataInterestPoint()
    this.data.name = interestPoint.name || interestPoint.data.name
    this.data.coordinates = interestPoint.coordinates || interestPoint.data.coordinates

    this.toOneLinks = new HalToOneLinksInterestPoint()
    this.toOneLinks.map = interestPoint.map_idMap || interestPoint.toOneLinks.map
    this.toOneLinks.article = (interestPoint.article_idArticle !== undefined) ? interestPoint.article_idArticle : interestPoint.toOneLinks.article
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'interest-points') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'interest-points', resourcePath = 'interest-points') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, InterestPoint)
  }

  /// GET

  // /**
  //  * @returns { Promise<InterestPoint[]> }
  //  */
  // static async getAll () {
  //   return await mariadb.client.query('SELECT * FROM interestpoint')
  // }

  /**
   * @param { Number } id id of the interestPoint
   * @returns { Promise<InterestPoint> }
   */
  static async get (id) {
    return new InterestPoint((await mariadb.client.query('SELECT * FROM interestpoint WHERE idInterestPoint = ?', id))[0])
  }

  /**
   * @param { Number } id id of the map
   * @returns { Promise<InterestPoint[]> }
   */
  static async getByMap (id) {
    return await mariadb.client.query('SELECT * FROM interestpoint WHERE map_idMap=?', id)
  }

  /// POST

  /**
   * @param { { name: String, coordinates: String, idMap: Number, idArticle: Number? } } interestPoint
   * @returns { Promise<InterestPoint> } the id of the new inserted interestPoint
   */
  static async add (interestPoint) {
    const sql = `
      INSERT INTO
        interestpoint(name, coordinates, map_idMap, article_idArticle)
        VALUES(?, ?, ?, ?)
      RETURNING *`
    // All the params we have to put to insert a new row in the table
    const params = [interestPoint.name, interestPoint.coordinates, interestPoint.idMap, interestPoint.idArticle || null]

    return new InterestPoint((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the interestPoint
   * @param { { name: String, coordinates: String, idArticle: Number? } } interestPoint
   * @returns { Promise<InterestPoint> } if the interestPoint could have been updated
   */
  static async update (id, interestPoint) {
    const sql = `
      INSERT INTO
        interestpoint(idInterestPoint) VALUES(?)
      ON DUPLICATE KEY UPDATE
        name = ?, coordinates = ?, article_idArticle = ?
      RETURNING *`
    const params = [id, interestPoint.name, interestPoint.coordinates, interestPoint.idArticle || null]

    return new InterestPoint((await mariadb.client.query(sql, params))[0])
  }

  /// DELETE

  /**
   * @param { Number } id id of the interestPoint
   * @returns { Promise<Boolean> } if the interestPoint could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM interestpoint
        WHERE idInterestPoint = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }
}
