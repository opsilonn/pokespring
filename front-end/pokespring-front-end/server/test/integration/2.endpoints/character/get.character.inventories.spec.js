/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/characters/:id/inventories', () => {
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

  it('should return the list of all the inventories of the selected character if we are authorized to see its universe', async () => {
    const { character, inventory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateCharacterInventory
    )({ agent, characterData, inventoryData, universeData, userData })

    return agent
      .get(`/api/v1/characters/${character.id}/inventories`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'character'])
        expect(response.body.list[0].id).to.equal(inventory.id)
        expect(response.body.list[0].name).to.equal(inventoryData.name)
        expect(response.body.list[0].number).to.equal(inventoryData.number)
        expect(response.body.list[0].description).to.equal(inventoryData.description)
        expect(response.body.list[0].weight).to.equal(inventoryData.weight)
        expect(response.body.list[0].idCharacter).to.equal(character.id)
      })
  })

  it('should return the status 401 if the selected character doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/characters/1/inventories')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected character', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateCharacterInventory
    )({ characterData, inventoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/characters/${character.id}/inventories`)
      .expect(401)
  })
})
