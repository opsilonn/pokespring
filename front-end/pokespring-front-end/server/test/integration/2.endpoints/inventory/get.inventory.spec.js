/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/inventories/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }
  const inventoryData = { name: 'inventory test 1', number: 42, description: 'inventoryTest1\'s description', weight: 10.5 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected inventory if we are authorized to see its universe', async () => {
    const { inventory, character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, characterData, inventoryData, universeData, userData })

    return agent
      .get(`/api/v1/inventories/${inventory.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'character'])
        expect(response.body.id).to.equal(inventory.id)
        expect(response.body.name).to.equal(inventoryData.name)
        expect(response.body.number).to.equal(inventoryData.number)
        expect(response.body.description).to.equal(inventoryData.description)
        expect(response.body.weight).to.equal(inventoryData.weight)
        expect(response.body.idCharacter).to.equal(character.id)
      })
  })

  it('should return the status 401 if the selected inventory doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete('/api/v1/inventories/1')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated as a user who can see the universe of the selected inventory', async () => {
    const { inventory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateCharacterInventory
    )({ characterData, inventoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .delete(`/api/v1/inventories/${inventory.id}`)
      .expect(401)
  })
})
