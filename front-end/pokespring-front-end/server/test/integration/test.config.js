import config from '../../server.config.js'

const testConfig = {
  ...config.MARIADB,
  database: process.env.DB_DATABASE || 'otter_worlds_test' || ''
}

export default testConfig
