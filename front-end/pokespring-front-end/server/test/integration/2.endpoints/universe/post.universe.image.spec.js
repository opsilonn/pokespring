/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/universes/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the URL to the new created universe\'s image if we are authenticated as a user being a game master of the selected universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .post(`/api/v1/universes/${universe.id}`)
      .attach('universe-image', './server/test/data/image.jpg')
      .expect(201)
      .expect('Content-Type', /json/)
  })

  it('should return the status 401 if we are authenticated but not as a user being a game master of the selected universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post(`/api/v1/universes/${universe.id}`)
      .set('Connection', 'keep-alive')
      .attach('universe-image', './server/test/data/image.jpg')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .post(`/api/v1/universes/${universe.id}`)
      .set('Connection', 'keep-alive')
      .attach('universe-image', './server/test/data/image.jpg')
      .expect(401)
  })

  it('should return the status 400 and a error message if the file send is not a image', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .post(`/api/v1/universes/${universe.id}`)
      .attach('universe-image', './server/test/data/text.txt')
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
