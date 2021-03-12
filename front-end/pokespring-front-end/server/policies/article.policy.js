import mariadb from '../services/mariadb.services.js'

class ArticlePolicy {
  /**
   * @param { Number } idArticle
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idArticle) {
    if (isNaN(idArticle)) { throw new TypeError('No Article specified !') }

    const result = await mariadb.client.query(`
      SELECT t.universe_idUniverse FROM article a
      INNER JOIN subtopic st
        ON st.idSubTopic = a.subTopic_idSubTopic
      INNER JOIN topic t
        ON t.idTopic = st.topic_idTopic
      WHERE idArticle = ?
      `, idArticle)

    if (result.length === 0) { throw new Error('Article undefined !') }
    return result[0].universe_idUniverse
  }
}

export default ArticlePolicy
