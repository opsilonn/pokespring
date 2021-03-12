/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

import CharacterPolicy from '../../../../policies/character.policy.js'

describe('Character\'s policy verifyStats', () => {
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description' }
  const universeData2 = { name: 'universe test 2', description: 'universeTest2\'s description' }
  const templateCategoryData = { name: 'templateCategory test 1', bIsSpecial: true }
  const templateCategoryData2 = { name: 'templateCategory test 2', bIsSpecial: false }
  const templateStatData = { name: 'templateStat test 1', bIsNumber: true, bIsRequired: true }
  const templateStatData2 = { name: 'templateStat test 2', bIsNumber: false, bIsRequired: false }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  afterEach(() => Post.truncateTables())

  it('should return true if the array of stats matchs the templateStats of the universe of the character', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ characterData, templateCategoryData, templateStatData, universeData, userData })

    const ret2 = await Pre.pipeCreateTemplateCategoryTemplateStat({ templateCategoryData: templateCategoryData2, templateStatData: templateStatData2, universe: ret1.universe })

    expect(await CharacterPolicy.verifyStats(undefined, ret1.character.id, [
      {
        id: ret1.templateStat.id,
        value: 1
      },
      {
        id: ret2.templateStat.id,
        value: '2'
      }
    ])).to.be.true
  })

  it('should return false if the array of stats matchs the templateStats of another universe than the one of the character', async () => {
    const ret1 = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ templateCategoryData, templateStatData, universeData, userData })

    const ret2 = await Pre.pipeCreateTemplateCategoryTemplateStat({ templateCategoryData: templateCategoryData2, templateStatData: templateStatData2, universe: ret1.universe })

    const { character } = await asyncPipe(
      Pre.createUniverse,
      Pre.createCharacter
    )({ characterData, universeData: universeData2, user: ret1.user })

    expect(await CharacterPolicy.verifyStats(undefined, character.id, [
      {
        id: ret1.templateStat.id,
        value: 1
      },
      {
        id: ret2.templateStat.id,
        value: '2'
      }
    ])).to.be.false
  })

  it('should return false if one stat of the array of stats don\'t matchs the templateStats of the universe of the character', async () => {
    const { character, templateStat } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter,
      Pre.pipeCreateTemplateCategoryTemplateStat
    )({ characterData, templateCategoryData, templateStatData, universeData, userData })

    expect(await CharacterPolicy.verifyStats(undefined, character.id, [
      {
        id: templateStat.id,
        value: 1
      },
      {
        id: 0,
        value: '2'
      }
    ])).to.be.false
  })

  it('should return true if the array of stats is empty', async () => {
    const { character } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createCharacter
    )({ characterData, universeData, userData })

    expect(await CharacterPolicy.verifyStats(undefined, character.id, [])).to.be.true
  })
})
