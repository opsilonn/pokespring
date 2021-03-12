import Universe from '../../../models/universe.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteUniverse (req, res) {
  const bSucceded = await Universe.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
