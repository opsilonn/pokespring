import express from 'express'
import expressSession from 'express-session'
import request from 'supertest'

import Article from '../../models/article.model.js'
import Character from '../../models/character.model.js'
import Event from '../../models/event.model.js'
// import Group from '../../../models/group.model.js'
import InterestPoint from '../../models/interestPoint.model.js'
import Inventory from '../../models/inventory.model.js'
// import Keyword from '../../../models/keyword.model.js'
import Map from '../../models/map.model.js'
import SubTopic from '../../models/subTopic.model.js'
import TemplateCategory from '../../models/templateCategory.model.js'
import TemplateStat from '../../models/templateStat.model.js'
import Timeline from '../../models/timeline.model.js'
import Topic from '../../models/topic.model.js'
import Universe from '../../models/universe.model.js'
import User from '../../models/user.model.js'

import mariadb from '../../services/mariadb.services.js'
import buildTables from '../../utils/build-tables.js'
import resetDatabase from '../../utils/reset-database.js'
import { apiRoute, apiRouter } from '../../api/routes.js'
import asyncPipe from '../../utils/async-pipe.js'

export default class Pre {
  /**
   * @param {{ host: String, database: String, user: String, password: String }} params
   */
  static async createBlankDatabaseWithEmptyTables (params) {
    try {
      await resetDatabase(params)
      await buildTables(params)
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err)
    } finally {
      mariadb.close()
      await mariadb.init(params)
    }
  }

  static createExpress (params = {}) {
    const app = express()
    const appSession = expressSession({
      secret: 'testing',
      resave: true,
      saveUninitialized: true
    })
    app.use(appSession)
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))

    app.use(apiRoute, apiRouter)

    return { agent: request.agent(app), ...params }
  }

  /**
   * @param { { articleData: { title: String, content: String }, subTopic: SubTopic } } param0
   */
  static async createArticle ({ articleData, subTopic, ...params }) {
    const article = await Article.add({ ...articleData, idSubTopic: subTopic.id })

    return { article, subTopic, ...params }
  }

  /**
   * @param { { characterData: { name: String, backstory: String?, sheetStatus: Number }, universe: Universe, user: User } } param0
   */
  static async createCharacter ({ characterData, universe, user, ...params }) {
    const character = await Character.add({ ...characterData, idUniverse: universe.id, idUser: user.id })

    return { character, universe, user, ...params }
  }

  /**
   * @param { { eventData: { name: String, year: Number, month: Number, day: Number, description: String }, timeline: Timeline } } param0
   */
  static async createEvent ({ eventData, timeline, ...params }) {
    const event = await Event.add({ ...eventData, idTimeline: timeline.id })

    return { event, timeline, ...params }
  }

  // /**
  //  * @param { { groupData: { name: String }, universe: Universe } } param0
  //  */
  // static async createGroup ({ groupData, universe, ...params }) {
  //   const group = await Group.add({ ...groupData, idUniverse: universe.id })

  //   return { group, universe, ...params }
  // }

  /**
   * @param { { interestPointData: { name: String, coordinates: String }, map: Map } } param0
   */
  static async createInterestPoint ({ interestPointData, map, ...params }) {
    const interestPoint = await InterestPoint.add({ ...interestPointData, idMap: map.id })

    return { interestPoint, map, ...params }
  }

  /**
   * @param { { character: Character, inventoryData: { name: String, number: Number, description: String, weight: Number } } } param0
   */
  static async createInventory ({ character, inventoryData, ...params }) {
    const inventory = await Inventory.add({ ...inventoryData, idCharacter: character.id })

    return { character, inventory, ...params }
  }

  // /**
  //  * @param { { article: Article, keywordData: { name: String } } } param0
  //  */
  // static async createKeyword ({ article, keywordData, ...params }) {
  //   const keyword = await Keyword.add({ ...keywordData, idArticle: article.id })

  //   return { article, keyword, ...params }
  // }

  /**
   * @param { { mapData: { name: String }, universe: Universe } } param0
   */
  static async createMap ({ mapData, universe, ...params }) {
    const map = await Map.add({ ...mapData, idUniverse: universe.id })

    return { map, universe, ...params }
  }

  /**
   * @param { { subTopicData: { name: String, order: Number }, topic: Topic } } param0
   */
  static async createSubTopic ({ subTopicData, topic, ...params }) {
    const subTopic = await SubTopic.add({ ...subTopicData, idTopic: topic.id })

    return { subTopic, topic, ...params }
  }

  /**
   * @param { { templateCategoryData: { name: String, order: Number?, bIsSpecial: Boolean? }, universe: Universe } } param0
   */
  static async createTemplateCategory ({ templateCategoryData, universe, ...params }) {
    const templateCategory = await TemplateCategory.add({ ...templateCategoryData, idUniverse: universe.id })

    return { templateCategory, universe, ...params }
  }

  /**
   * @param { { templateCategory: TemplateCategory, templateStatData: { name: String, bIsNumber: Boolean, bIsRequired: Boolean? } } } param0
   */
  static async createTemplateStat ({ templateCategory, templateStatData, ...params }) {
    const templateStat = await TemplateStat.add({ ...templateStatData, idTemplateCategory: templateCategory.id })

    return { templateCategory, templateStat, ...params }
  }

  /**
   * @param { { timelineData: { name: String, description: String, bIsPublic: Boolean }, universe: Universe } } param0
   */
  static async createTimeline ({ timelineData, universe, ...params }) {
    const timeline = await Timeline.add({ ...timelineData, idUniverse: universe.id })

    return { timeline, universe, ...params }
  }

  /**
   * @param { { topicData: { name: String, order: Number? }, universe: Universe } } param0
   */
  static async createTopic ({ topicData, universe, ...params }) {
    const topic = await Topic.add({ ...topicData, idUniverse: universe.id })

    return { topic, universe, ...params }
  }

  /**
   * @param { { universeData: { name: String, description: String?, bIsPublic: Boolean? }, user: User } } param0
   */
  static async createUniverse ({ universeData, user, ...params }) {
    const universe = await Universe.add({ ...universeData, idUser: user.id })

    return { universe, user, ...params }
  }

  /**
   * @param { { userData: { username: String, password: String } } } param0
   */
  static async createUser ({ userData, ...params }) {
    const user = await User.add(userData)

    return { user, userData, ...params }
  }

  /**
   * @param { { agent: request.SuperAgentTest, userData: { username: String, password: String } } } param0
   */
  static async loginUser ({ agent, userData, ...params }) {
    await agent
      .post(apiRoute + 'auth/login')
      .send({ username: userData.username, password: userData.password })

    return { agent, userData, ...params }
  }

  /**
   * @param { { universe: Universe, user: User } } param0
   */
  static async inviteUser ({ universe, user, ...params }) {
    if (!await Universe.inviteUser(universe.id, user.id, false)) {
      throw new Error(`Could not invite user ${user.id} to universe ${universe.id}`)
    }

    return { universe, user, ...params }
  }

  /**
   * @param { { universe: Universe, user: User } } param0
   */
  static async inviteUserGM ({ universe, user, ...params }) {
    if (!await Universe.inviteUser(universe.id, user.id, true)) {
      throw new Error(`Could not invite user ${user.id} to universe ${universe.id}`)
    }

    return { universe, user, ...params }
  }

  /**
   * @param { { character: Character, statsData: { id: Number, value: String|Number }[] } } param0
   */
  static async setCharacterStats ({ character, statsData, ...params }) {
    await Character.updateStats(character.id, statsData)

    return { character, ...params }
  }

  /**
   * @param { { agent: request.SuperAgentTest, userData: { username: String, password: String } } } param0
   * @returns { Promise<{ agent: request.SuperAgentTest, user: User, userData: { username: String, password: String } }> }
   */
  static async pipeCreateUserLogin ({ agent, userData, ...params }) {
    return await asyncPipe(
      Pre.createUser,
      Pre.loginUser
    )({ agent, userData, ...params })
  }

  /**
   * @param { { universeData: { name: String, description: String?, bIsPublic: Boolean? }, userData: { username: String, password: String } } } param0
   * @returns { Promise<{ universe: Universe, user: User, userData: { username: String, password: String } }> }
   */
  static async pipeCreateUserUniverse ({ universeData, userData, ...params }) {
    return await asyncPipe(
      Pre.createUser,
      Pre.createUniverse
    )({ universeData, userData, ...params })
  }

  /**
   * @param { { eventData: { name: String, year: Number, month: Number, day: Number, description: String }, timelineData: { name: String, description: String, bIsPublic: Boolean }, universe: Universe } } param0
   * @returns { Promise<{ event: Event, timeline: Timeline, universe: Universe } }> }
   */
  static async pipeCreateTimelineEvent ({ eventData, timelineData, universe, ...params }) {
    return await asyncPipe(
      Pre.createTimeline,
      Pre.createEvent
    )({ eventData, timelineData, universe, ...params })
  }

  /**
   * @param { { interestPointData: { name: String, coordinates: String }, mapData: { name: String }, universe: Universe } } param0
   * @returns { Promise<{ interestPoint: InterestPoint, map: Map, universe: Universe } }> }
   */
  static async pipeCreateMapInterestPoint ({ interestPointData, mapData, universe, ...params }) {
    return await asyncPipe(
      Pre.createMap,
      Pre.createInterestPoint
    )({ interestPointData, mapData, universe, ...params })
  }

  /**
   * @param { { characterData: { name: String, backstory: String?, sheetStatus: Number }, inventoryData: { name: String, number: Number, description: String, weight: Number }, universe: Universe } } param0
   * @returns { Promise<{ character: Character, inventory: Inventory, universe: Universe } }> }
   */
  static async pipeCreateCharacterInventory ({ characterData, inventoryData, universe, ...params }) {
    return await asyncPipe(
      Pre.createCharacter,
      Pre.createInventory
    )({ characterData, inventoryData, universe, ...params })
  }

  /**
   * @param { { characterData: { name: String, backstory: String?, sheetStatus: Number }, statsData: { id: Number, value: String|Number }[], universe: Universe, user: User } } param0
   * @returns { Promise<{ character: Character, inventory: Inventory, universe: Universe } }> }
   */
  static async pipeCreateCharacterStats ({ characterData, statsData, universe, user, ...params }) {
    return await asyncPipe(
      Pre.createCharacter,
      Pre.setCharacterStats
    )({ characterData, statsData, universe, user, ...params })
  }

  /**
   * @param { { subTopicData: { name: String, order: Number }, topicData: { name: String, order: Number? }, universe: Universe } } param0
   * @returns { Promise<{ subTopic: SubTopic, topic: Topic, universe: Universe } }> }
   */
  static async pipeCreateTopicSubTopic ({ subTopicData, topicData, universe, ...params }) {
    return await asyncPipe(
      Pre.createTopic,
      Pre.createSubTopic
    )({ subTopicData, topicData, universe, ...params })
  }

  /**
   * @param { { templateCategoryData: { name: String, order: Number?, bIsSpecial: Boolean? }, templateStatData: { name: String, bIsNumber: Boolean, bIsRequired: Boolean? }, universe: Universe } } param0
   * @returns { Promise<{ character: Character, inventory: Inventory, universe: Universe } }> }
   */
  static async pipeCreateTemplateCategoryTemplateStat ({ templateCategoryData, templateStatData, universe, ...params }) {
    return await asyncPipe(
      Pre.createTemplateCategory,
      Pre.createTemplateStat
    )({ templateCategoryData, templateStatData, universe, ...params })
  }

  /**
   * @param { { articleData: { title: String, content: String }, subTopicData: { name: String, order: Number }, topicData: { name: String, order: Number? }, universe: Universe } } param0
   * @returns { Promise<{ article: Article, subTopic: SubTopic, topic: Topic, universe: Universe } }> }
   */
  static async pipeCreateTopicSubTopicArticle ({ articleData, subTopicData, topicData, universe, ...params }) {
    return await asyncPipe(
      Pre.createTopic,
      Pre.createSubTopic,
      Pre.createArticle
    )({ articleData, subTopicData, topicData, universe, ...params })
  }

  // /**
  //  * @param { { articleData: { title: String, content: String }, keywordData: { name: String }, subTopicData: { name: String, order: Number }, topicData: { name: String, order: Number? }, universe: Universe } } param0
  //  * @returns { Promise<{ article: Article, subTopic: SubTopic, topic: Topic, universe: Universe } }> }
  //  */
  // static async pipeCreateTopicSubTopicArticleKeyword ({ articleData, keywordData, subTopicData, topicData, universe, ...params }) {
  //   return await asyncPipe(
  //     Pre.createTopic,
  //     Pre.createSubTopic,
  //     Pre.createArticle,
  //     Pre.createKeyword
  //   )({ articleData, keywordData, subTopicData, topicData, universe, ...params })
  // }
}
