import TemplateStat from '../../../models/templateStat.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteTemplateStat (req, res) {
  const bSucceded = await TemplateStat.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
