/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/template-stats/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: true }
  const templateStatData = { name: 'templateStat test 1', bIsNumber: true, bIsRequired: true }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected templateStat if we are authorized to see its universe', async () => {
    const { templateStat, templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateStatData, templateCategoryData, universeData, userData })

    return agent
      .get(`/api/v1/template-stats/${templateStat.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'template-category'])
        expect(response.body.id).to.equal(templateStat.id)
        expect(response.body.name).to.equal(templateStatData.name)
        expect(response.body.bIsNumber).to.equal(templateStatData.bIsNumber)
        expect(response.body.bIsRequired).to.equal(templateStatData.bIsRequired)
        expect(response.body.idTemplateCategory).to.equal(templateCategory.id)
      })
  })

  it('should return the status 401 if the selected templateStat doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/template-stats/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected templateStat', async () => {
    const { templateStat } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ templateStatData, templateCategoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/template-stats/${templateStat.id}`)
      .expect(401)
  })
})
