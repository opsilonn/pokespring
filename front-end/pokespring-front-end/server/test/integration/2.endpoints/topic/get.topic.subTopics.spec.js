/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/topics/:id/sub-topics', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const topicData = { name: 'topic test 1' }
  const subTopicData = { name: 'subTopic test 1' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the subTopics of the selected topic if we are authorized to see its universe', async () => {
    const { subTopic, topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, universeData, userData })

    return agent
      .get(`/api/v1/topics/${topic.id}/sub-topics`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'topic', 'articles'])
        expect(response.body.list[0].id).to.equal(subTopic.id)
        expect(response.body.list[0].name).to.equal(subTopicData.name)
        expect(response.body.list[0].idTopic).to.equal(topic.id)
      })
  })

  it('should return the status 401 if the selected topic is a system topic', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .get('/api/v1/topics/1/sub-topics')
      .expect(401)
  })

  it('should return the status 401 if the selected topic doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/topics/1/sub-topics')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected topic', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ subTopicData, topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/topics/${topic.id}/sub-topics`)
      .expect(401)
  })
})
