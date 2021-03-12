/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/interest-points', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const mapData = { name: 'map test 1' }
  const interestPointData = { name: 'interestPoint test 1', coordinates: '(1, 2)' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created interestPoint if we are authenticated as a user who can edit the universe of the given map', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createMap
    )({ agent, mapData, universeData, userData })

    return agent
      .post('/api/v1/interest-points')
      .send({ ...interestPointData, idMap: map.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'map'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(interestPointData.name)
        expect(response.body.coordinates).to.equal(interestPointData.coordinates)
        expect(response.body.idMap).to.equal(map.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createMap
    )({ mapData, universeData, userData })

    return agent
      .post('/api/v1/interest-points')
      .send({ ...interestPointData, idMap: map.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idMap', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/interest-points')
      .send({ ...interestPointData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the given map', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createMap
    )({ mapData, userData, universeData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/interest-points')
      .send({ ...interestPointData, idMap: map.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createMap
    )({ agent, mapData, userData, universeData })

    const interestPointDataTruncate = { ...interestPointData }
    delete interestPointDataTruncate.name

    return agent
      .post('/api/v1/interest-points')
      .send({ ...interestPointDataTruncate, idMap: map.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a coordinates', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createMap
    )({ agent, mapData, userData, universeData })

    const interestPointDataTruncate = { ...interestPointData }
    delete interestPointDataTruncate.coordinates

    return agent
      .post('/api/v1/interest-points')
      .send({ ...interestPointDataTruncate, idMap: map.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
