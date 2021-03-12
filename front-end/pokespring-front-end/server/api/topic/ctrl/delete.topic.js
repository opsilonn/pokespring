import Topic from '../../../models/topic.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteTopic (req, res) {
  const bSucceded = await Topic.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
