/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/characters/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }
  const characterData2 = { name: 'character test 2', backstory: 'characterTest2\'s backstory', sheetStatus: 1 }
  const characterData3 = { name: 'character test 3', backstory: 'characterTest3\'s backstory', bIsAlive: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated character if it exists and if we are authenticated as the user owner of the selected character', async () => {
    const { character, universe, user } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    return agent
      .put(`/api/v1/characters/${character.id}`)
      .send(characterData3)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'user', 'universe', 'groups', 'inventories', 'stats'])
        expect(response.body.id).to.equal(character.id)
        expect(response.body.name).to.equal(characterData3.name)
        expect(response.body.backstory).to.equal(characterData3.backstory)
        expect(response.body.bIsAlive).to.equal(characterData3.bIsAlive)
        expect(response.body.sheetStatus).to.equal(characterData.sheetStatus)
        expect(response.body.idUser).to.equal(user.id)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    return agent
      .put(`/api/v1/characters/${character.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected character doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/characters/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as the user owner of the selected character', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}`)
      .expect(401)
  })

  it('should return the status 400 and a error message if a character in the same universe with the same name already exist', async () => {
    const { character, user, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    await Pre.createCharacter({ characterData: characterData2, user, universe })

    return agent
      .put(`/api/v1/characters/${character.id}`)
      .send({ ...characterData3, name: characterData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    const characterDataTruncate = { ...characterData3 }
    delete characterDataTruncate.name

    return agent
      .put(`/api/v1/characters/${character.id}`)
      .send(characterDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsAlive', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    const characterDataTruncate = { ...characterData3 }
    delete characterDataTruncate.bIsAlive

    return agent
      .put(`/api/v1/characters/${character.id}`)
      .send(characterDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
