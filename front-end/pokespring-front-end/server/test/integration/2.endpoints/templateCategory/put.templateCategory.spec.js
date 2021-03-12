/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/template-categories/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: true }
  const templateCategoryData2 = { name: 'templateCategory test 2', bIsSpecial: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the updated templateCategory if we are authenticated as a user who can edit its universe', async () => {
    const { templateCategory, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, universeData, userData })

    return agent
      .put(`/api/v1/template-categories/${templateCategory.id}`)
      .send(templateCategoryData2)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'template-stats'])
        expect(response.body.id).to.equal(templateCategory.id)
        expect(response.body.name).to.equal(templateCategoryData2.name)
        expect(response.body.bIsSpecial).to.equal(templateCategoryData2.bIsSpecial)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTemplateCategory
    )({ templateCategoryData, universeData, userData })

    return agent
      .put(`/api/v1/template-categories/${templateCategory.id}`)
      .send(templateCategoryData2)
      .expect(401)
  })

  it('should return the status 401 if the selected templateCategory doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/template-categories/1')
      .send(templateCategoryData2)
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the universe of the selected templateCategory', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTemplateCategory
    )({ templateCategoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .put(`/api/v1/template-categories/${templateCategory.id}`)
      .send(templateCategoryData2)
      .expect(401)
  })

  it('should return the status 400 and a error message if a templateCategory in the same universe with the same name already exist', async () => {
    const { templateCategory, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, universeData, userData })

    await Pre.createTemplateCategory({ templateCategoryData: templateCategoryData2, universe })

    return agent
      .put(`/api/v1/template-categories/${templateCategory.id}`)
      .send({ ...templateCategoryData, name: templateCategoryData2.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, universeData, userData })

    const templateCategoryDataTruncate = { ...templateCategoryData2 }
    delete templateCategoryDataTruncate.name

    return agent
      .put(`/api/v1/template-categories/${templateCategory.id}`)
      .send(templateCategoryDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a bIsSpecial', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, universeData, userData })

    const templateCategoryDataTruncate = { ...templateCategoryData2 }
    delete templateCategoryDataTruncate.bIsSpecial

    return agent
      .put(`/api/v1/template-categories/${templateCategory.id}`)
      .send(templateCategoryDataTruncate)
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
