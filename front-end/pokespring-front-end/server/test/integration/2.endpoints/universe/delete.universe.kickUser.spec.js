/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('DELETE /api/v1/universes/:id/users-playing/:idUser', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const userData3 = { username: 'user test 3', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and true if we are authenticated as a user who can edit the selected universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/${user.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.true
      })
  })

  it('should return the status 200 and true if we are authenticated as a user being a game master of the selected universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUserGM
    )({ agent, universe, userData: userData3 })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/${user.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.true
      })
  })

  it('should return the status 200 and false if the selected user is not in the selected universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    const { user } = await Pre.createUser({ universe, userData: userData2 })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/${user.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.false
      })
  })

  it('should return the status 200 and false if the selected user don\'t exist', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/0`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.false
      })
  })

  it('should return the status 401 if we are authenticated as a user being invite in the selected universe, but not as a game master', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.inviteUser
    )({ agent, universe, userData: userData3 })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/${user.id}`)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated but as a user not being invite in the selected universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    await Pre.pipeCreateUserLogin({ agent, userData: userData3 })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/${user.id}`)
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    return agent
      .delete(`/api/v1/universes/${universe.id}/users-playing/${user.id}`)
      .expect(401)
  })

  it('should return the status 401 if the selected universe don\'t exist', async () => {
    const { user } = await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .delete(`/api/v1/universes/1/users-playing/${user.id}`)
      .expect(401)
  })
})
