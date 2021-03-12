/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/universes/:id/users-playing', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const userData3 = { username: 'user test 3', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and true if the modification succeeded and if we are authenticated as a user who can edit the selected universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    return agent
      .put(`/api/v1/universes/${universe.id}/users-playing`)
      .send({ username: userData2.username, bIsGM: true })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.true
      })
  })

  it('should return the status 200 and false if the user was not previously invited to the selected universe and we are authenticated as a user who can edit it', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    await Pre.createUser({ userData: userData2 })

    return agent
      .put(`/api/v1/universes/${universe.id}/users-playing`)
      .send({ username: userData2.username, bIsGM: true })
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body).to.be.false
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    await Pre.createUser({ userData: userData2 })

    return agent
      .put(`/api/v1/universes/${universe.id}/users-playing`)
      .send({ username: userData2.username, bIsGM: true })
      .expect(401)
  })

  it('should return the status 401 if the selected universe doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    await Pre.createUser({ userData: userData2 })

    return agent
      .put('/api/v1/universes/1/users-playing')
      .send({ username: userData2.username, bIsGM: true })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the selected universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    await Pre.createUser({ userData: userData2 })

    await Pre.pipeCreateUserLogin({ agent, userData: userData3 })

    return agent
      .put(`/api/v1/universes/${universe.id}/users-playing`)
      .send({ username: userData2.username, bIsGM: true })
      .expect(401)
  })

  it('should return the status 400 and a error message if we don\'t provide a username', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    return agent
      .put(`/api/v1/universes/${universe.id}/users-playing`)
      .send({ bIsGM: false })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsGM', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    return agent
      .put(`/api/v1/universes/${universe.id}/users-playing`)
      .send({ username: userData2.username })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
