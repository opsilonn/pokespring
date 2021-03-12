// /* eslint-disable no-unused-expressions */
// import { expect } from 'chai'
// import params from '../../test.config.js'
// import Pre from '../../../pre-post/pre.js'
// import Post from '../../../pre-post/post.js'
// import asyncPipe from '../../../../utils/async-pipe.js'

// describe('GET /api/v1/template-stats', () => {
//   let agent
//   const userData = { username: 'user test 1', password: 'AzEr12ù*' }
//   const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
//   const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: true }
//   const templateStatData = { name: 'templateStat test 1', bIsNumber: true, bIsRequired: true }

//   // eslint-disable-next-line no-undef
//   before(() => Pre.createBlankDatabaseWithEmptyTables(params))

//   beforeEach(async () => {
//     const ret = await asyncPipe(
//       Pre.createExpress
//     )()
//     agent = ret.agent
//   })
//   afterEach(() => Post.truncateTables())

//   it('should return the list of all the templateStats', async () => {
//     const { templateStat, templateCategory } = await asyncPipe(
//       Pre.pipeCreateUserLogin,
//       Pre.createUniverse,
//       Pre.pipeCreateTemplateCategoryTemplateStat
//     )({ agent, templateStatData, templateCategoryData, universeData, userData })

//     return agent
//       .get('/api/v1/template-stats')
//       .expect(200)
//       .expect('Content-Type', /json/)
//       .then((response) => {
//         expect(response.body._links).to.have.all.keys(['self'])
//         expect(response.body.list).to.be.an('array').of.length(1)

//         expect(response.body.list[0]._links).to.have.all.keys(['self', 'template-category'])
//         expect(response.body.list[0].id).to.equal(templateStat.id)
//         expect(response.body.list[0].name).to.equal(templateStatData.name)
//         expect(response.body.list[0].bIsNumber).to.equal(templateStatData.bIsNumber)
//         expect(response.body.list[0].bIsRequired).to.equal(templateStatData.bIsRequired)
//         expect(response.body.list[0].idTemplateCategory).to.equal(templateCategory.id)
//       })
//   })
// })
