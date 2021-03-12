/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/auth/login', () => {
  let agent
  const userData = { username: 'login test', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const userData3 = { username: 'user test 3', password: 'AzEr12ù*' }
  const userData4 = { username: 'user test 4', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const universeData2 = { name: 'universe test 2', description: 'universeTest1\'s description', bIsPublic: false }
  const universeData3 = { name: 'universe test 3', description: 'universeTest1\'s description', bIsPublic: false }
  const universeData4 = { name: 'universe test 4', description: 'universeTest1\'s description', bIsPublic: true }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }
  let user = {}

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(async () => {
    const ret = await asyncPipe(
      Pre.createExpress,
      Pre.createUser
    )({ userData })
    agent = ret.agent
    user = ret.user
  })
  afterEach(() => Post.truncateTables())

  /// TODO test universesOwns & universesPlays with a user with these kind data

  it('should respond with the current user if the authentication succeeded', () =>
    agent
      .post('/api/v1/auth/login')
      .send({ username: userData.username, password: userData.password })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.id).to.equal(user.id)
        expect(response.body.username).to.equal(userData.username)
        expect(response.body.universesOwns).to.be.an('array').of.length(0)
        expect(response.body.universesPlays).to.be.an('array').of.length(0)
        expect(response.body.password, '').to.be.undefined
      })
  )

  it('should respond with the current logged user with its universes owns and its unverses where he is playing if we are authenticated', async () => {
    const ret1 = await Pre.createUniverse({ universeData, user })

    const ret2 = await Pre.pipeCreateUserUniverse({ universeData: universeData2, userData: userData2 })

    await Pre.inviteUser({ universe: ret2.universe, user })

    const ret3 = await Pre.pipeCreateUserUniverse({ universeData: universeData3, userData: userData3 })

    await Pre.inviteUserGM({ universe: ret3.universe, user })

    const ret4 = await Pre.pipeCreateUserUniverse({ universeData: universeData4, userData: userData4 })

    await Pre.createCharacter({ characterData, universe: ret4.universe, user })

    return agent
      .post('/api/v1/auth/login')
      .send({ username: userData.username, password: userData.password })
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.id).to.equal(user.id)
        expect(response.body.username).to.equal(userData.username)
        expect(response.body.password, '').to.be.undefined
        expect(response.body.universesOwns).to.be.an('array').of.length(1)

        expect(response.body.universesOwns[0].id).to.equal(ret1.universe.id)
        expect(response.body.universesOwns[0].name).to.equal(universeData.name)
        expect(response.body.universesOwns[0].description).to.equal(universeData.description)
        expect(response.body.universesOwns[0].bIsPublic).to.be.false
        expect(response.body.universesOwns[0].idUser).to.equal(user.id)

        expect(response.body.universesPlays).to.be.an('array').of.length(4)

        expect(response.body.universesPlays[0].id).to.equal(ret1.universe.id)
        expect(response.body.universesPlays[0].name).to.equal(universeData.name)
        expect(response.body.universesPlays[0].description).to.equal(universeData.description)
        expect(response.body.universesPlays[0].bIsPublic).to.be.false
        expect(response.body.universesPlays[0].idUser).to.equal(user.id)
        expect(response.body.universesPlays[0].bIsGM).to.be.true
        expect(response.body.universesPlays[1].id).to.equal(ret2.universe.id)
        expect(response.body.universesPlays[1].name).to.equal(universeData2.name)
        expect(response.body.universesPlays[1].description).to.equal(universeData2.description)
        expect(response.body.universesPlays[1].bIsPublic).to.be.false
        expect(response.body.universesPlays[1].idUser).to.equal(ret2.user.id)
        expect(response.body.universesPlays[1].bIsGM).to.be.false
        expect(response.body.universesPlays[2].id).to.equal(ret3.universe.id)
        expect(response.body.universesPlays[2].name).to.equal(universeData3.name)
        expect(response.body.universesPlays[2].description).to.equal(universeData3.description)
        expect(response.body.universesPlays[2].bIsPublic).to.be.false
        expect(response.body.universesPlays[2].idUser).to.equal(ret3.user.id)
        expect(response.body.universesPlays[2].bIsGM).to.be.true
        expect(response.body.universesPlays[3].id).to.equal(ret4.universe.id)
        expect(response.body.universesPlays[3].name).to.equal(universeData4.name)
        expect(response.body.universesPlays[3].description).to.equal(universeData4.description)
        expect(response.body.universesPlays[3].bIsPublic).to.be.true
        expect(response.body.universesPlays[3].idUser).to.equal(ret4.user.id)
        expect(response.body.universesPlays[3].bIsGM).to.be.false
      })
  })

  it('should respond with status 401 if authentication failed because the username don\'t exist', () =>
    agent
      .post('/api/v1/auth/login')
      .send({ username: 'non-existent user', password: user.password })
      .expect(401)
  )

  it('should respond with status 401 if authentication failed because the password is incorrect', () =>
    agent
      .post('/api/v1/auth/login')
      .send({ username: user.username, password: 'bad password' })
      .expect(401)
  )
})
