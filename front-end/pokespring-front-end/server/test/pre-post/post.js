import mariadb from '../../services/mariadb.services.js'
import params from '../integration/test.config.js'

export default class Post {
  static async truncateTables () {
    mariadb.close()
    await mariadb.init({ ...params, multipleStatements: true })
    return await mariadb.truncateTables()
  }
}
