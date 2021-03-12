/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('PUT /api/v1/auth/password', () => {
  let agent
  const userData = { username: 'login test', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should respond with status 200 if we are authenticated and we provide a new password', async () => {
    await Pre.pipeCreateUserLogin({ userData, agent })

    return agent
      .put('/api/v1/auth/password')
      .send({ oldPassword: 'AzEr12ù*', newPassword: 'new password' })
      .expect(200)
      .expect('Content-Type', /json/)
  })

  it('should respond with status 401 if we are not authenticated', () =>
    agent
      .put('/api/v1/auth/password')
      .expect(401)
  )

  it('should respond with status 401 if we are authenticated but we provide a wrong old password', async () => {
    await Pre.pipeCreateUserLogin({ userData, agent })

    return agent
      .put('/api/v1/auth/password')
      .send({ oldPassword: 'AzEr12ù', newPassword: 'new password' })
      .expect(401)
      .expect('Content-Type', /json/)
  })

  it('should respond with status 400 if we are authenticated but we don\'t provide a old password', async () => {
    await Pre.pipeCreateUserLogin({ userData, agent })

    return agent
      .put('/api/v1/auth/password')
      .send({ newPassword: 'new password' })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should respond with status 400 if we are authenticated but we don\'t provide a new password', async () => {
    await Pre.pipeCreateUserLogin({ userData, agent })

    return agent
      .put('/api/v1/auth/password')
      .send({ oldPassword: 'AzEr12ù*' })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
