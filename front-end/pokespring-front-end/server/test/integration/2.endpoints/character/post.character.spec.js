/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/characters', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }
  const characterData2 = { name: 'character test 2', backstory: 'characterTest2\'s backstory', sheetStatus: 0 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 if we are authenticated as a user who can see the given universe', async () => {
    const { universe, user } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    return agent
      .post('/api/v1/characters')
      .send({ ...characterData, idUniverse: universe.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'user', 'universe', 'groups', 'inventories', 'stats'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(characterData.name)
        expect(response.body.backstory).to.equal(characterData.backstory)
        expect(response.body.bIsAlive).to.be.true
        expect(response.body.sheetStatus).to.equal(characterData.sheetStatus)
        expect(response.body.idUser).to.equal(user.id)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ userData, universeData })

    return agent
      .post('/api/v1/characters')
      .send({ ...characterData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idUniverse', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    return agent
      .post('/api/v1/characters')
      .send({ ...characterData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the given universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ userData, universeData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/characters')
      .send({ ...characterData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a character in the same universe with the same name already exist', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, userData, universeData })

    return agent
      .post('/api/v1/characters')
      .send({ ...characterData2, name: characterData.name, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    const characterDataTruncate = { ...characterData }
    delete characterDataTruncate.name

    return agent
      .post('/api/v1/characters')
      .send({ ...characterDataTruncate, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
