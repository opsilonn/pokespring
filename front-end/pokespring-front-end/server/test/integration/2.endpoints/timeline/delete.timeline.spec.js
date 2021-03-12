/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('DELETE /api/v1/timelines/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const timelineData = { name: 'timeline test 1', description: 'timelineTest1\'s description', bIsPublic: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 if we are authenticated as a user who can edit the universe of the selected timeline', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTimeline
    )({ agent, timelineData, universeData, userData })

    return agent
      .delete(`/api/v1/timelines/${timeline.id}`)
      .expect(200)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTimeline
    )({ timelineData, universeData, userData })

    return agent
      .delete(`/api/v1/timelines/${timeline.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected timeline doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete('/api/v1/timelines/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected timeline', async () => {
    const { timeline } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTimeline
    )({ timelineData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .delete(`/api/v1/timelines/${timeline.id}`)
      .expect(401)
  })
})
