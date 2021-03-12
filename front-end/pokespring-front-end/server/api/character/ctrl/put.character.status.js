import Character from '../../../models/character.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putCharacterStatus (req, res) {
  const sheetStatus = parseInt(req.body.sheetStatus)
  if (sheetStatus !== 0 && sheetStatus !== 1) { res.sendStatus(401); return }

  await Character.updateSheetStatus(parseInt(req.params.id), sheetStatus)

  res.status(200).json(true)
}
