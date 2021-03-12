/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/template-stats/:id', () => {
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

  it('should return the status 200 and the updated templateStat if we are authenticated as a user who can edit it universe', async () => {
    const { templateStat, templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateStatData, templateCategoryData, universeData, userData })

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send(templateStatData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'template-category'])
        expect(response.body.id).to.equal(templateStat.id)
        expect(response.body.name).to.equal(templateStatData2.name)
        expect(response.body.bIsNumber).to.equal(templateStatData2.bIsNumber)
        expect(response.body.bIsRequired).to.equal(templateStatData2.bIsRequired)
        expect(response.body.idTemplateCategory).to.equal(templateCategory.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { templateStat } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ templateStatData, templateCategoryData, universeData, userData })

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send(templateStatData2)
      .expect(401)
  })

  it('should return the status 401 if the selected templateStat doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/template-stats/1')
      .send(templateStatData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected templateStat', async () => {
    const { templateStat } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ templateStatData, templateCategoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send(templateStatData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a templateStat in the same templateCategory with the same name already exist', async () => {
    const { templateStat, templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateStatData, templateCategoryData, universeData, userData })

    await Pre.createTemplateStat({ templateStatData: templateStatData2, templateCategory })

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send({ ...templateStatData, name: templateStatData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { templateStat } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateStatData, templateCategoryData, universeData, userData })

    const templateStatDataTruncate = { ...templateStatData2 }
    delete templateStatDataTruncate.name

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send(templateStatDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsNumber', async () => {
    const { templateStat } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateStatData, templateCategoryData, universeData, userData })

    const templateStatDataTruncate = { ...templateStatData2 }
    delete templateStatDataTruncate.bIsNumber

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send(templateStatDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsRequired', async () => {
    const { templateStat } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateStatData, templateCategoryData, universeData, userData })

    const templateStatDataTruncate = { ...templateStatData2 }
    delete templateStatDataTruncate.bIsRequired

    return agent
      .put(`/api/v1/template-stats/${templateStat.id}`)
      .send(templateStatDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
