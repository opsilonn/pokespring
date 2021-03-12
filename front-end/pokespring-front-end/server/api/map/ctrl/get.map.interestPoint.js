import InterestPoint from '../../../models/interestPoint.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getMapInterestPoints (req, res) {
  const interestPoints = await InterestPoint.getByMap(parseInt(req.params.id))
  res.status(200).json(InterestPoint.asResourceList(baseAPI(req), interestPoints, 'map' + req.url))
}
