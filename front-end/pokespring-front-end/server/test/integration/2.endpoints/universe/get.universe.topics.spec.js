/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

describe('GET /api/v1/universes/:id/topics', () => {
  let agent
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description', bIsPublic: false }
  const topicData = { name: 'topic test 1' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  beforeEach(() => { agent = Pre.createExpress().agent })
  afterEach(() => Post.truncateTables())

  it('should return the list of all the topics of the selected universe if we are authorized to see it', async () => {
    const { topic, universe } = await asyncPipe(
      Pre.pipeCreateUserLogin,
      Pre.createUniverse,
      Pre.createTopic
    )({ agent, topicData, universeData, userData })

    return agent
      .get(`/api/v1/universes/${universe.id}/topics`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links).to.have.all.keys(['self'])
        expect(response.body.list).to.be.an('array').of.length(1)

        expect(response.body.list[0]._links).to.have.all.keys(['self', 'universe', 'sub-topics'])
        expect(response.body.list[0].id).to.equal(topic.id)
        expect(response.body.list[0].name).to.equal(topicData.name)
        expect(response.body.list[0].idUniverse).to.equal(universe.id)
      })
  })

  it('should return the status 401 if the selected universe doesn\'t exists', async () => {
    await Pre.pipeCreateUserLogin({ agent, userData })

    return agent
      .get('/api/v1/universes/1/topics')
      .expect(401)
  })

  it('should return the status 401 if we are authenticated as a user who can\'t see the selected universe', async () => {
    const { universe } = await asyncPipe(
      Pre.pipeCreateUserUniverse,
      Pre.createTopic
    )({ topicData, universeData, userData })

    await Pre.pipeCreateUserLogin({ agent, userData: userData2 })

    return agent
      .get(`/api/v1/universes/${universe.id}/topics`)
      .expect(401)
  })
})
