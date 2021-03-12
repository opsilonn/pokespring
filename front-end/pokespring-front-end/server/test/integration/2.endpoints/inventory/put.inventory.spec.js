/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/inventories/:id', () => {
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

  it('should return the status 200 and the updated inventory if we are authenticated as a user who can edit the universe of the selected inventory', async () => {
    const { inventory, character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, characterData, inventoryData, universeData, userData })

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'character'])
        expect(response.body.id).to.equal(inventory.id)
        expect(response.body.name).to.equal(inventoryData2.name)
        expect(response.body.number).to.equal(inventoryData2.number)
        expect(response.body.description).to.equal(inventoryData2.description)
        expect(response.body.weight).to.equal(inventoryData2.weight)
        expect(response.body.idCharacter).to.equal(character.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateCharacterInventory
    )({ characterData, inventoryData, universeData, userData })

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryData2)
      .expect(401)
  })

  it('should return the status 401 if the selected inventory doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/inventories/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the character of the selected inventory', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateCharacterInventory
    )({ characterData, inventoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a inventory in the same character with the same name already exist', async () => {
    const { inventory, character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, inventoryData, characterData, universeData, userData })

    await Pre.createInventory({ inventoryData: inventoryData2, character })

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send({ ...inventoryData, name: inventoryData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, inventoryData, characterData, universeData, userData })

    const inventoryDataTruncate = { ...inventoryData2 }
    delete inventoryDataTruncate.name

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a number', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, inventoryData, characterData, universeData, userData })

    const inventoryDataTruncate = { ...inventoryData2 }
    delete inventoryDataTruncate.number

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a description', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, inventoryData, characterData, universeData, userData })

    const inventoryDataTruncate = { ...inventoryData2 }
    delete inventoryDataTruncate.description

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a weight', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, inventoryData, characterData, universeData, userData })

    const inventoryDataTruncate = { ...inventoryData2 }
    delete inventoryDataTruncate.weight

    return agent
      .put(`/api/v1/inventories/${inventory.id}`)
      .send(inventoryDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
