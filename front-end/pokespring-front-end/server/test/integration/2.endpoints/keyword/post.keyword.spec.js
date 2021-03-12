// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
// import params from '../../test.config.js'
// import Pre from '../../pre-post/pre.js'
// import Post from '../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('POST /api/v1/keywords', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
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

//   it('should return the status 201 and the new created article if we are authenticated as a user being a game master of the universe of the given subTopic', async () => {
//     const { article } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.pipeCreateTopicSubTopic
//     )({ agent, subTopicData, topicData, userData, universeData })

//     return agent
//       .post('/api/v1/keywords')
//       .send({ ...keywordData, idArticle: article.id })
//       .expect(201)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body._links).to.have.all.keys(['article'])
//         expect(response.body.name).to.equal(keywordData.name)
//         expect(response.body.idArticle).to.equal(article.id)
//       })
//   })

//   /*
//   it('should return the status 400 and a error message if a user with the same name already exist', async () => {
//     await asyncPipe(
//       Pre.createUser
//     )({ userData })

//     return agent
//       .post('/api/v1/users')
//       .send(userData)
//       .expect('Content-Type', /json/)
//       .expect(400)
//   })

//   it('should return the status 400 and a error message if we don\'t provide a username', () =>
//     agent
//       .post('/api/v1/users')
//       .send({ password: userData.password })
//       .expect('Content-Type', /json/)
//       .expect(400)
//   )

//   it('should return the status 400 and a error message if we don\'t provide a password', () =>
//     agent
//       .post('/api/v1/users')
//       .send({ username: userData.username })
//       .expect('Content-Type', /json/)
//       .expect(400)
//   )
//   */
// })
