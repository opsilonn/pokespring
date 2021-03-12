/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/events/:id', () => {
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

  it('should return the status 200 and the updated event if we are authenticated as a user who can edit the universe of the selected event', async () => {
    const { event, timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send(eventData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'timeline'])
        expect(response.body.id).to.equal(event.id)
        expect(response.body.name).to.equal(eventData2.name)
        expect(response.body.year).to.equal(eventData2.year)
        expect(response.body.month).to.equal(eventData2.month)
        expect(response.body.day).to.equal(eventData2.day)
        expect(response.body.description).to.equal(eventData2.description)
        expect(response.body.idTimeline).to.equal(timeline.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTimelineEvent
    )({ eventData, timelineData, universeData, userData })

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send(eventData2)
      .expect(401)
  })

  it('should return the status 401 if the selected event doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/events/1')
      .send(eventData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected event', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTimelineEvent
    )({ eventData, timelineData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send(eventData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a event in the same timeline with the same name already exist', async () => {
    const { event, timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    await Pre.createEvent({ eventData: eventData2, timeline })

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send({ ...eventData, name: eventData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if a event in the same timeline with the same date already exist', async () => {
    const { event, timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    await Pre.createEvent({ eventData: eventData2, timeline })

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send({ ...eventData, year: eventData2.year, month: eventData2.month, day: eventData2.day })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    const eventDataTruncate = { ...eventData2 }
    delete eventDataTruncate.name

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send(eventDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a year', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    const eventDataTruncate = { ...eventData2 }
    delete eventDataTruncate.year

    return agent
      .put(`/api/v1/events/${event.id}`)
      .send(eventDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
