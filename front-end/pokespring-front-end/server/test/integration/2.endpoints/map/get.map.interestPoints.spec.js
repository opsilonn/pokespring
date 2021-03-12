/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/maps/:id/interest-points', () => {
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

  it('should return the list of all the interestPoints of the selected map if we authorized to see its universe', async () => {
    const { interestPoint, map } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ agent, interestPointData, mapData, universeData, userData })

    return agent
      .get(`/api/v1/maps/${map.id}/interest-points`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'map'])
        expect(response.body.list[0].id).to.equal(interestPoint.id)
        expect(response.body.list[0].name).to.equal(interestPointData.name)
        expect(response.body.list[0].coordinates).to.equal(interestPointData.coordinates)
        expect(response.body.list[0].idMap).to.equal(map.id)
      })
  })

  it('should return the status 401 if the selected map doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/maps/1/interest-points')
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated as a user who can see the universe of the selected map', async () => {
    const { map } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateMapInterestPoint
    )({ interestPointData, mapData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/maps/${map.id}/interest-points`)
      .expect(401)
  })
})
