import Inventory from '../../../models/inventory.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteInventory (req, res) {
  const bSucceded = await Inventory.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
