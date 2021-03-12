import SubTopic from '../../../models/subTopic.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getSubTopic (req, res) {
  const subTopic = await SubTopic.get(parseInt(req.params.id))
  res.status(200).json(subTopic.asResource(baseAPI(req)))
}
