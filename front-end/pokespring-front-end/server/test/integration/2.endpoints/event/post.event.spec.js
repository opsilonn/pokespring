/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/events', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const timelineData = { name: 'timeline test 1', description: 'timelineTest1\'s description', bIsPublic: false }
  const eventData = { name: 'event test 1', year: 2020, month: 12, day: 30, description: 'eventTest1\'s description' }
  const eventData2 = { name: 'event test 2', year: 2021, month: 1, day: 1, description: 'eventTest2\'s description' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created event if we are authenticated as a user who can edit the universe of the given timeline', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, userData, universeData })

    return agent
      .post('/api/v1/events')
      .send({ ...eventData, idTimeline: timeline.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'timeline'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(eventData.name)
        expect(response.body.year).to.equal(eventData.year)
        expect(response.body.month).to.equal(eventData.month)
        expect(response.body.day).to.equal(eventData.day)
        expect(response.body.description).to.equal(eventData.description)
        expect(response.body.idTimeline).to.equal(timeline.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTimeline
    )({ timelineData, userData, universeData })

    return agent
      .post('/api/v1/events')
      .send({ ...eventData, idTimeline: timeline.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idTimeline', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, userData, universeData })

    return agent
      .post('/api/v1/events')
      .send({ ...eventData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the given timeline', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTimeline
    )({ timelineData, userData, universeData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/events')
      .send({ ...eventData, idTimeline: timeline.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a event in the same timeline with the same name already exist', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, userData, universeData })

    await Pre.createEvent({ eventData, timeline })

    return agent
      .post('/api/v1/events')
      .send({ ...eventData2, name: eventData.name, idTimeline: timeline.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if a event in the same timeline with the same date already exist', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, userData, universeData })

    await Pre.createEvent({ eventData, timeline })

    return agent
      .post('/api/v1/events')
      .send({ ...eventData2, year: eventData.year, month: eventData.month, day: eventData.day, idTimeline: timeline.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, userData, universeData })

    const eventDataTruncate = { ...eventData }
    delete eventDataTruncate.name

    return agent
      .post('/api/v1/events')
      .send({ ...eventDataTruncate, idTimeline: timeline.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a year', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, userData, universeData })

    const eventDataTruncate = { ...eventData }
    delete eventDataTruncate.year

    return agent
      .post('/api/v1/events')
      .send({ ...eventDataTruncate, idTimeline: timeline.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
