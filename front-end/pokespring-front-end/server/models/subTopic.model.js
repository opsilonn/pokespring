import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataSubTopic extends HalResourceData {
  /** @type { String } */
  name
  /** @type { Number? } */
  order
}

class HalToOneLinksSubTopic extends HalToOneLinks {
  /** @type { Number } */
  topic
  /** @type { Number } */
  article
}

export default class SubTopic extends HalResource {
  /** @type { HalResourceDataSubTopic } */
  data
  /** @type { HalToOneLinksSubTopic } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = ['articles']

  /**
   * @param { SubTopic } subTopic
   */
  constructor (subTopic) {
    super()

    this.id = subTopic.idSubTopic || subTopic.id

    this.data = new HalResourceDataSubTopic()
    this.data.name = subTopic.name || subTopic.data.name
    this.data.order = (subTopic.order !== undefined) ? subTopic.order : subTopic.data.order

    this.toOneLinks = new HalToOneLinksSubTopic()
    this.toOneLinks.topic = subTopic.topic_idTopic || subTopic.toOneLinks.topic
    this.toOneLinks.article = (subTopic.article_idArticle !== undefined) ? subTopic.article_idArticle : subTopic.toOneLinks.article
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'sub-topics') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'sub-topics', resourcePath = 'sub-topics') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, SubTopic)
  }

  /// GET

  // /**
  //  * @returns { Promise<SubTopic[]> }
  //  */
  // static async getAll () {
  //   return await mariadb.client.query('SELECT * FROM subtopic')
  // }

  /**
   * @param { Number } id id of the subTopic
   * @returns { Promise<SubTopic> }
   */
  static async get (id) {
    return new SubTopic((await mariadb.client.query('SELECT * FROM subtopic WHERE idSubTopic = ?', id))[0])
  }

  /**
   * @param { Number } id id of the topic
   * @returns { Promise<SubTopic[]> }
   */
  static async getByTopic (id) {
    return await mariadb.client.query('SELECT * FROM subtopic WHERE topic_idTopic = ?', id)
  }

  /// POST

  /**
   * @param { { name: String, order: Number, idTopic: Number, idArticle: Number? } } subTopic
   * @returns { Promise<SubTopic> } the id of the new inserted subTopic
   */
  static async add (subTopic) {
    const sql = `
    INSERT INTO 
      subtopic(name, \`order\`, topic_idTopic, article_idArticle) 
      VALUES(?, ?, ?, ?)
    RETURNING *`
    const params = [subTopic.name, subTopic.order || null, subTopic.idTopic, subTopic.idArticle || null]

    return new SubTopic((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the subTopic
   * @param { { name: String, order: Number, idArticle: Number? } } subTopic
   * @returns { Promise<SubTopic> } if the subTopic could have been updated
   */
  static async update (id, subTopic) {
    const sql = `
      INSERT INTO
        subtopic(idSubTopic) VALUES(?)
      ON DUPLICATE KEY UPDATE
        name = ?, \`order\` = ?, article_idArticle = ?
      RETURNING *`
    const params = [id, subTopic.name, subTopic.order || null, subTopic.idArticle || null]

    return new SubTopic((await mariadb.client.query(sql, params))[0])
  }

  /// DELETE

  /**
   * @param { Number } id id of the subTopic
   * @returns { Promise<Boolean> } if the subTopic could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM subtopic
        WHERE idSubTopic = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }
}
