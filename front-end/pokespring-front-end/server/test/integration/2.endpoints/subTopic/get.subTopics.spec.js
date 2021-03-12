// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
// import params from '../../test.config.js'
// import Pre from '../../../pre-post/pre.js'
// import Post from '../../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('GET /api/v1/sub-topics', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
//   const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
//   const topicData = { name: 'topic test 1' }
//   const subTopicData = { name: 'subTopic test 1' }

//   // eslint-disable-next-line no-undef
//   before(() => Pre.createBlankDatabaseWithEmptyTables(params))

//   beforeEach(async () => {
//     const ret = await asyncPipe(
//       Pre.createExpress
//     )()
//     agent = ret.agent
//   })
//   afterEach(() => Post.truncateTables())

//   it('should return the list of all the subTopics', async () => {
//     const { subTopic, topic } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.pipeCreateTopicSubTopic
//     )({ agent, subTopicData, topicData, universeData, userData })

//     return agent
//       .get('/api/v1/sub-topics')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body._links).to.have.all.keys(['self'])
//         expect(response.body.list).to.be.an('array').of.length(2)

//         expect(response.body.list[0]._links).to.have.all.keys(['self', 'topic', 'articles'])
//         expect(response.body.list[0].name).to.equal('[OTTERWORLDS-SUBTOPIC-SYSTEM]')
//         expect(response.body.list[0].id).to.be.an('number')
//         expect(response.body.list[0].order).to.equal(0)
//         expect(response.body.list[0].idTopic).to.be.an('number')

//         expect(response.body.list[1]._links).to.have.all.keys(['self', 'topic', 'articles'])
//         expect(response.body.list[1].id).to.equal(subTopic.id)
//         expect(response.body.list[1].name).to.equal(subTopicData.name)
//         expect(response.body.list[1].idTopic).to.equal(topic.id)
//       })
//   })
// })
