import Inventory from '../../../models/inventory.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getInventory (req, res) {
  const inventory = await Inventory.get(parseInt(req.params.id))
  res.status(200).json(inventory.asResource(baseAPI(req)))
}
