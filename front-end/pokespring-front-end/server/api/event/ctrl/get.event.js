import Event from '../../../models/event.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getEvent (req, res) {
  const event = await Event.get(parseInt(req.params.id))
  res.status(200).json(event.asResource(baseAPI(req)))
}
