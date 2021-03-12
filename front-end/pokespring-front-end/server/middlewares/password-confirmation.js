import mariadb from '../services/mariadb.services.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 * @param { import('express').NextFunction } next
 */
export default async function passwordConfirmation (req, res, next) {
  const row = (await mariadb.client.query('SELECT `password` FROM user WHERE idUser = ?', req.session.idUser))[0]

  if (req.body.password === row.password) {
    next()
    return
  }
  res.status(401).json({ error: 'Invalid password' })
}
