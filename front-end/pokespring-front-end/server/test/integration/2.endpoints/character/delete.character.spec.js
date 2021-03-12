/* eslint-disable no-unused-expressions */
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('DELETE /api/v1/characters/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 if we are authenticated as the user owner of the selected character', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    return agent
      .delete(`/api/v1/characters/${character.id}`)
      .expect(200)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    return agent
      .delete(`/api/v1/characters/${character.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected character doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete('/api/v1/characters/1')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated as the user owner of the selected character', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .delete(`/api/v1/characters/${character.id}`)
      .expect(401)
  })
})
