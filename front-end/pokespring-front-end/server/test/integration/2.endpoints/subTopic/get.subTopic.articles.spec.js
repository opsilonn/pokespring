/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/sub-topics/:id/articles', () => {
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

  it('should return the list of all the articles of the selected subTopic if we are authorized to see its universe', async () => {
    const { article, subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ agent, articleData, subTopicData, topicData, universeData, userData })

    return agent
      .get(`/api/v1/sub-topics/${subTopic.id}/articles`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'sub-topic', 'keywords'])
        expect(response.body.list[0].id).to.equal(article.id)
        expect(response.body.list[0].title).to.equal(articleData.title)
        expect(response.body.list[0].content).to.equal(articleData.content)
        expect(response.body.list[0].idSubTopic).to.equal(subTopic.id)
      })
  })

  it('should return the status 401 if the selected subTopic is a system subTopic', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .get('/api/v1/sub-topics/1/articles')
      .expect(401)
  })

  it('should return the status 401 if the selected subTopic doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/sub-topics/1/articles')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected subTopic', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopicArticle
    )({ articleData, subTopicData, topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/sub-topics/${subTopic.id}/articles`)
      .expect(401)
  })
})
