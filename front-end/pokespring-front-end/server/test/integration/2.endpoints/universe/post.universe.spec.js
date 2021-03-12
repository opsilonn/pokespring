/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('POST /api/v1/universes', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const universeData2 = { name: 'universe test 2', description: 'universeTest2\'s description', bIsPublic: true }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the status 201 and the new created universe if we are authenticated', async () => {
    const { user } = await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .post('/api/v1/universes')
      .send(universeData)
      .expect(201)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.id).to.be.an('number')
        expect(response.body.name).to.equal(universeData.name)
        expect(response.body.description).to.equal(universeData.description)
        expect(response.body.bIsPublic).to.equal(universeData.bIsPublic)
        expect(response.body.idUser).to.equal(user.id)
      })
  })

  it('should return the status 401 if we are not authenticated', () =>
    agent
      .post('/api/v1/universes')
      .send(universeData)
      .expect(401)
  )

  it('should return the status 400 and a error message if another universe of the same user owner with the same name already exist', async () => {
    await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    return agent
      .post('/api/v1/universes')
      .send({ ...universeData2, name: universeData.name })
      .expect(400)
      .expect('Content-Type', /json/)
  })

  it('should return the status 400 and a error message if we don\'t provide a name', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse
    )({ agent, userData, universeData })

    const universeDataTruncate = { ...universeData }
    delete universeDataTruncate.name

    return agent
      .post('/api/v1/universes')
      .send({ ...universeDataTruncate, idUniverse: universe.id })
      .expect(400)
      .expect('Content-Type', /json/)
  })
})
