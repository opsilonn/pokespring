import Character from '../../../models/character.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function deleteCharacter (req, res) {
  const bSucceded = await Character.remove(parseInt(req.params.id))
  res.status(200).json(bSucceded)
}
