/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('GET /api/v1/users', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the users', async () => {
    const { user } = await Pre.createUser({ userData })

    return agent
      .get('/api/v1/users')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.list[0].id).to.equal(user.id)
        expect(response.body.list[0].username).to.equal(userData.username)
        expect(response.body.list[0].password, '').to.be.undefined
      })
  })
})
