/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'

describe('GET /api/v1/universes', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the universes', async () => {
    const { universe, user } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    return agent
      .get('/api/v1/universes')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'user', 'groups', 'characters', 'keywords', 'maps', 'template-categories', 'timelines', 'topics', 'users-playing'])
        expect(response.body.list[0].id).to.equal(universe.id)
        expect(response.body.list[0].name).to.equal(universeData.name)
        expect(response.body.list[0].description).to.equal(universeData.description)
        expect(response.body.list[0].bIsPublic).to.equal(universeData.bIsPublic)
        expect(response.body.list[0].idUser).to.equal(user.id)
      })
  })
})
