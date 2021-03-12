import sql from '../utils/sql.js'
const mariadb = require('mariadb')

class MariadbService {
  /** @type { import('mariadb').Pool } */
  pool;
  /** @type { Promise<PoolConnection> } */
  client;

  /**
   * @param { import('mariadb').ClientConfig } config
   */
  async init (config) {
    this.pool = mariadb.createPool(config)
    this.client = await this.pool.getConnection()
  }

  close () {
    if (this.client) {
      this.client.end()
    }
    this.client = null
    if (this.pool) {
      this.pool.end()
    }
    this.pool = null
  }

  async dropTables () {
    const viewNames = await this.client.query('SHOW FULL TABLES WHERE TABLE_TYPE = "VIEW"')
    const tablesNames = await this.client.query('SHOW FULL TABLES WHERE TABLE_TYPE = "BASE TABLE"')

    const queriesViews = viewNames.map(_ => 'DROP VIEW IF EXISTS `?`'.replace('?', Object.values(_)[0])).join('; ')
    const queriesTables = tablesNames.map(_ => 'DROP TABLE IF EXISTS `?`'.replace('?', Object.values(_)[0])).join('; ')

    const queries = (queriesViews.length > 0) ? [queriesViews, queriesTables].join('; ') : queriesTables
    if (queries.length > 0) {
      try {
        await this.client.query(sql.config_disable_FKCheck)
        await this.client.query(queries)
      } finally {
        await this.client.query(sql.config_enable_FKCheck)
      }
    }
  }

  async truncateTables () {
    const tablesNames = await this.client.query('SHOW FULL TABLES WHERE TABLE_TYPE = "BASE TABLE"')

    try {
      await this.client.query(sql.config_disable_FKCheck)
      await this.client.query(tablesNames.map(_ => 'TRUNCATE TABLE `?`'.replace('?', Object.values(_)[0])).join('; '))
    } finally {
      await this.client.query(sql.config_enable_FKCheck)
    }
  }
}

export default new MariadbService()
