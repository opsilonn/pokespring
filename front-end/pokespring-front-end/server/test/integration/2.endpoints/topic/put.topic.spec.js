/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/topics/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const topicData = { name: 'topic test 1' }
  const topicData2 = { name: 'topic test 2' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated topic if we are authenticated as a user who can edit the universe of the selected topic', async () => {
    const { topic, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    return agent
      .put(`/api/v1/topics/${topic.id}`)
      .send(topicData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'sub-topics'])
        expect(response.body.id).to.equal(topic.id)
        expect(response.body.name).to.equal(topicData2.name)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTopic
    )({ topicData, universeData, userData })

    return agent
      .put(`/api/v1/topics/${topic.id}`)
      .send(topicData)
      .expect(401)
  })

  it('should return the status 401 if the selected topic is a system topic', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .put('/api/v1/topics/1')
      .expect(401)
  })

  it('should return the status 401 if the selected topic doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/topics/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected topic', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTopic
    )({ topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/topics/${topic.id}`)
      .expect(401)
  })

  it('should return the status 400 if the new name is the one reserved for the system', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    return agent
      .put(`/api/v1/topics/${topic.id}`)
      .send({ ...topicData, name: '[OTTERWORLDS-TOPIC-SYSTEM]' })
      .expect(400)
  })

  it('should return the status 400 and a error message if a topic in the same universe with the same name already exist', async () => {
    const { topic, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    await Pre.createTopic({ topicData: topicData2, universe })

    return agent
      .put(`/api/v1/topics/${topic.id}`)
      .send({ ...topicData, name: topicData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { topic } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    const topicDataTruncate = { ...topicData2 }
    delete topicDataTruncate.name

    return agent
      .put(`/api/v1/topics/${topic.id}`)
      .send(topicDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
