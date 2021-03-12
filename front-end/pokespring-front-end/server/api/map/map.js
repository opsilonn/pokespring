import { Router } from 'express'

import isConnected from '../../middlewares/is-connected.js'
import { tryTo, emptyError } from '../../middlewares/errors.js'
import upload from '../../middlewares/image-parser.js'

import MapPolicy from '../../policies/map.policy.js'

// import getMaps from './ctrl/get.maps.js'
import getMap from './ctrl/get.map.js'
import getMapInterestPoints from './ctrl/get.map.interestPoint.js'
import postMap from './ctrl/post.map.js'
import postMapImage from './ctrl/post.map.image.js'
import putMap from './ctrl/put.map.js'
import deleteMap from './ctrl/delete.map.js'

const {
  canEditUniverse,
  canGetUniverseIndirect,
  canEditUniverseIndirect
} = require('../../middlewares/access-rights.js')

const canGet = canGetUniverseIndirect(MapPolicy.getUniverseId, 'id', 'params')
const canEdit = canEditUniverseIndirect(MapPolicy.getUniverseId, 'id', 'params')

const router = Router()

// Get
// router.get('/', tryTo(getMaps, emptyError))
router.get('/:id', canGet, tryTo(getMap, emptyError))
router.get('/:id/interest-points', canGet, tryTo(getMapInterestPoints, emptyError))

// Post
router.post('/', isConnected, canEditUniverse('idUniverse', 'body'), tryTo(postMap, emptyError))
router.post('/:id', isConnected, canEdit, upload('map-image'), tryTo(postMapImage, emptyError))

// Put
router.put('/:id', isConnected, canEdit, tryTo(putMap, emptyError))

// Delete
router.delete('/:id', isConnected, canEdit, tryTo(deleteMap, emptyError))

export default router
