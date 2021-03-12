import { Router } from 'express'

import isConnected from '../../middlewares/is-connected.js'
import { tryTo, emptyError } from '../../middlewares/errors.js'
import upload from '../../middlewares/image-parser.js'

import getUsers from './ctrl/get.users.js'
import getUser from './ctrl/get.user.js'
import getUserCharacters from './ctrl/get.user.characters'
// import getUserGroups from './ctrl/get.user.groups'
import getUserUniverses from './ctrl/get.user.universes'
import getUserUniversesPlays from './ctrl/get.user.universesPlays'
import postUser from './ctrl/post.user.js'
import postUserImage from './ctrl/post.user.image.js'
import putUser from './ctrl/put.user.js'
import deleteUser from './ctrl/delete.user.js'

const {
  // canGetUniverse,
  isUser
} = require('../../middlewares/access-rights.js')

const router = Router()

// Get
router.get('/', tryTo(getUsers, emptyError)) // no policy
router.get('/:id', tryTo(getUser, emptyError)) // no policy
router.get('/:id/characters', tryTo(getUserCharacters, emptyError)) // can see private universes
// router.get('/:id/groups', canGetUniverse('universe', 'query'), tryTo(getUserGroups, emptyError)) // can see universe
router.get('/:id/universes', tryTo(getUserUniverses, emptyError)) // can see private universes
router.get('/:id/universes-plays', tryTo(getUserUniversesPlays, emptyError)) // can see private universes

// Post
router.post('/', tryTo(postUser, emptyError))
router.post('/:id', isConnected, isUser('id', 'params'), upload('user-image'), tryTo(postUserImage, emptyError))

// Put
router.put('/:id', tryTo(putUser, emptyError))

// Delete
router.delete('/:id', isConnected, isUser('id', 'params'), tryTo(deleteUser, emptyError))

export default router
