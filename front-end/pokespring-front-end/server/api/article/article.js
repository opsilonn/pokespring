import { Router } from 'express'

import isConnected from '../../middlewares/is-connected.js'
import { tryTo, emptyError } from '../../middlewares/errors.js'
import upload from '../../middlewares/image-parser.js'

import ArticlePolicy from '../../policies/article.policy.js'
import SubTopicPolicy from '../../policies/subTopic.policy.js'

// import getArticles from './ctrl/get.articles.js'
import getArticle from './ctrl/get.article.js'
// import getArticleKeywords from './ctrl/get.article.keywords.js'
import postArticle from './ctrl/post.article.js'
import postArticleImage from './ctrl/post.article.image.js'
import putArticle from './ctrl/put.article.js'
// import putArticleKeyword from './ctrl/put.article.keywords.js'
import deleteArticle from './ctrl/delete.article.js'

const {
  canGetUniverseIndirect,
  canEditUniverseIndirect
} = require('../../middlewares/access-rights.js')

const canGet = canGetUniverseIndirect(ArticlePolicy.getUniverseId, 'id', 'params')
const canAdd = canEditUniverseIndirect(SubTopicPolicy.getUniverseId, 'idSubTopic', 'body')
const canEdit = canEditUniverseIndirect(ArticlePolicy.getUniverseId, 'id', 'params')

const router = Router()

// Get
// router.get('/', tryTo(getArticles, emptyError))
router.get('/:id', canGet, tryTo(getArticle, emptyError))
// router.get('/:id/keywords', canGet, tryTo(getArticleKeywords, emptyError))

// Post
router.post('/', isConnected, canAdd, tryTo(postArticle, emptyError))
router.post('/:id', isConnected, canEdit, upload('article-image'), tryTo(postArticleImage, emptyError))

// Put
router.put('/:id', isConnected, canEdit, tryTo(putArticle, emptyError))

// Delete
router.delete('/:id', isConnected, canEdit, tryTo(deleteArticle, emptyError))

export default router
