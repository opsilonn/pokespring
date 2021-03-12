import SubTopic from '../../../models/subTopic.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteSubTopic (req, res) {
  const bSucceded = await SubTopic.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
