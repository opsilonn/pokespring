/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('DELETE /api/v1/users/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 if we are authenticated as the selected user', async () => {
    const { user } = await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete(`/api/v1/users/${user.id}`)
      .expect(200)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { user } = await Pre.createUser({ userData })

    return agent
      .delete(`/api/v1/users/${user.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected user doesn\'t exist', async () => {
    const { user } = await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete(`/api/v1/users/${user.id + 1}`)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated but not as the selected user', async () => {
    const { user } = await Pre.createUser({ userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .delete(`/api/v1/users/${user.id}`)
      .expect(401)
  })
})
