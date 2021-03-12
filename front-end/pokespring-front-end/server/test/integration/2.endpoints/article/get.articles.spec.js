// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
// import params from '../../test.config.js'
// import Pre from '../../../pre-post/pre.js'
// import Post from '../../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('GET /api/v1/articles', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
//   const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
//   const topicData = { name: 'topic test 1' }
//   const subTopicData = { name: 'subTopic test 1' }
//   const articleData = { title: 'article test 1', content: 'articleTest1\'s content' }

//   // eslint-disable-next-line no-undef
//   before(() => Pre.createBlankDatabaseWithEmptyTables(params))

//   beforeEach(async () => {
//     const ret = await asyncPipe(
//       Pre.createExpress
//     )()
//     agent = ret.agent
//   })
//   afterEach(() => Post.truncateTables())

//   it('should return the list of all the articles', async () => {
//     const { article, subTopic } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.pipeCreateTopicSubTopicArticle
//     )({ agent, articleData, subTopicData, topicData, universeData, userData })

//     return agent
//       .get('/api/v1/articles')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body._links).to.have.all.keys(['self'])
//         expect(response.body.list).to.be.an('array').of.length(1)

//         expect(response.body.list[0]._links).to.have.all.keys(['self', 'sub-topic', 'keywords'])
//         expect(response.body.list[0].id).to.equal(article.id)
//         expect(response.body.list[0].title).to.equal(articleData.title)
//         expect(response.body.list[0].content).to.equal(articleData.content)
//         expect(response.body.list[0].idSubTopic).to.equal(subTopic.id)
//       })
//   })
// })
