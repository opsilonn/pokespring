import bcrypt from 'bcrypt'
import mariadb from '../services/mariadb.services.js'
import { HalResource, HalResourceData, HalToOneLinks } from '../utils/hal-parser.js'

class HalResourceDataUser extends HalResourceData {
  /** @type { String } */
  username
}

class HalToOneLinksUser extends HalToOneLinks { }

export default class User extends HalResource {
  /** @type { HalResourceDataUser } */
  data
  /** @type { HalToOneLinksUser } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = ['groups', 'universes', 'universes-plays']

  /**
   * @param { User } user
   */
  constructor(user) {
    super()

    this.id = user.idUser || user.id

    this.data = new HalResourceDataUser()
    this.data.username = user.username || user.data.username

    this.toOneLinks = new HalToOneLinksUser()
  }

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   */
  asResource (baseAPI, resourcePath = 'users') {
    return super.asResource(baseAPI, resourcePath)
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   */
  static asResourceList (baseAPI, list, selfLink = 'users', resourcePath = 'users') {
    return super.asResourceList(baseAPI, list, selfLink, resourcePath, User)
  }

  /// GET

  /**
   * @returns { Promise<User[]> }
   */
  static async getAll () {
    return await mariadb.client.query('SELECT idUser, username FROM user')
  }

  /**
   * @param { Number } id id of the user
   * @returns { Promise<User> }
   */
  static async get (id) {
    const row = (await mariadb.client.query('SELECT * FROM user WHERE idUser = ?', id))[0]
    if (!row) {
      const err = new Error(`User ${id} don't exist !`)
      err.code = 'ER_RESOURCE_NOT_FOUND'
      throw err
    }

    return new User(row)
  }

  /**
   * @param { String } username
   * @returns { Promise<User> }
   */
  static async getByName (username) {
    return new User((await mariadb.client.query('SELECT * FROM `user` WHERE username = ?', [username]))[0])
  }

  /**
   * @param { Number } id id of the universe
   * @returns { Promise<User[]> }
   */
  static async getUsersPlayingInUniverse (id) {
    return await mariadb.client.query(`
      SELECT u.*, uin.bIsGM FROM user u
      INNER JOIN userinuniverse uin
        ON uin.idUser = u.idUser
      WHERE idUniverse = ?
    `, id)
  }

  /**
   * @param { String } username
   * @returns { Promise<User> }
   */
  static async checkPassword (username, password) {
    return await bcrypt.compare(password, (await mariadb.client.query('SELECT password FROM `user` WHERE username = ?', [username]))[0].password)
  }

  /// POST

  /**
   * @param { { username: String, password: String } } user
   * @returns { Promise<User> }
   */
  static async add (user) {
    const hashedPassword = await bcrypt.hash(user.password, 10)
    const sql = `
      INSERT INTO
        user(username, password)
        VALUES(?, ?)
      RETURNING *`
    const params = [user.username, hashedPassword]

    return new User((await mariadb.client.query(sql, params))[0])
  }

  /// PUT

  /**
   * @param { Number } id id of the user
   * @param { Object } user data of the user
   * @return { Promise<Boolean> }
   */
  static async update (id, user) {
    const sql = `
      UPDATE user
        SET username = ?
      WHERE idUser = ?`
    const params = [user.username, id]

    await mariadb.client.query(sql, params)

    return await this.get(id)
  }

  /**
   * @param { String } password
   * @param { Number } id id of the user
   * @return { Promise<Boolean> }
   */
  static async changePassword (password, id) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const sql = `
      UPDATE user
        SET password = ?
      WHERE idUser = ?`
    const params = [hashedPassword, id]

    const result = await mariadb.client.query(sql, params)

    return result.affectedRows === 1
  }

  /// DELETE

  /**
   * @param { Number } idUser
   * @returns { Promise<User> }
   */
  static async remove (idUser) {
    return await mariadb.client.query('DELETE FROM user WHERE idUser = ?', [idUser])
  }
}
