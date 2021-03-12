/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('POST /api/v1/users/:id', () => {
  /** @type import('supertest').SuperAgentTest */
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the URL to the new created user\'s image if we are authenticated as the selected user', async () => {
    const { user } = await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post(`/api/v1/users/${user.id}`)
      .attach('user-image', './server/test/data/image.jpg')
      .expect(201)
      .expect('Content-Type', /json/)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { user } = await Pre.createUser({ userData })

    return agent
      .post(`/api/v1/users/${user.id}`)
      .set('Connection', 'keep-alive')
      .attach('user-image', './server/test/data/image.jpg')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated but not as the selected user', async () => {
    const { user } = await Pre.createUser({ userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post(`/api/v1/users/${user.id}`)
      .set('Connection', 'keep-alive')
      .attach('user-image', './server/test/data/image.jpg')
      .expect(401)
  })

  it('should return the status 400 and a error message if the file send is not a image', async () => {
    const { user } = await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post(`/api/v1/users/${user.id}`)
      .attach('user-image', './server/test/data/text.txt')
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
