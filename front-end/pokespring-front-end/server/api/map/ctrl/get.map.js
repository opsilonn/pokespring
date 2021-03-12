import Map from '../../../models/map.model.js'
import { baseAPI } from '../../routes.js'

export default async function getTimeline (req, res) {
  const map = await Map.get(parseInt(req.params.id))
  res.status(200).json(map.asResource(baseAPI(req)))
}
