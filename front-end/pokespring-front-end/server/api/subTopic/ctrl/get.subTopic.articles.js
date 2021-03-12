import Article from '../../../models/article.model.js'
import { baseAPI } from '../../routes.js'
/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getSubTopicArticles (req, res) {
  const Articles = await Article.getBySubTopic(parseInt(req.params.id), req.query.truncate)
  res.status(200).json(Article.asResourceList(baseAPI(req), Articles, 'sub-topics' + req.url))
}
