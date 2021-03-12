import User from '../../../models/user.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getUser (req, res) {
  try {
    const user = await User.get(parseInt(req.params.id))
    res.status(200).json(user.asResource(baseAPI(req)))
  } catch (err) {
    res.status(404).json(err.message)
  }
}
