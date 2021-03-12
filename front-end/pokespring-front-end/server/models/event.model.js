import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataEvent extends HalResourceData {
  /** @type { String } */
  name
  /** @type { Number } */
  year
  /** @type { Number? } */
  month
  /** @type { Number? } */
  day
  /** @type { String? } */
  description
}

class HalToOneLinksEvent extends HalToOneLinks {
  /** @type { Number } */
  timeline
  /** @type { Number? } */
  article
}

export default class Event extends HalResource {
  /** @type { HalResourceDataEvent } */
  data
  /** @type { HalToOneLinksEvent } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = []

  /**
   * @param { Event } event
   */
  constructor (event) {
    super()
    this.id = event.idEvent || event.id

    this.data = new HalResourceDataEvent()
    this.data.name = event.name || event.data.name
    this.data.year = event.year || event.data.year
    this.data.month = (event.month !== undefined) ? event.month : event.data.month
    this.data.day = (event.day !== undefined) ? event.day : event.data.day
    this.data.description = (event.description !== undefined) ? event.description : event.data.description

    this.toOneLinks = new HalToOneLinksEvent()
    this.toOneLinks.timeline = event.timeline_idTimeline || event.toOneLinks.timeline
    this.toOneLinks.article = (event.article_idArticle !== undefined) ? event.article_idArticle : event.toOneLinks.article
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'events') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'events', resourcePath = 'events') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, Event)
  }

  /// GET

  // /**
  //  * @returns { Promise<Event[]> }
  //  */
  // static async getAll () {
  //   return await mariadb.client.query('SELECT * FROM event  ORDER BY year, month, day')
  // }

  /**
   * @param { Number } id id of the event
   * @returns { Promise<Event> }
   */
  static async get (id) {
    return new Event((await mariadb.client.query('SELECT * FROM event WHERE idEvent = ?', id))[0])
  }

  /**
   * @param { Number } id if of the timeline
   * @returns { Promise<Event[]> }
   */
  static async getByTimeline (id) {
    return await mariadb.client.query('SELECT * FROM event WHERE timeline_idTimeline = ? ORDER BY year, month, day', id)
  }

  /// POST

  /**
   * @param { { name: String, year: Number, month: Number, day: Number, description: String, idTimeline: Number, idArticle: Number? } } event
   * @returns { Promise<Event> } the id of the new inserted Event
   */
  static async add (event) {
    const sql = `
      INSERT INTO
        event(name, year, month, day, description, timeline_idTimeline, article_idArticle)
        VALUES(?, ?, ?, ?, ?, ?, ?)
      RETURNING *`
    // All the params we have to put to insert a new row in the table
    const params = [event.name, event.year, event.month, event.day, event.description, event.idTimeline, event.idArticle || null]

    return new Event((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the event
   * @param { { name: String, year: Number, month: Number, day: Number, description: String, idArticle: Number? } } event
   * @returns { Promise<Event> } if the event could have been updated
   */
  static async update (id, event) {
    const sql = `
      INSERT INTO
        event(idEvent) VALUES(?)
      ON DUPLICATE KEY UPDATE
        name = ?, year = ?, month = ?, day = ?, description=?, article_idArticle = ?
      RETURNING *`
    // All the cols you want to update for a event + the id of the event you want to update
    // /!\ You may never want to change the links
    const params = [id, event.name, event.year, event.month, event.day, event.description, event.idArticle || null]

    return new Event((await mariadb.client.query(sql, params))[0])
  }

  /// DELETE

  /**
   * @param { Number } id id of the event
   * @returns { Promise<Boolean> } if the event could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM event
        WHERE idEvent = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }
}
