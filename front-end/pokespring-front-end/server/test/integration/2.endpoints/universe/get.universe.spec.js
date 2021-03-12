/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/universes/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected universe if we authorized to see it', async () => {
    const { universe, user } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .get(`/api/v1/universes/${universe.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.id).to.equal(universe.id)
        expect(response.body.name).to.equal(universeData.name)
        expect(response.body.description).to.equal(universeData.description)
        expect(response.body.bIsPublic).to.be.true
        expect(response.body.idUser).to.equal(user.id)
      })
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the selected universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/universes/${universe.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected universe doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get('/api/v1/universes/1')
      .expect(401)
  })
})
