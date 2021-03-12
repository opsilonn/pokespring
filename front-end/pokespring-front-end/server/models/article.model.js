import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataArticle extends HalResourceData {
  /** @type { String } */
  title
  /** @type { String? } */
  content
}

class HalToOneLinksArticle extends HalToOneLinks {
  /** @type { Number } */
  subTopic
}

export default class Article extends HalResource {
  /** @type { HalResourceDataCharacter } */
  data
  /** @type { HalToOneLinksCharacter } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = ['keywords']

  /**
   * @param { Article } article
   */
  constructor (article) {
    super()

    this.id = article.idArticle || article.id

    this.data = new HalResourceDataArticle()
    this.data.title = article.title || article.data.title
    this.data.content = (article.content !== undefined) ? article.content : article.data.content

    this.toOneLinks = new HalToOneLinksArticle()
    this.toOneLinks.subTopic = article.subTopic_idSubTopic || article.toOneLinks.subTopic
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'articles') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   * @param { class } Classe
   */
  static asResourceList (baseAPI, list, selfLink = 'articles', resourcePath = 'articles') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, Article)
  }

  /// GET

  // /**
  //  * @returns { Promise<Article[]> }
  //  * @param { Boolean } truncate if the content of the articles should be return
  //  */
  // static async getAll (truncate = false) {
  //   return await mariadb.client.query(`
  //     SELECT ${truncate ? 'idArticle, title, NULL as content, subTopic_idSubTopic' : '*'} FROM article
  //   `)
  // }

  /**
   * @param { Number } id id of the article
   * @param { Boolean } truncate if the content of the article should be return
   * @returns { Promise<Article> }
   */
  static async get (id, truncate = false) {
    return new Article(
      (await mariadb.client.query(`
        SELECT ${truncate ? 'idArticle, title, NULL as content, subTopic_idSubTopic' : '*'} FROM article
        WHERE idArticle = ?
      `, id))[0]
    )
  }

  /**
   * @param { Number } id id of the subTopic
   * @param { Boolean } truncate if the content of the articles should be return
   * @returns { Promise<Article[]> }
   */
  static async getBySubTopic (id, truncate) {
    return await mariadb.client.query(`
      SELECT ${truncate ? 'idArticle, title, NULL as content, subTopic_idSubTopic' : '*'} FROM article
      WHERE subTopic_idSubTopic = ?
    `, id)
  }

  // /**
  //  * @param { Number } idUniverse id of the universe
  //  * @param { String } keyword name of the keyword
  //  * @param { Boolean } truncate if the content of the articles should be return
  //  * @returns { Promise<Article[]> }
  //  */
  // static async getByKeyword (idUniverse, keyword, truncate = false) {
  //   return await mariadb.client.query(`
  //     SELECT ${truncate ? 'idArticle, title, NULL as content, subTopic_idSubTopic' : 'a.*'} FROM article a
  //     INNER JOIN subTopic st
  //       ON st.idSubTopic = a.subTopic_idSubTopic
  //     INNER JOIN topic t
  //       ON t.idTopic = st.topic_idTopic
  //     INNER JOIN universe u
  //       ON u.idUniverse = t.universe_idUniverse
  //     INNER JOIN keyword k
  //       ON k.article_idArticle = a.idArticle
  //     WHERE u.idUniverse = ? AND k.name = ?
  //   `, [idUniverse, keyword])
  // }

  /// POST

  /**
   * @param { { title: String, content: String, idSubTopic: Number } } article
   * @returns { Promise<Article> } the id of the new inserted article
   */
  static async add (article) {
    const sql = `
      INSERT INTO
        article(title, content, subtopic_idSubTopic)
        VALUES(?, ?, ?)
      RETURNING *`
    // All the params we have to put to insert a new row in the table
    const params = [article.title, article.content, article.idSubTopic]

    return new Article((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the article
   * @param { { title: String, content: String } } article
   * @returns { Promise<Article> } if the article could have been updated
   */
  static async update (id, article) {
    const sql = `
      INSERT INTO
        article(idArticle) VALUES(?)
      ON DUPLICATE KEY UPDATE
        title = ?, content = ?
      RETURNING *`
    const params = [id, article.title, article.content]

    return new Article((await mariadb.client.query(sql, params))[0])
  }

  /// DELETE

  /**
   * @param { Number } id id of the article
   * @returns { Promise<Boolean> } if the article could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM article
        WHERE idArticle = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }
}
