/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('PUT /api/v1/characters/:id/stats', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
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

  it('should return the status 200 and all the new stats of the selected character if we are authenticated as the user owner of it', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ agent, characterData, templateCategoryData, templateStatData, universeData, userData })

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

    return agent
      .put(`/api/v1/characters/${ret1.character.id}/stats`)
      .send(statsData)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(2)

        expect(response.body.list[0]._links).to.have.all.keys(['character', 'template-stats'])
        expect(response.body.list[0].value).to.equal(statsData[0].value.toString())

        expect(response.body.list[1]._links).to.have.all.keys(['character', 'template-stats'])
        expect(response.body.list[1].value).to.equal(statsData[1].value.toString())
      })
  })

  it('should return the status 401 if we are not authenticated', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ characterData, templateCategoryData, templateStatData, universeData, userData })

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

    return agent
      .put(`/api/v1/characters/${ret1.character.id}/stats`)
      .send(statsData)
      .expect(401)
  })

  it('should return the status 401 if we are not authenticated as the user owner of the selected character', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ characterData, templateCategoryData, templateStatData, universeData, userData })

    const ret2 = await Pre.pipeCreateTemplateCategoryTemplateStat({ templateCategoryData: templateCategoryData2, templateStatData: templateStatData2, universe: ret1.universe })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

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

    return agent
      .put(`/api/v1/characters/${ret1.character.id}/stats`)
      .send(statsData)
      .expect(401)
  })

  it('should return the status 401 if the selected character doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .put('/api/v1/characters/1/stats')
      .expect(401)
  })

  it('should return the status 400 if we are authenticated as a user who can edit the universe of the selected character but the given stats correspond to none templateStats', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createCharacter
    )({ agent, characterData, universeData, userData })

    const statsData = [
      {
        id: 1,
        value: 1
      },
      {
        id: 2,
        value: '2'
      }
    ]

    return agent
      .put(`/api/v1/characters/${character.id}/stats`)
      .send(statsData)
      .expect(400)
  })
})
