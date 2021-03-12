import mariadb from '../services/mariadb.services.js'
import { build_database as buildDatabase } from './sql.js'

/**
 * @param { { host: String, database: String, user: String, password: String } } params
 */
export default async function (params) {
  mariadb.close()
  await mariadb.init({ ...params, database: undefined })
  await mariadb.client.query(buildDatabase.replace('?', params.database))

  mariadb.close()
  await mariadb.init({ ...params, multipleStatements: true })
  await mariadb.dropTables()
}
