/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/template-categories/:id', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: true }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 200 and the selected templateCategory if we are authorized to see its universe', async () => {
    const { templateCategory, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, universeData, userData })

    return agent
      .get(`/api/v1/template-categories/${templateCategory.id}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'template-stats'])
        expect(response.body.id).to.equal(templateCategory.id)
        expect(response.body.name).to.equal(templateCategoryData.name)
        expect(response.body.bIsSpecial).to.equal(templateCategoryData.bIsSpecial)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if the selected templateCategory doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/template-categories/1')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected templateCategory', async () => {
    const { templateCategory } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTemplateCategory
    )({ agent, templateCategoryData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/template-categories/${templateCategory.id}`)
      .expect(401)
  })
})
