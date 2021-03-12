import Character from '../../../models/character.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putCharacterStatusGameMaster (req, res, next) {
  const sheetStatus = parseInt(req.body.sheetStatus)
  if (sheetStatus !== 2 && sheetStatus !== 3) { next('route'); return }

  await Character.updateSheetStatus(parseInt(req.params.id), sheetStatus)

  res.status(200).json(true)
}
