/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/events/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const timelineData = { name: 'timeline test 1', description: 'timelineTest1\'s description', bIsPublic: false }
  const eventData = { name: 'event test 1', year: 2020, month: 12, day: 30, description: 'eventTest1\'s description' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected event if we are authorized to see its universe', async () => {
    const { event, timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    return agent
      .get(`/api/v1/events/${event.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'timeline'])
        expect(response.body.id).to.equal(event.id)
        expect(response.body.name).to.equal(eventData.name)
        expect(response.body.year).to.equal(eventData.year)
        expect(response.body.month).to.equal(eventData.month)
        expect(response.body.day).to.equal(eventData.day)
        expect(response.body.description).to.equal(eventData.description)
        expect(response.body.idTimeline).to.equal(timeline.id)
      })
  })

  it('should return the status 401 if the selected event doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/events/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected event', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTimelineEvent
    )({ eventData, timelineData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/events/${event.id}`)
      .expect(401)
  })
})
