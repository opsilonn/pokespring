import Map from '../../../models/map.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteTemplate (req, res) {
  const bSucceded = await Map.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
