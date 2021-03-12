/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/maps/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const mapData = { name: 'map test 1' }
  const mapData2 = { name: 'map test 2' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated map if we are authenticated as a user who can edit the universe of the selected map', async () => {
    const { map, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createMap
    )({ agent, mapData, universeData, userData })

    return agent
      .put(`/api/v1/maps/${map.id}`)
      .send(mapData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'interest-points'])
        expect(response.body.id).to.equal(map.id)
        expect(response.body.name).to.equal(mapData2.name)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createMap
    )({ mapData, universeData, userData })

    return agent
      .put(`/api/v1/maps/${map.id}`)
      .send(mapData2)
      .expect(401)
  })

  it('should return the status 401 if the selected map doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/maps/1')
      .send(mapData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected map', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createMap
    )({ mapData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/maps/${map.id}`)
      .send(mapData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a map in the same universe with the same name already exist', async () => {
    const { map, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createMap
    )({ agent, mapData, universeData, userData })

    await Pre.createMap({ mapData: mapData2, universe })

    return agent
      .put(`/api/v1/maps/${map.id}`)
      .send({ ...mapData, name: mapData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createMap
    )({ agent, mapData, universeData, userData })

    const mapDataTruncate = { ...mapData2 }
    delete mapDataTruncate.name

    return agent
      .put(`/api/v1/maps/${map.id}`)
      .send(mapDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
