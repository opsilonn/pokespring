/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/characters/:id/stats', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: false }
  const templateCategoryData2 = { name: 'templateCategory test 2', bIsSpecial: true }
  const templateStatData = { name: 'templateStat test 1', bIsNumber: true, bIsRequired: true }
  const templateStatData2 = { name: 'templateStat test 2', bIsNumber: false, bIsRequired: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the stats of the selected character if we are authorized to see its universe', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateCategoryData, templateStatData, universeData, userData })

    const ret2 = await Pre.pipeCreateTemplateCategoryTemplateStat({ templateCategoryData: templateCategoryData2, templateStatData: templateStatData2, universe: ret1.universe })

    const statsData = [
      {
        id: ret1.templateStat.id,
        value: 1
      },
      {
        id: ret2.templateStat.id,
        value: '2'
      }
    ]
    const { character } = await Pre.pipeCreateCharacterStats({ characterData, statsData, universe: ret1.universe, user: ret1.user })

    return agent
      .get(`/api/v1/characters/${character.id}/stats`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.categories).to.be.an('array').of.length(2)

        expect(response.body.categories[0].id).to.equal(ret1.templateCategory.id)
        expect(response.body.categories[0].name).to.equal(templateCategoryData.name)
        expect(response.body.categories[0].order).to.be.null
        expect(response.body.categories[0].bIsSpecial).to.equal(templateCategoryData.bIsSpecial)
        expect(response.body.categories[0].stats).to.be.an('array').of.length(1)
        expect(response.body.categories[0].stats[0].id).to.equal(ret1.templateStat.id)
        expect(response.body.categories[0].stats[0].name).to.equal(templateStatData.name)
        expect(response.body.categories[0].stats[0].bIsNumber).to.equal(templateStatData.bIsNumber)
        expect(response.body.categories[0].stats[0].bIsRequired).to.equal(templateStatData.bIsRequired)
        expect(response.body.categories[0].stats[0].value).to.be.an(templateStatData.bIsNumber ? 'number' : 'string').and.equal(statsData[0].value)

        expect(response.body.categories[1].id).to.equal(ret2.templateCategory.id)
        expect(response.body.categories[1].name).to.equal(templateCategoryData2.name)
        expect(response.body.categories[1].order).to.be.null
        expect(response.body.categories[1].bIsSpecial).to.equal(templateCategoryData2.bIsSpecial)
        expect(response.body.categories[1].stats).to.be.an('array').of.length(1)
        expect(response.body.categories[1].stats[0].id).to.equal(ret2.templateStat.id)
        expect(response.body.categories[1].stats[0].name).to.equal(templateStatData2.name)
        expect(response.body.categories[1].stats[0].bIsNumber).to.equal(templateStatData2.bIsNumber)
        expect(response.body.categories[1].stats[0].bIsRequired).to.equal(templateStatData2.bIsRequired)
        expect(response.body.categories[1].stats[0].value).to.be.an(templateStatData2.bIsNumber ? 'number' : 'string').and.equal(statsData[1].value)
      })
  })

  it('should return an empty list if we are authorized to see its universe but didn\'t set any stats to the character', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, templateCategoryData, templateStatData, universeData, userData })

    const { character } = await Pre.createCharacter({ characterData, universe: ret1.universe, user: ret1.user })

    return agent
      .get(`/api/v1/characters/${character.id}/stats`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.categories).to.be.an('array').of.length(0)
      })
  })

  it('should return the status 401 if the selected character doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/characters/1/stats')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the universe of the selected character', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ templateCategoryData, templateStatData, universeData, userData })

    const ret2 = await Pre.pipeCreateTemplateCategoryTemplateStat({ templateCategoryData: templateCategoryData2, templateStatData: templateStatData2, universe: ret1.universe })

    const statsData = [
      {
        id: ret1.templateStat.id,
        value: 1
      },
      {
        id: ret2.templateStat.id,
        value: '2'
      }
    ]
    const { character } = await Pre.pipeCreateCharacterStats({ characterData, statsData, universe: ret1.universe, user: ret1.user })

    return agent
      .get(`/api/v1/characters/${character.id}/stats`)
      .expect(401)
  })
})
