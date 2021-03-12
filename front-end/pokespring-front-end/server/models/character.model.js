import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataCharacter extends HalResourceData {
  /** @type { String } */
  name
  /** @type { String } */
  backstory
  /** @type { Boolean } */
  bIsAlive
  /** @type { Number } */
  sheetStatus
}

class HalToOneLinksCharacter extends HalToOneLinks {
  /** @type { Number } */
  user
  /** @type { Number } */
  universe
}

export default class Character extends HalResource {
  /** @type { HalResourceDataCharacter } */
  data
  /** @type { HalToOneLinksCharacter } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = ['groups', 'inventories', 'stats']

  /**
   * @param { Character } character
   */
  constructor (character) {
    super()

    this.id = character.idCharacter || character.id

    this.data = new HalResourceDataCharacter()
    this.data.name = character.name || character.data.name
    this.data.backstory = character.backstory || character.data.backstory
    this.data.bIsAlive = (character.bIsAlive !== undefined) ? !!character.bIsAlive : character.data.bIsAlive
    this.data.sheetStatus = (character.sheetStatus !== undefined) ? character.sheetStatus : character.data.sheetStatus

    this.toOneLinks = new HalToOneLinksCharacter()
    this.toOneLinks.universe = character.universe_idUniverse || character.toOneLinks.universe
    this.toOneLinks.user = character.user_idUser || character.toOneLinks.user
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'characters') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'characters', resourcePath = 'characters') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, Character)
  }

  /// GET

  // /**
  //  * @returns { Promise<Character[]> }
  //  */
  // static async getAll () {
  //   return await mariadb.client.query('SELECT * FROM `character`')
  // }

  /**
   * @param { Number } id id of the character
   * @returns { Promise<Character> }
   */
  static async get (id) {
    return new Character((await mariadb.client.query('SELECT * FROM `character` WHERE idCharacter = ?', id))[0])
  }

  // /**
  //  * @param { Number } id id of the group that we want the characters
  //  * @returns { Promise<Character[]> }
  //  */
  // static async getByGroup (id) {
  //   return await mariadb.client.query(`
  //     SELECT * FROM \`character\` c
  //     INNER JOIN characterInGroup cg
  //       ON cg.character_idCharacter = c.idCharacter
  //     WHERE group_idGroup = ?
  //   `, id)
  // }

  /**
   * @param { Number } id id of the character that we want all the stats
   * @returns { Promise<{ categories: { id: Number, name: String, order: Number, stats: { id: Number, name: String, bIsNumber: Boolean, bIsRequired: Boolean, value: String|Number }[] }[] }> }
   */
  static async getStats (id) {
    const rows = await mariadb.client.query('SELECT * FROM characterstats WHERE `character` = ?', id)

    const res = { categories: [] }
    if (rows.length === 0) { return res }

    let currentCategory = { id: rows[0].idTemplateCategory, name: rows[0].category, order: rows[0].order, bIsSpecial: !!rows[0].bIsSpecial, stats: [] }

    for (const row of rows) {
      const category = {
        id: row.idTemplateCategory,
        name: row.category,
        order: row.order,
        bIsSpecial: !!row.bIsSpecial
      }

      if (currentCategory.id !== category.id) {
        res.categories.push(currentCategory)
        currentCategory = category
        currentCategory.stats = []
      }

      currentCategory.stats.push({
        id: row.idTemplateStat,
        name: row.stat,
        bIsNumber: !!row.bIsNumber,
        bIsRequired: !!row.bIsRequired,
        value: (row.bIsNumber) ? parseInt(row.value) : row.value
      })
    }

    res.categories.push(currentCategory)

    return res
  }

  /**
   * @param { Number } id id of the universe
   * @returns { Promise<Character[]> }
   */
  static async getByUniverse (id) {
    return await mariadb.client.query('SELECT * FROM `character` WHERE universe_idUniverse = ?', id)
  }

  /**
   * @param { Number } id id of the user
   * @returns { Promise<Character[]> }
   */
  static async getByUser (id) {
    return await mariadb.client.query('SELECT * FROM `character` WHERE user_idUser = ?', id)
  }

  /// POST

  /**
   * @param { { name: String, backstory: String?, sheetStatus: Number, idUser: Number, idUniverse: Number } } character
   * @returns { Promise<Character> } the id of the new inserted character
   */
  static async add (character) {
    const bHaveSheetStatus = character.sheetStatus === 0 || character.sheetStatus === 1
    const sql = `
      INSERT INTO 
        \`character\`(name, backstory, sheetStatus, user_idUser, universe_idUniverse) 
        VALUES(?, ?, ` + (bHaveSheetStatus ? '?' : 'DEFAULT(sheetStatus)') + `, ?, ?)
      RETURNING *`
    // All the params we have to put to insert a new row in the table
    const params = [character.name, character.backstory || null]
    if (bHaveSheetStatus) { params.push(character.sheetStatus) }
    params.push(character.idUser, character.idUniverse)

    return new Character((await mariadb.client.query(sql, params))[0])
  }

  // /**
  //  * @param { Number } idCharacter the id of the character we want to add in the group
  //  * @param { Number } idGroup the id of the group we want to add to the character
  //  * @returns { Promise<Boolean> } if the group was succesfully add to the character
  //  */
  // static async insertInGroup (idCharacter, idGroup) {
  //   const sql = `
  //     INSERT INTO
  //       characterInGroup(group_idGroup, character_idCharacter)
  //       VALUES(?, ?)`
  //   // All the params we have to put to insert a new row in the table
  //   const params = [idGroup, idCharacter]

  //   const rows = await mariadb.client.query(sql, params)

  //   return rows.affectedRows === 1
  // }

  /// PUT

  /**
   * @param { Number } id id of the character
   * @param { { name: String, backstory: String, bIsAlive: Boolean } } character
   * @returns { Promise<Character> } if the character could have been updated
   */
  static async update (id, character) {
    const sql = `
      INSERT INTO
        \`character\`(idCharacter) VALUES(?)
      ON DUPLICATE KEY UPDATE
        name = ?, backstory = ?, bIsAlive = ?
      RETURNING *`
    const params = [id, character.name, character.backstory, character.bIsAlive]

    return new Character((await mariadb.client.query(sql, params))[0])
  }

  /**
   * @param { Number } id id of the character
   * @param { Number } sheetStatus
   */
  static async updateSheetStatus (id, sheetStatus) {
    const sql = `
      UPDATE \`character\`
        SET sheetStatus = ?
      WHERE idCharacter = ?`
    const params = [sheetStatus, id]

    await mariadb.client.query(sql, params)
  }

  /**
   * @param { Number } id id of the character
   * @param { { id: Number, value: String|Number }[] } stats
   * @returns { Promise<{ value: String, character_idCharacter: Number, templateStat_idTemplateStat: Number }[]> } if the character could have been updated
   */
  static async updateStats (id, stats) {
    const conn = await mariadb.pool.getConnection()
    await conn.beginTransaction()

    try {
      await conn.query('DELETE FROM stat WHERE character_idCharacter = ?', id)

      const sql = `
        INSERT INTO stat(value, character_idCharacter, templateStat_idTemplateStat)
          VALUES(?, ?, ?)
        ON DUPLICATE KEY
          UPDATE value = VALUE(value)
        RETURNING *`

      const paramsArray = []
      for (const stat of stats) {
        paramsArray.push([stat.value, id, stat.id])
      }

      const results = await Promise.all(paramsArray.map((params, index) => {
        return conn.query(sql, params)
          .catch(() => {
            throw new Error(`Could not update stat ${paramsArray[index][2]}`)
          })
      }))

      conn.commit()

      return await results.map(_ => _[0])
    } catch (err) {
      await conn.rollback()
      throw err
    } finally {
      conn.end()
    }
  }

  // DELETE

  /**
   * @param { Number } id id of the character
   * @returns { Promise<Boolean> } if the character could have been removed
   */
  static async remove (id) {
    const sql = `
      DELETE FROM \`character\`
        WHERE idCharacter = ?`
    const params = [id]

    const rows = await mariadb.client.query(sql, params)

    return rows.affectedRows === 1
  }

  // /**
  //  * @param { Number } idCharacter the id of the character we want to remove from the group
  //  * @param { Number } idGroup the id of the group we want to remove to the character
  //  * @returns { Promise<Boolean> } if the character could have been removed
  //  */
  // static async removeGroup (idCharacter, idGroup) {
  //   const sql = `
  //   DELETE FROM characterInGroup
  //   WHERE character_idCharacter = ? AND group_idGroup = ?`
  //   const params = [idCharacter, idGroup]

  //   const rows = await mariadb.client.query(sql, params)

  //   return rows.affectedRows === 1
  // }
}
