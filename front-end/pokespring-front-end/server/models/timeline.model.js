import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataTimeline extends HalResourceData {
  /** @type { String } */
  name
  /** @type { String } */
  description
  /** @type { Boolean } */
  bIsPublic
}

class HalToOneLinksTimeline extends HalToOneLinks {
  /** @type { Number } */
  universe
}

export default class Timeline extends HalResource {
  /** @type { HalResourceDataTimeline } */
  data
  /** @type { HalToOneLinksTimeline } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = ['events']

  /**
   * @param { Timeline } timeline
   */
  constructor (timeline) {
    super()

    this.id = timeline.idTimeline || timeline.id

    this.data = new HalResourceDataTimeline()
    this.data.name = timeline.name || timeline.data.name
    this.data.description = timeline.description || timeline.data.description
    this.data.bIsPublic = (timeline.bIsPublic !== undefined) ? !!timeline.bIsPublic : timeline.data.bIsPublic

    this.toOneLinks = new HalToOneLinksTimeline()
    this.toOneLinks.universe = timeline.universe_idUniverse || timeline.toOneLinks.universe
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'timelines') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'timelines', resourcePath = 'timelines') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, Timeline)
  }

  /// GET

  // /**
  //  * @returns { Promise<Timeline[]> }
  //  */
  // static async getAll () {
  //   return await mariadb.client.query('SELECT * FROM timeline')
  // }

  /**
   * @param { Number } id id of the timeline
   * @returns { Promise<Timeline> }
   */
  static async get (id) {
    return new Timeline((await mariadb.client.query('SELECT * FROM timeline WHERE idTimeline = ?', id))[0])
  }

  /**
   * @param { Number } id id of the universe
   * @returns { Promise<Timeline[]> }
   */
  static async getByUniverse (id) {
    return await mariadb.client.query('SELECT * FROM timeline WHERE universe_idUniverse = ?', id)
  }

  /// POST

  /**
   * @param { { name: String, description: String, bIsPublic: Boolean, idUniverse: Number } } timeline
   * @returns { Promise<Timeline> } the id of the new inserted timeline
   */
  static async add (timeline) {
    const sql = `
      INSERT INTO
        timeline(name, description, bIsPublic, universe_idUniverse)
        VALUES(?, ?, ?, ?)
      RETURNING *`
    // All the params we have to put to insert a new row in the table
    const params = [timeline.name, timeline.description, timeline.bIsPublic, timeline.idUniverse]

    return new Timeline((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the timeline
   * @param { { name: String, description: String, bIsPublic: Boolean } } timeline
   * @returns { Promise<Timeline> } if the timeline could have been updated
   */
  static async update (id, timeline) {
    const sql = `
      INSERT INTO
        timeline(idTimeline) VALUES(?)
      ON DUPLICATE KEY UPDATE
        name = ?, description = ?, bIsPublic = ?
      RETURNING *`
    const params = [id, timeline.name, timeline.description, timeline.bIsPublic]

    return new Timeline((await mariadb.client.query(sql, params))[0])
  }

  /// DELETE

  /**
   * @param { Number } id id of the timeline
   * @returns { Promise<Boolean> } if the timeline could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM timeline
        WHERE idTimeline = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }
}
