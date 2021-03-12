// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
// import params from '../../test.config.js'
// import Pre from '../../../pre-post/pre.js'
// import Post from '../../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('GET /api/v1/maps', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
//   const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
//   const mapData = { name: 'map test 1' }

//   // eslint-disable-next-line no-undef
//   before(() => Pre.createBlankDatabaseWithEmptyTables(params))

//   beforeEach(async () => {
//     const ret = await asyncPipe(
//       Pre.createExpress
//     )()
//     agent = ret.agent
//   })
//   afterEach(() => Post.truncateTables())

//   it('should return the list of all the maps', async () => {
//     const { map, universe } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.createMap
//     )({ agent, mapData, universeData, userData })

//     return agent
//       .get('/api/v1/maps')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body._links).to.have.all.keys(['self'])
//         expect(response.body.list).to.be.an('array').of.length(1)

//         expect(response.body.list[0]._links).to.have.all.keys(['self', 'universe', 'interest-points'])
//         expect(response.body.list[0].id).to.equal(map.id)
//         expect(response.body.list[0].name).to.equal(mapData.name)
//         expect(response.body.list[0].idUniverse).to.equal(universe.id)
//       })
//   })
// })
