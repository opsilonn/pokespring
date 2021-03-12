/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/inventories', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }
  const inventoryData = { name: 'inventory test 1', number: 42, description: 'inventoryTest1\'s description', weight: 10.5 }
  const inventoryData2 = { name: 'inventory test 2', number: 53, description: 'inventoryTest2\'s description', weight: 28.6 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created inventory if we are authenticated as a user who can edit the given character', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryData, idCharacter: character.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'character'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(inventoryData.name)
        expect(response.body.number).to.equal(inventoryData.number)
        expect(response.body.description).to.equal(inventoryData.description)
        expect(response.body.weight).to.equal(inventoryData.weight)
        expect(response.body.idCharacter).to.equal(character.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryData, idCharacter: character.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idCharacter', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the given character', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryData, idCharacter: character.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a inventory in the same character with the same name already exist', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    await Pre.createInventory({ inventoryData, character })

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryData2, name: inventoryData.name, idCharacter: character.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    const inventoryDataTruncate = { ...inventoryData }
    delete inventoryDataTruncate.name

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryDataTruncate, idCharacter: character.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a description', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    const inventoryDataTruncate = { ...inventoryData }
    delete inventoryDataTruncate.description

    return agent
      .post('/api/v1/inventories')
      .send({ ...inventoryDataTruncate, idCharacter: character.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
