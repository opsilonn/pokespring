import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import sharp from 'sharp'
import Character from '../../../models/character.model.js'

const fsAccess = promisify(fs.access)
const fsMkdir = promisify(fs.mkdir)
const fsUnlink = promisify(fs.unlink)

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function postMapImage (req, res) {
  const image = req.file
  try {
    const map = await Character.get(req.params.id)
    const pathURI = `universes/${map.toOneLinks.universe}/character/${req.params.id}`
    try {
      await fsAccess(path.join('static-back/back/', pathURI), fs.constants.W_OK)
    } catch {
      await fsMkdir(path.join('./static-back/back/', pathURI), { recursive: true })
    }

    await sharp(image.path)
      .resize(10000, 10000, { fit: 'inside', withoutEnlargement: true })
      .toFile(`./static-back/back/${pathURI}/character.jpg`)
    res.status(201).json(`/back/${pathURI}/character.jpg`)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.code)
    res.sendStatus(500)
  } finally {
    await fsUnlink(image.path)
  }
}
