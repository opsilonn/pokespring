import mariadb from '../services/mariadb.services.js'

class TopicPolicy {
  /**
   * @param { Number } idUser
   * @param { Number } idTopic
   * @returns { Promise<Boolean> }
   */
  static async canGet (idUser, idTopic) {
    const result = await mariadb.client.query('SELECT 1 FROM topic WHERE idTopic = ? AND name != "[OTTERWORLDS-TOPIC-SYSTEM]"', idTopic)
    return result.length !== 0
  }

  /**
   * @param { Number } idUser
   * @param { { name: String, order: Number } } topic
   * @returns { Promise<Boolean> }
   */
  static verify (idUser, topic) {
    if (topic.name === '[OTTERWORLDS-TOPIC-SYSTEM]') { return false }
    // if (topic.order <= 0) { return false }
    return true
  }

  /**
   * @param { Number } idTopic
   * @returns { Promise<Boolean> }
   */
  static async getUniverseId (idTopic) {
    return (await mariadb.client.query(`
      SELECT universe_idUniverse FROM topic
      WHERE idTopic = ?
    `, idTopic))[0].universe_idUniverse
  }
}

export default TopicPolicy
