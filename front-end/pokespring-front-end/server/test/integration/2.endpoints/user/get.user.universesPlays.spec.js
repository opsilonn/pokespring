/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('GET /api/v1/users/:id/universes-plays', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const universeData2 = { name: 'universe test 2', description: 'universeTest2\'s description', bIsPublic: false }
  const universeData3 = { name: 'universe test 3', description: 'universeTest3\'s description', bIsPublic: true }
  const characterData = { name: 'character test 1', backstory: 'characterTest1\'s backstory', sheetStatus: 1 }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the universes the selected user owns if the user exists', async () => {
    const ret1 = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .get(`/api/v1/users/${ret1.user.id}/universes-plays`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[0].id).to.equal(ret1.universe.id)
        expect(response.body.list[0].name).to.equal(universeData.name)
        expect(response.body.list[0].description).to.equal(universeData.description)
        expect(response.body.list[0].bIsPublic).to.equal(universeData.bIsPublic)
        expect(response.body.list[0].idUser).to.equal(ret1.user.id)
        expect(response.body.list[0].bIsGM).to.be.true
      })
  })

  it('should return the list of all the universes the selected user is invited to if the user exists', async () => {
    const ret1 = await Pre.createUser({ userData })

    const ret2 = await Pre.pipeCreateUserUniverse({ universeData: universeData2, userData: userData2 })

    await Pre.inviteUser({ universe: ret2.universe, user: ret1.user })

    return agent
      .get(`/api/v1/users/${ret1.user.id}/universes-plays`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[0].id).to.equal(ret2.universe.id)
        expect(response.body.list[0].name).to.equal(universeData2.name)
        expect(response.body.list[0].description).to.equal(universeData2.description)
        expect(response.body.list[0].bIsPublic).to.equal(universeData2.bIsPublic)
        expect(response.body.list[0].idUser).to.equal(ret2.user.id)
        expect(response.body.list[0].bIsGM).to.be.false
      })
  })

  it('should return the list of all the public universes the selected user create a character there if the user exists', async () => {
    const ret1 = await Pre.createUser({ userData })

    const ret2 = await Pre.pipeCreateUserUniverse({ universeData: universeData2, userData: userData2 })

    await Pre.createCharacter({ characterData, universe: ret2.universe, user: ret1.user })

    return agent
      .get(`/api/v1/users/${ret1.user.id}/universes-plays`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[0].id).to.equal(ret2.universe.id)
        expect(response.body.list[0].name).to.equal(universeData2.name)
        expect(response.body.list[0].description).to.equal(universeData2.description)
        expect(response.body.list[0].bIsPublic).to.equal(universeData2.bIsPublic)
        expect(response.body.list[0].idUser).to.equal(ret2.user.id)
        expect(response.body.list[0].bIsGM).to.be.false
      })
  })

  it('should return the list of all the universes in which the selected user plays there if the user exists', async () => {
    const ret1 = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const ret2 = await Pre.pipeCreateUserUniverse({ universeData: universeData2, userData: userData2 })

    await Pre.inviteUser({ universe: ret2.universe, user: ret1.user })

    const { universe } = await Pre.createUniverse({ universeData: universeData3, user: ret2.user })
    await Pre.createCharacter({ characterData, universe, user: ret1.user })

    return agent
      .get(`/api/v1/users/${ret1.user.id}/universes-plays`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(3)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[0].id).to.equal(ret1.universe.id)
        expect(response.body.list[0].name).to.equal(universeData.name)
        expect(response.body.list[0].description).to.equal(universeData.description)
        expect(response.body.list[0].bIsPublic).to.equal(universeData.bIsPublic)
        expect(response.body.list[0].idUser).to.equal(ret1.user.id)
        expect(response.body.list[0].bIsGM).to.be.true

        expect(response.body.list[1]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[1].id).to.equal(ret2.universe.id)
        expect(response.body.list[1].name).to.equal(universeData2.name)
        expect(response.body.list[1].description).to.equal(universeData2.description)
        expect(response.body.list[1].bIsPublic).to.equal(universeData2.bIsPublic)
        expect(response.body.list[1].idUser).to.equal(ret2.user.id)
        expect(response.body.list[1].bIsGM).to.be.false

        expect(response.body.list[2]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[2].id).to.equal(universe.id)
        expect(response.body.list[2].name).to.equal(universeData3.name)
        expect(response.body.list[2].description).to.equal(universeData3.description)
        expect(response.body.list[2].bIsPublic).to.equal(universeData3.bIsPublic)
        expect(response.body.list[2].idUser).to.equal(ret2.user.id)
        expect(response.body.list[2].bIsGM).to.be.false
      })
  })

  it('should return an empty list of universes if the selected user doesn\'t exists', () =>
    agent
      .get('/api/v1/users/1/universes-plays')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(0)
      })
  )
})
