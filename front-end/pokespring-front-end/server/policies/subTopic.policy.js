import mariadb from '../services/mariadb.services.js'

class SubTopicPolicy {
  /**
   * @param { Number } idUser
   * @param { Number } idSubTopic
   * @returns { Promise<Boolean> }
   */
  static async canGet (idUser, idSubTopic) {
    const result = await mariadb.client.query('SELECT 1 FROM subtopic WHERE idSubTopic = ? AND name != "[OTTERWORLDS-SUBTOPIC-SYSTEM]"', idSubTopic)
    return result.length !== 0
  }

  /**
   * @param { Number } idUser
   * @param { { name: String, order: Number } } subTopic
   * @returns { Promise<Boolean> }
   */
  static verify (idUser, subTopic) {
    if (subTopic.name === '[OTTERWORLDS-SUBTOPIC-SYSTEM]') { return false }
    // if (subTopic.order <= 0) { return false }
    return true
  }

  /**
   * @param { Number } idSubTopic
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idSubTopic) {
    return (await mariadb.client.query(`
      SELECT t.universe_idUniverse FROM subtopic st
      INNER JOIN topic t
        ON t.idTopic = st.topic_idTopic
      WHERE st.idSubTopic = ?
    `, idSubTopic))[0].universe_idUniverse
  }
}

export default SubTopicPolicy
