/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/universes/:id/users-playing', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const userData3 = { username: 'user test 3', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description' }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the users playing in the selected universe if it is private and we are authenticated as a user who can see the universe', async () => {
    const { user, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData: { ...universeData, bIsPublic: false }, userData })

    const ret2 = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    const ret3 = await asyncPipe(
      Pre.createUser,
      Pre.inviteUserGM
    )({ universe, userData: userData3 })

    return agent
      .get(`/api/v1/universes/${universe.id}/users-playing`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(3)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.list[0].id).to.equal(user.id)
        expect(response.body.list[0].username).to.equal(userData.username)
        expect(response.body.list[0].bIsGM, '').to.be.true
        expect(response.body.list[0].password, '').to.be.undefined

        expect(response.body.list[1]._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.list[1].id).to.equal(ret2.user.id)
        expect(response.body.list[1].username).to.equal(userData2.username)
        expect(response.body.list[1].bIsGM, '').to.be.false
        expect(response.body.list[1].password, '').to.be.undefined

        expect(response.body.list[2]._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.list[2].id).to.equal(ret3.user.id)
        expect(response.body.list[2].username).to.equal(userData3.username)
        expect(response.body.list[2].bIsGM, '').to.be.true
        expect(response.body.list[2].password, '').to.be.undefined
      })
  })

  it('should return the list of all the users playing in the selected universe if it is public', async () => {
    const { user, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    const ret2 = await asyncPipe(
      Pre.createUser,
      Pre.createCharacter
    )({ characterData, universe, userData: userData2 })

    return agent
      .get(`/api/v1/universes/${universe.id}/users-playing`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(2)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.list[0].id).to.equal(user.id)
        expect(response.body.list[0].username).to.equal(userData.username)
        expect(response.body.list[0].bIsGM, '').to.be.true
        expect(response.body.list[0].password, '').to.be.undefined

        expect(response.body.list[1]._links).to.have.all.keys(['self', 'groups', 'universes', 'universes-plays'])
        expect(response.body.list[1].id).to.equal(ret2.user.id)
        expect(response.body.list[1].username).to.equal(userData2.username)
        expect(response.body.list[1].bIsGM, '').to.be.false
        expect(response.body.list[1].password, '').to.be.undefined
      })
  })

  it('should return the status 401 if the selected universe doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/universes/1/users-playing')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the selected universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/universes/${universe.id}/users-playing`)
      .expect(401)
  })
})
