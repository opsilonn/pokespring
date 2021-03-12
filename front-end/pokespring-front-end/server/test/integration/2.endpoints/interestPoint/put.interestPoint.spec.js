/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/interest-points/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const mapData = { name: 'map test 1' }
  const interestPointData = { name: 'interestPoint test 1', coordinates: '(1, 2)' }
  const interestPointData2 = { name: 'interestPoint test 2', coordinates: '(3, 4)' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated interestPoint if we are authenticated as a user who can edit the universe of the selected interestPoint', async () => {
    const { interestPoint, map } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ agent, interestPointData, mapData, universeData, userData })

    return agent
      .put(`/api/v1/interest-points/${interestPoint.id}`)
      .send(interestPointData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'map'])
        expect(response.body.id).to.equal(interestPoint.id)
        expect(response.body.name).to.equal(interestPointData2.name)
        expect(response.body.coordinates).to.equal(interestPointData2.coordinates)
        expect(response.body.idMap).to.equal(map.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { interestPoint } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ interestPointData, mapData, universeData, userData })

    return agent
      .put(`/api/v1/interest-points/${interestPoint.id}`)
      .send(interestPointData2)
      .expect(401)
  })

  it('should return the status 401 if the selected interestPoint doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/interest-points/1')
      .send(interestPointData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected interestPoint', async () => {
    const { interestPoint } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ interestPointData, mapData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/interest-points/${interestPoint.id}`)
      .send(interestPointData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { interestPoint } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ agent, interestPointData, mapData, universeData, userData })

    const interestPointDataTruncate = { ...interestPointData }
    delete interestPointDataTruncate.name

    return agent
      .put(`/api/v1/interest-points/${interestPoint.id}`)
      .send(interestPointDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a coordinates', async () => {
    const { interestPoint } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ agent, interestPointData, mapData, universeData, userData })

    const interestPointDataTruncate = { ...interestPointData }
    delete interestPointDataTruncate.coordinates

    return agent
      .put(`/api/v1/interest-points/${interestPoint.id}`)
      .send(interestPointDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
