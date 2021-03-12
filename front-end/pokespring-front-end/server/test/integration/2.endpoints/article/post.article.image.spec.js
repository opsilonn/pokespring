/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/articles/:id', () => {
  let agent

  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const topicData = { name: 'topic test 1' }
  const subTopicData = { name: 'subTopic test 1' }
  const articleData = { title: 'article test 1', content: 'articleTest1\'s content' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })

  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the URL to the new created article\'s image if we are authenticated as a user being a game master of the universe of the selected article', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, universeData, userData })

    return agent
      .post(`/api/v1/articles/${article.id}`)
      .attach('article-image', './server/test/data/image.jpg')
      .expect(201)
      .expect('Content-Type', /json/)
  })

  it('should return the status 401 if we are authenticated but not as a user being a game master of the universe of the selected article', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ articleData, subTopicData, topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post(`/api/v1/articles/${article.id}`)
      .set('Connection', 'keep-alive')
      .attach('article-image', './server/test/data/image.jpg')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ articleData, subTopicData, topicData, universeData, userData })

    return agent
      .post(`/api/v1/articles/${article.id}`)
      .set('Connection', 'keep-alive')
      .attach('article-image', './server/test/data/image.jpg')
      .expect(401)
  })

  it('should return the status 400 and a error message if the file send is not a image', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, universeData, userData })

    return agent
      .post(`/api/v1/articles/${article.id}`)
      .attach('article-image', './server/test/data/text.txt')
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
