import Timeline from '../../../models/timeline.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteTimeline (req, res) {
  const bSucceded = await Timeline.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
