import Universe from '../../../models/universe.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteUniverseUser (req, res) {
  const bSucceeded = await Universe.kickUser(parseInt(req.params.id), parseInt(req.params.idUser))
  res.status(200).json(bSucceeded)
}
