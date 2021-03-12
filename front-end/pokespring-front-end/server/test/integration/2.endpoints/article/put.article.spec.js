/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/articles/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const topicData = { name: 'topic test 1' }
  const subTopicData = { name: 'subTopic test 1' }
  const articleData = { title: 'article test 1', content: 'articleTest1\'s content' }
  const articleData2 = { title: 'article test 2', content: 'articleTest2\'s content' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated article if it exists and if we are authenticated as a user being a game master of the universe of the selected article', async () => {
    const { article, subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, universeData, userData })

    return agent
      .put(`/api/v1/articles/${article.id}`)
      .send(articleData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'sub-topic', 'keywords'])
        expect(response.body.id).to.equal(article.id)
        expect(response.body.title).to.equal(articleData2.title)
        expect(response.body.content).to.equal(articleData2.content)
        expect(response.body.idSubTopic).to.equal(subTopic.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ articleData, subTopicData, topicData, universeData, userData })

    return agent
      .put(`/api/v1/articles/${article.id}`)
      .send(articleData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected article', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ articleData, subTopicData, topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/articles/${article.id}`)
      .send(articleData2)
      .expect(401)
  })

  it('should return the status 401 if the selected article doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/articles/1')
      .send(articleData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a article in the same subTopic with the same title already exist', async () => {
    const { article, subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ articleData, agent, subTopicData, topicData, userData, universeData })

    await Pre.createArticle({ articleData: articleData2, subTopic })

    return agent
      .put(`/api/v1/articles/${article.id}`)
      .send({ ...articleData, title: articleData2.title })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a title', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, userData, universeData })

    return agent
      .put(`/api/v1/articles/${article.id}`)
      .send({ content: articleData2.content })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a content', async () => {
    const { article } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, userData, universeData })

    return agent
      .put(`/api/v1/articles/${article.id}`)
      .send({ title: articleData2.title })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
