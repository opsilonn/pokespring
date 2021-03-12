/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/sub-topics/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const topicData = { name: 'topic test 1' }
  const subTopicData = { name: 'subTopic test 1' }
  const subTopicData2 = { name: 'subTopic test 2' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated subTopic if we are authenticated as a user who can edit the universe of the selected subTopic', async () => {
    const { subTopic, topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, universeData, userData })

    return agent
      .put(`/api/v1/sub-topics/${subTopic.id}`)
      .send(subTopicData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'topic', 'articles'])
        expect(response.body.id).to.equal(subTopic.id)
        expect(response.body.name).to.equal(subTopicData2.name)
        expect(response.body.idTopic).to.equal(topic.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ subTopicData, topicData, universeData, userData })

    return agent
      .put(`/api/v1/sub-topics/${subTopic.id}`)
      .send(subTopicData)
      .expect(401)
  })

  it('should return the status 401 if the selected subTopic is a system subTopic', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .put('/api/v1/sub-topics/1')
      .expect(401)
  })

  it('should return the status 401 if the selected subTopic doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/sub-topics/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected subTopic', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ subTopicData, topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/sub-topics/${subTopic.id}`)
      .expect(401)
  })

  it('should return the status 400 if the new name is the one reserved for the system', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, universeData, userData })

    return agent
      .put(`/api/v1/sub-topics/${subTopic.id}`)
      .send({ ...subTopicData, name: '[OTTERWORLDS-SUBTOPIC-SYSTEM]' })
      .expect(400)
  })

  it('should return the status 400 and a error message if a subTopic in the same topic with the same name already exist', async () => {
    const { subTopic, topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, universeData, userData })

    await Pre.createSubTopic({ subTopicData: subTopicData2, topic })

    return agent
      .put(`/api/v1/sub-topics/${subTopic.id}`)
      .send({ ...subTopicData, name: subTopicData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { subTopic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTopicSubTopic
    )({ agent, subTopicData, topicData, universeData, userData })

    const subTopicDataTruncate = { ...subTopicData2 }
    delete subTopicDataTruncate.name

    return agent
      .put(`/api/v1/sub-topics/${subTopic.id}`)
      .send(subTopicDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
