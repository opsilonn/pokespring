/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/universes/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const universeData2 = { name: 'universe test 2', description: 'universeTest2\'s description', bIsPublic: true }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated universe if we are authenticated as a user who can edit it', async () => {
    const { universe, user } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    return agent
      .put(`/api/v1/universes/${universe.id}`)
      .send(universeData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.id).to.equal(universe.id)
        expect(response.body.name).to.equal(universeData2.name)
        expect(response.body.description).to.equal(universeData2.description)
        expect(response.body.bIsPublic).to.equal(universeData2.bIsPublic)
        expect(response.body.idUser).to.equal(user.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .put(`/api/v1/universes/${universe.id}`)
      .send(universeData2)
      .expect(401)
  })

  it('should return the status 401 if the selected universe doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/universes/1')
      .send(universeData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the selected universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/universes/${universe.id}`)
      .send(universeData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a universe for the same user owner with the same name already exist', async () => {
    const { universe, user } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    await Pre.createUniverse({ universeData: universeData2, user })

    return agent
      .put(`/api/v1/universes/${universe.id}`)
      .send({ ...universeData, name: universeData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    const universeDataTruncate = { ...universeData2 }
    delete universeDataTruncate.name

    return agent
      .put(`/api/v1/universes/${universe.id}`)
      .send(universeDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsPublic', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, universeData, userData })

    const universeDataTruncate = { ...universeData2 }
    delete universeDataTruncate.bIsPublic

    return agent
      .put(`/api/v1/universes/${universe.id}`)
      .send(universeDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
