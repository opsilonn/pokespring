/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/characters/:id/status', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description' }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and true if we are trying to change the sheet\'s status of the selected character as Refused or Validated and we are authenticated as a user who can edit the universe of this character', async () => {
    const { character, universe } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUserGM
    )({ agent, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ sheetStatus: 2 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.true
      })
  })

  it('should return the status 200 and false if we are trying to change the sheet\'s status of the selected character as WIP or Waiting Validation and we are authenticated as a user who can edit the universe of that character but is not its owner', async () => {
    const { character, universe } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUserGM
    )({ agent, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ sheetStatus: 1 })
      .expect(401)
  })

  it('should return the status 200 and true if we are trying to change the sheet\'s status of the selected character as WIP or Waiting Validation and we are authenticated as the user owner of this character', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createCharacter,
      Pre.inviteUser
    )({ agent, characterData, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ sheetStatus: 1 })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.true
      })
  })

  it('should return the status 401 and false if we are trying to change the sheet\'s status of the selected character to an invalid value and we are authenticated as the user owner of this character', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUser,
      Pre.createCharacter
    )({ agent, characterData, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ sheetStatus: 5 })
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .expect(401)
  })

  it('should return the status 401 if the selected character doesn\'t exists', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .put('/api/v1/characters/1/status')
      .send({ sheetStatus: 1 })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected character or its user owner', async () => {
    const { character, universe } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUser
    )({ agent, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ sheetStatus: 1 })
      .expect(401)
  })

  it('should return the status 401 and a error message if we don\'t provide a sheetStatus and we are authentified as a user who can edit the universe of the selected character', async () => {
    const { character, universe } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUserGM
    )({ agent, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ })
      .expect(401)
  })

  it('should return the status 401 and a error message if we don\'t provide a sheetStatus and we are authentified as a user owner of the selected character', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUser,
      Pre.createCharacter
    )({ agent, characterData, universe, userData: userData2 })

    return agent
      .put(`/api/v1/characters/${character.id}/status`)
      .send({ })
      .expect(401)
  })
})
