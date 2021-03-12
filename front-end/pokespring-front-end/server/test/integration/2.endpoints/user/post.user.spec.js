/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('POST /api/v1/users', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created user', () =>
    agent
      .post('/api/v1/users')
      .send(userData)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.username).to.equal(userData.username)
        expect(response.body.password, '').to.be.undefined
      })
  )

  it('should return the status 400 and a error message if a user with the same name already exist', async () => {
    await Pre.createUser({ userData })

    return agent
      .post('/api/v1/users')
      .send(userData)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a username', () =>
    agent
      .post('/api/v1/users')
      .send({ password: userData.password })
      .expect(400)
      .expect('Content-Type', /json/)
  )

  it('should return the status 400 and a error message if we don\'t provide a password', () =>
    agent
      .post('/api/v1/users')
      .send({ username: userData.username })
      .expect(400)
      .expect('Content-Type', /json/)
  )
})
