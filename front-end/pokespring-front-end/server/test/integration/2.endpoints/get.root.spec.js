/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Pre from '../../pre-post/pre.js'

describe('GET /api/v1', () => {
  let agent

  // eslint-disable-next-line no-undef
  before(() => {
    const ret = Pre.createExpress()
    agent = ret.agent
  })

  it('should return all existing paths', () => {
    return agent
      .get('/api/v1')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links)
          .to.be.an('object')
        expect(response.body._links.articles).to.be.an('string')
        expect(response.body._links.articles).to.equal(response.request.url + '/articles')
        expect(response.body._links.auth).to.be.an('string')
        expect(response.body._links.auth).to.equal(response.request.url + '/auth')
        expect(response.body._links.characters).to.be.an('string')
        expect(response.body._links.characters).to.equal(response.request.url + '/characters')
        expect(response.body._links.events).to.be.an('string')
        expect(response.body._links.events).to.equal(response.request.url + '/events')
        // expect(response.body._links.groups).to.be.an('string')
        // expect(response.body._links.groups).to.equal(response.request.url + '/groups')
        // expect(response.body._links.keywords).to.be.an('string')
        // expect(response.body._links.keywords).to.equal(response.request.url + '/keywords')
        expect(response.body._links['interest-points']).to.be.an('string')
        expect(response.body._links['interest-points']).to.equal(response.request.url + '/interest-points')
        expect(response.body._links.inventories).to.be.an('string')
        expect(response.body._links.inventories).to.equal(response.request.url + '/inventories')
        expect(response.body._links.maps).to.be.an('string')
        expect(response.body._links.maps).to.equal(response.request.url + '/maps')
        expect(response.body._links['sub-topics']).to.be.an('string')
        expect(response.body._links['sub-topics']).to.equal(response.request.url + '/sub-topics')
        expect(response.body._links['template-categories']).to.be.an('string')
        expect(response.body._links['template-categories']).to.equal(response.request.url + '/template-categories')
        expect(response.body._links['template-stats']).to.be.an('string')
        expect(response.body._links['template-stats']).to.equal(response.request.url + '/template-stats')
        expect(response.body._links.timelines).to.be.an('string')
        expect(response.body._links.timelines).to.equal(response.request.url + '/timelines')
        expect(response.body._links.topics).to.be.an('string')
        expect(response.body._links.topics).to.equal(response.request.url + '/topics')
        expect(response.body._links.universes).to.be.an('string')
        expect(response.body._links.universes).to.equal(response.request.url + '/universes')
        expect(response.body._links.users).to.be.an('string')
        expect(response.body._links.users).to.equal(response.request.url + '/users')
      })
  })
})
