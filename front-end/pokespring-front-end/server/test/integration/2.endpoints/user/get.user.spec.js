/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('GET /api/v1/users/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected user if it exists', async () => {
    const { user } = await Pre.createUser({ userData })

    return agent
      .get(`/api/v1/users/${user.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.id).to.equal(user.id)
        expect(response.body.username).to.equal(userData.username)
        expect(response.body.password, '').to.be.undefined
      })
  })

  it('should return the status 404 and a error message if the selected user doesn\'t exists', () =>
    agent
      .get('/api/v1/users/1')
      .expect(404)
      .expect('Content-Type', /json/)
  )
})
