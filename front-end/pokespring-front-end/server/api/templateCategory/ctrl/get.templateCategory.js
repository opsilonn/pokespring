import TemplateCategory from '../../../models/templateCategory.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getTemplateCategory (req, res) {
  const templateCategory = await TemplateCategory.get(parseInt(req.params.id))
  res.status(200).json(templateCategory.asResource(baseAPI(req)))
}
