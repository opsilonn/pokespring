/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import Pre from '../../../pre-post/pre.js'

describe('GET /api/v1/auth', () => {
  let agent

  // eslint-disable-next-line no-undef
  before(() => {
    const ret = Pre.createExpress()
    agent = ret.agent
  })

  it('should return all auth paths', () =>
    agent
      .get('/api/v1/auth')
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body._links)
          .to.be.an('object')
        expect(response.body._links.me).to.be.an('string')
        expect(response.body._links.me).to.equal(response.request.url + '/me')
        expect(response.body._links.login).to.be.an('string')
        expect(response.body._links.login).to.equal(response.request.url + '/login')
        expect(response.body._links.logout).to.be.an('string')
        expect(response.body._links.logout).to.equal(response.request.url + '/logout')
        expect(response.body._links['change-password']).to.be.an('string')
        expect(response.body._links['change-password']).to.equal(response.request.url + '/change-password')
      })
  )
})
