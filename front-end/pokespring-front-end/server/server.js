import express from 'express'
import session from 'express-session'
import MariaDBStore from 'express-session-mariadb-store'
import logger from 'morgan'

import config from './server.config.js'
import mariadb from './services/mariadb.services.js'
import { apiRoute, apiRouter } from './api/routes'

const app = express()

app.enable('trust proxy')
app.use(express.static('static-back', { eTag: false }))

let mariaDBStore = null
try {
  mariadb.init(config.MARIADB)
  mariaDBStore = new MariaDBStore(config.MARIADB)
  // eslint-disable-next-line no-console
  console.log('Connection to the MariaDB database successful !')
} catch (err) {
  // eslint-disable-next-line no-console
  console.log(err.message)
}

app.use(logger('dev'))
app.use(session({
  secret: config.SESSION_SECRET,
  store: mariaDBStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  resave: false,
  saveUninitialized: false
}))
// app.use(session({
//   secret: config.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false
// }))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(apiRoute, apiRouter)

export default app
