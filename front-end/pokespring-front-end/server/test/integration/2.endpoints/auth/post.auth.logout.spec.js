/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('POST /api/v1/auth/logout', () => {
  let agent
  const userData = { username: 'login test', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should respond with status 200 if we are authenticated', async () => {
    await Pre.pipeCreateUserLogin({ userData, agent })

    return agent
      .post('/api/v1/auth/logout')
      .expect(200)
      .expect('Content-Type', /json/)
  })

  it('should respond with status 401 if we are not authenticated', () =>
    agent
      .post('/api/v1/auth/logout')
      .expect(401)
  )
})
