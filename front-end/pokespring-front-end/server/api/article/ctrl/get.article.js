import Article from '../../../models/article.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getArticle (req, res) {
  const article = await Article.get(parseInt(req.params.id), req.query.truncate)
  res.status(200).json(article.asResource(baseAPI(req)))
}
