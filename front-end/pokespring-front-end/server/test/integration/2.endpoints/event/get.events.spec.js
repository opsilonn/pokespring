// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
// import params from '../../test.config.js'
// import Pre from '../../../pre-post/pre.js'
// import Post from '../../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('GET /api/v1/events', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
//   const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
//   const timelineData = { name: 'timeline test 1', description: 'timelineTest1\'s description', bIsPublic: false }
//   const eventData = { name: 'event test 1', year: 2020, month: 12, day: 30, description: 'eventTest1\'s description' }

//   // eslint-disable-next-line no-undef
//   before(() => Pre.createBlankDatabaseWithEmptyTables(params))

//   beforeEach(async () => {
//     const ret = await asyncPipe(
//       Pre.createExpress
//     )()
//     agent = ret.agent
//   })
//   afterEach(() => Post.truncateTables())

//   it('should return the list of all the events', async () => {
//     const { event, timeline } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.pipeCreateTimelineEvent
//     )({ agent, eventData, timelineData, universeData, userData })

//     return agent
//       .get('/api/v1/events')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body._links).to.have.all.keys(['self'])
//         expect(response.body.list).to.be.an('array').of.length(1)

//         expect(response.body.list[0]._links).to.have.all.keys(['self', 'timeline'])
//         expect(response.body.list[0].id).to.equal(event.id)
//         expect(response.body.list[0].name).to.equal(eventData.name)
//         expect(response.body.list[0].year).to.equal(eventData.year)
//         expect(response.body.list[0].month).to.equal(eventData.month)
//         expect(response.body.list[0].day).to.equal(eventData.day)
//         expect(response.body.list[0].description).to.equal(eventData.description)
//         expect(response.body.list[0].idTimeline).to.equal(timeline.id)
//       })
//   })
// })
