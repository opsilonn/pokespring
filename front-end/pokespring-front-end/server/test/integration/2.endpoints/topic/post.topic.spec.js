/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/topics', () => {
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

  it('should return the status 201 and the new created topic if we are authorized to see the given universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    return agent
      .post('/api/v1/topics')
      .send({ ...topicData, idUniverse: universe.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'sub-topics'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(topicData.name)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .post('/api/v1/topics')
      .send({ ...topicData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idUniverse', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/topics')
      .send({ ...topicData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the given universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/topics')
      .send({ ...topicData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 400 if the given name is the one reserved for the system', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .post('/api/v1/topics')
      .send({ ...topicData, name: '[OTTERWORLDS-TOPIC-SYSTEM]', idUniverse: universe.id })
      .expect(400)
  })

  it('should return the status 400 and a error message if a topic in the same universe with the same name already exist', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    await Pre.createTopic({ topicData, universe })

    return agent
      .post('/api/v1/topics')
      .send({ ...topicData2, name: topicData.name, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    const topicDataTruncate = { ...topicData }
    delete topicDataTruncate.name

    return agent
      .post('/api/v1/topics')
      .send({ ...topicDataTruncate, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
