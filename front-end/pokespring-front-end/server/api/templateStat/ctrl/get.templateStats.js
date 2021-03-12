import TemplateStat from '../../../models/templateStat.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getTemplateStats (req, res) {
  const templateStats = await TemplateStat.getAll()
  res.status(200).json(TemplateStat.asResourceList(baseAPI(req), templateStats))
}
