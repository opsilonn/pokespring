/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/template-categories', () => {
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

  it('should return the status 201 and the new created templateCategory if we are authenticated as a user who can edit the given universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    return agent
      .post('/api/v1/template-categories')
      .send({ ...templateCategoryData, idUniverse: universe.id })
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'universe', 'template-stats'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(templateCategoryData.name)
        expect(response.body.bIsSpecial).to.equal(templateCategoryData.bIsSpecial)
        expect(response.body.idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .post('/api/v1/template-categories')
      .send({ ...templateCategoryData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 401 if we don\'t provide a idUniverse', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/template-categories')
      .send({ ...templateCategoryData })
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t edit the given universe', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .post('/api/v1/template-categories')
      .send({ ...templateCategoryData, idUniverse: universe.id })
      .expect(401)
  })

  it('should return the status 400 and a error message if a templateCategory in the same universe with the same name already exist', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    await Pre.createTemplateCategory({ templateCategoryData, universe })

    return agent
      .post('/api/v1/template-categories')
      .send({ ...templateCategoryData2, name: templateCategoryData.name, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    const templateCategoryDataTruncate = { ...templateCategoryData }
    delete templateCategoryDataTruncate.name

    return agent
      .post('/api/v1/template-categories')
      .send({ ...templateCategoryDataTruncate, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
