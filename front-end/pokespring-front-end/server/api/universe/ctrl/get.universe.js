import Universe from '../../../models/universe.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getUniverse (req, res) {
  const universe = await Universe.get(parseInt(req.params.id))
  res.status(200).json(universe.asResource(baseAPI(req)))
}
