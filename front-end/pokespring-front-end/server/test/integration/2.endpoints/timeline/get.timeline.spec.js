/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/timelines/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const timelineData = { name: 'timeline test 1', description: 'timelineTest1\'s description', bIsPublic: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected timeline if we are authorized to see its universe', async () => {
    const { timeline, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, universeData, userData })

    return agent
      .get(`/api/v1/timelines/${timeline.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'events'])
        expect(response.body.id).to.equal(timeline.id)
        expect(response.body.name).to.equal(timelineData.name)
        expect(response.body.description).to.equal(timelineData.description)
        expect(response.body.bIsPublic).to.equal(timelineData.bIsPublic)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if the selected timeline doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/timelines/1')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated as a user who can see the universe of the selected timeline', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTimeline
    )({ timelineData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/timelines/${timeline.id}`)
      .expect(401)
  })
})
