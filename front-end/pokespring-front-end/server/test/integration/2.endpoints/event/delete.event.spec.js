/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('DELETE /api/v1/events/:id', () => {
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

  it('should return the status 200 if we are authenticated as a user who can edit the universe of the selected event', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTimelineEvent
    )({ agent, eventData, timelineData, universeData, userData })

    return agent
      .delete(`/api/v1/events/${event.id}`)
      .expect(200)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTimelineEvent
    )({ eventData, timelineData, universeData, userData })

    return agent
      .delete(`/api/v1/events/${event.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected event doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete('/api/v1/events/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected event', async () => {
    const { event } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTimelineEvent
    )({ eventData, timelineData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .delete(`/api/v1/events/${event.id}`)
      .expect(401)
  })
})
