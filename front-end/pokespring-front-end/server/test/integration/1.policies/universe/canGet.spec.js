/* eslint-disable no-unused-expressions */
import { expect } from 'chai'
import params from '../../test.config.js'
import Pre from '../../../pre-post/pre.js'
import Post from '../../../pre-post/post.js'
import asyncPipe from '../../../../utils/async-pipe.js'

import UniversePolicy from '../../../../policies/universe.policy.js'

describe('Universe\'s policy canGet', () => {
  const userData = { username: 'user test 1', password: 'AzEr12ù*' }
  const userData2 = { username: 'user test 2', password: 'AzEr12ù*' }
  const universeData = { name: 'universe test 1', description: 'universeTest1\'s description' }

  // eslint-disable-next-line no-undef
  before(() => Pre.createBlankDatabaseWithEmptyTables(params))

  afterEach(() => Post.truncateTables())

  it('should return true if we are authenticated as the owner of the universe which is public', async () => {
    const { universe, user } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return true if we are authenticated as a user being a game master of the universe which is public', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUserGM
    )({ universe, userData: userData2 })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return true if we are authenticated as a basic user invited in the universe which is public', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return true if we are authenticated as a user not invited in the universe which is public', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData }, userData })

    const { user } = await Pre.createUser({ universe, userData: userData2 })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return true if we are not authenticated which is public', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData, userData })

    expect(await UniversePolicy.canGet(undefined, universe.id)).to.be.true
  })

  it('should return true if we are authenticated as the owner of the universe which is private', async () => {
    const { universe, user } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return true if we are authenticated as a user being a game master of the universe which is private', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUserGM
    )({ universe, userData: userData2 })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return true if we are authenticated as a basic user invited in the universe which is private', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    const { user } = await asyncPipe(
      Pre.createUser,
      Pre.inviteUser
    )({ universe, userData: userData2 })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.true
  })

  it('should return false if we are authenticated as a user not invited in the universe which is private', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    const { user } = await Pre.createUser({ universe, userData: userData2 })

    expect(await UniversePolicy.canGet(user.id, universe.id)).to.be.false
  })

  it('should return false if we are not authenticated which is private', async () => {
    const { universe } = await Pre.pipeCreateUserUniverse({ universeData: { ...universeData, bIsPublic: false }, userData })

    expect(await UniversePolicy.canGet(undefined, universe.id)).to.be.false
  })

  it('should return false if the universe doesn\'t exists', async () =>
    expect(await UniversePolicy.canGet(undefined, 1)).to.be.false
  )
})
