/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/timelines/:id/events', () => {
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

  it('should return the list of all the events of the selected timeline if we are authorized to can see its universe', async () => {
    const { event, timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    return agent
      .get(`/api/v1/timelines/${timeline.id}/events`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'timeline'])
        expect(response.body.list[0].id).to.equal(event.id)
        expect(response.body.list[0].name).to.equal(eventData.name)
        expect(response.body.list[0].year).to.equal(eventData.year)
        expect(response.body.list[0].month).to.equal(eventData.month)
        expect(response.body.list[0].day).to.equal(eventData.day)
        expect(response.body.list[0].description).to.equal(eventData.description)
        expect(response.body.list[0].idTimeline).to.equal(timeline.id)
      })
  })

  it('should return the status 401 if the selected timeline doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/timelines/1/events')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated as a user who can see the universe of the selected timeline', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTimelineEvent
    )({ eventData, timelineData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/timelines/${timeline.id}/events`)
      .expect(401)
  })
})
