import Topic from '../../../models/topic.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getTopic (req, res) {
  const topic = await Topic.get(parseInt(req.params.id))
  res.status(200).json(topic.asResource(baseAPI(req)))
}
