import Character from '../../../models/character.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getCharacter (req, res) {
  const character = await Character.get(parseInt(req.params.id))
  res.status(200).json(character.asResource(baseAPI(req)))
}
