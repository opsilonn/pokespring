import TemplateCategory from '../../../models/templateCategory.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteTemplateCategory (req, res) {
  const bSucceded = await TemplateCategory.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
