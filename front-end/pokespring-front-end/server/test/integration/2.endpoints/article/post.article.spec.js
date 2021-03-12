/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/articles', () => {
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

  it('should return the status 201 and the new created article if we are authenticated as a user being a game master of the universe of the given subTopic', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, userData, universeData })

    return agent
      .post('/api/v1/articles')
      .send({ ...articleData, idSubTopic: subTopic.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'sub-topic', 'keywords'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.title).to.equal(articleData.title)
        expect(response.body.content).to.equal(articleData.content)
        expect(response.body.idSubTopic).to.equal(subTopic.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ subTopicData, topicData, userData, universeData })

    return agent
      .post('/api/v1/articles')
      .send(articleData)
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idSubTopic', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, userData, universeData })

    return agent
      .post('/api/v1/articles')
      .send(articleData)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the given subTopic', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ subTopicData, topicData, userData, universeData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/articles')
      .send({ ...articleData, idSubTopic: subTopic.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a article in the same subTopic with the same title already exist', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, userData, universeData })

    return agent
      .post('/api/v1/articles')
      .send({ title: articleData.title, content: articleData2.content, idSubTopic: subTopic.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a title', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, userData, universeData })

    return agent
      .post('/api/v1/articles')
      .send({ content: articleData.content, idSubTopic: subTopic.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a content', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, userData, universeData })

    return agent
      .post('/api/v1/articles')
      .send({ title: articleData.title, idSubTopic: subTopic.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
