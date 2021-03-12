import SubTopic from '../../../models/subTopic.model.js'
import { baseAPI } from '../../routes.js'
/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getTopicSubTopics (req, res) {
  const subTopics = await SubTopic.getByTopic(parseInt(req.params.id))
  res.status(200).json(SubTopic.asResourceList(baseAPI(req), subTopics, 'topics' + req.url))
}
