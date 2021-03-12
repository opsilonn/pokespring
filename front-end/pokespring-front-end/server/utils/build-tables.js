import mariadb from '../services/mariadb.services.js'
import sql from './sql.js'

/**
 * @param {{ host: String, database: String, user: String, password: String }} params
 */
export default async function (params) {
  mariadb.close()
  await mariadb.init({ ...params, multipleStatements: true })

  const sqlBuildKey = []
  // We filter the queries which start by build_
  Object.keys(sql).forEach((_) => {
    if (_.includes('build_table_') || _.includes('build_view_')) {
      sqlBuildKey.push(_)
    }
  })

  // We exectute all these queries
  try {
    await mariadb.client.query(sql.build_before)
    await Promise.all(sqlBuildKey.map(_ => mariadb.client.query(sql[_])))
  } finally {
    await mariadb.client.query(sql.build_after)
  }
}
