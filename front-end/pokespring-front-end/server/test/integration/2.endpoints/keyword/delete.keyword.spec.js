// /* eslint-disable no-unused-expressions */
// import params from '../../test.config.js'
// import Pre from '../../pre-post/pre.js'
// import Post from '../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('DELETE /api/v1/keywords/:id', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
//   const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
//   const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
//   const topicData = { name: 'topic test 1' }
//   const subTopicData = { name: 'subTopic test 1' }
//   const articleData = { title: 'article test 1', content: 'articleTest1\'s content' }
//   const keywordData = { name: 'keyword test 1' }

//   // eslint-disable-next-line no-undef
//   before(() => Pre.createBlankDatabaseWithEmptyTables(params))

//   beforeEach(async () => {
//     const ret = await asyncPipe(
//       Pre.createExpress
//     )()
//     agent = ret.agent
//   })
//   afterEach(() => Post.truncateTables())

//   it('should return the status 200 if we are authenticated as a user being a game master of the universe of the selected keyword', async () => {
//     const { keyword } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.pipeCreateTopicSubTopicArticleKeyword
//     )({ agent, articleData, keywordData, subTopicData, topicData, universeData, userData })

//     return agent
//       .delete(`/api/v1/keywords/${keyword.id}`)
//       .expect(200)
//   })

//   it('should return the status 401 if we are not authenticated', () =>
//     agent
//       .delete('/api/v1/keywords/1')
//       .expect(401)
//   )

//   it('should return the status 401 if we are authenticated but not as a user being a game master of the universe of the selected keyword', async () => {
//     const { keyword } = await asyncPipe(
//       Pre.pipeCreateUserUniverse,
//       Pre.pipeCreateTopicSubTopicArticle
//     )({ agent, articleData, keywordData, subTopicData, topicData, universeData, userData })

//     await asyncPipe(
//       Pre.pipeCreateUserLogin
//     )({ agent, userData: userData2 })

//     return agent
//       .delete(`/api/v1/keywords/${keyword.id}`)
//       .expect(401)
//   })
// })
