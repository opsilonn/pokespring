/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/sub-topics', () => {
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

  it('should return the status 201 and the new created subTopic if we are authenticated as a user who can edit the universe of the given topic', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicData, idTopic: topic.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'topic', 'articles'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(subTopicData.name)
        expect(response.body.idTopic).to.equal(topic.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTopic
    )({ topicData, universeData, userData })

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicData, idTopic: topic.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idTopic', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the given topic', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTopic
    )({ topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicData, idTopic: topic.id })
      .expect(401)
  })

  it('should return the status 400 if the given name is the one reserved for the system', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicData, name: '[OTTERWORLDS-SUBTOPIC-SYSTEM]', idTopic: topic.id })
      .expect(400)
  })

  it('should return the status 400 and a error message if a subTopic in the same topic with the same name already exist', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    await Pre.createSubTopic({ subTopicData, topic })

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicData2, name: subTopicData.name, idTopic: topic.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    const subTopicDataTruncate = { ...subTopicData }
    delete subTopicDataTruncate.name

    return agent
      .post('/api/v1/sub-topics')
      .send({ ...subTopicDataTruncate, idTopic: topic.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
