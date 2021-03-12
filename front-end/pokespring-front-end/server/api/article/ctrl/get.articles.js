import Article from '../../../models/article.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getArticles (req, res) {
  const articles = await Article.getAll(req.query.truncate)
  res.status(200).json(Article.asResourceList(baseAPI(req), articles))
}
