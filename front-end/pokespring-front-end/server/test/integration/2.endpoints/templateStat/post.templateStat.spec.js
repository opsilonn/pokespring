/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/template-stats', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: true }
  const templateStatData = { name: 'templateStat test 1', bIsNumber: true, bIsRequired: true }
  const templateStatData2 = { name: 'templateStat test 2', bIsNumber: true, bIsRequired: true }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created templateStat if we are authenticated as a user who can edit its universe', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, userData, universeData })

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatData, idTemplateCategory: templateCategory.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'template-category'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(templateStatData.name)
        expect(response.body.bIsNumber).to.equal(templateStatData.bIsNumber)
        expect(response.body.bIsRequired).to.equal(templateStatData.bIsRequired)
        expect(response.body.idTemplateCategory).to.equal(templateCategory.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTemplateCategory
    )({ templateCategoryData, userData, universeData })

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatData, idTemplateCategory: templateCategory.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idTemplateCategory', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, userData, universeData })

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the given templateCategory', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTemplateCategory
    )({ templateCategoryData, userData, universeData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatData, idTemplateCategory: templateCategory.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a templateStat in the same templateCategory with the same name already exist', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, userData, universeData })

    await Pre.createTemplateStat({ templateStatData, templateCategory })

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatData2, name: templateStatData.name, idTemplateCategory: templateCategory.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, userData, universeData })

    const templateStatDataTruncate = { ...templateStatData }
    delete templateStatDataTruncate.name

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatDataTruncate, idTemplateCategory: templateCategory.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsNumber', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, userData, universeData })

    const templateStatDataTruncate = { ...templateStatData }
    delete templateStatDataTruncate.bIsNumber

    return agent
      .post('/api/v1/template-stats')
      .send({ ...templateStatDataTruncate, idTemplateCategory: templateCategory.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
