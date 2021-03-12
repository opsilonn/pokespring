import Article from '../../../models/article.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteTemplate (req, res) {
  const bSucceded = await Article.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
