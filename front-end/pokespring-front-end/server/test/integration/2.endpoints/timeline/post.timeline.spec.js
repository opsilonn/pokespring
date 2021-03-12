/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/timelines', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const timelineData = { name: 'timeline test 1', description: 'timelineTest1\'s description', bIsPublic: false }
  const timelineData2 = { name: 'timeline test 2', description: 'timelineTest2\'s description', bIsPublic: true }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created timeline if we are authenticated as a user who can edit the given universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    return agent
      .post('/api/v1/timelines')
      .send({ ...timelineData, idUniverse: universe.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'events'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(timelineData.name)
        expect(response.body.description).to.equal(timelineData.description)
        expect(response.body.bIsPublic).to.equal(timelineData.bIsPublic)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .post('/api/v1/timelines')
      .send({ ...timelineData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idUniverse', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/timelines')
      .send({ ...timelineData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the given universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/timelines')
      .send({ ...timelineData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a timeline in the same universe with the same name already exist', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    await Pre.createTimeline({ timelineData, universe })

    return agent
      .post('/api/v1/timelines')
      .send({ ...timelineData2, name: timelineData.name, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    const timelineDataTruncate = { ...timelineData }
    delete timelineDataTruncate.name

    return agent
      .post('/api/v1/timelines')
      .send({ ...timelineDataTruncate, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
