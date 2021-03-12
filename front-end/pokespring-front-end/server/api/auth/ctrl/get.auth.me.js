import Universe from '../../../models/universe.model.js'
import User from '../../../models/user.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function getMe (req, res) {
  const id = req.session.idUser

  try {
    const user = await User.get(id)

    const universesOwns = await Universe.getByUser(user.id)
    const universesPlays = await Universe.getByUserIsPlayingIn(user.id)

    const uo = []
    universesOwns.forEach(_ => uo.push({
      ...new Universe(_).asResource('', '')
    }))
    uo.forEach((_) => {
      delete _._links
      delete _._embedded
    })

    const up = []
    universesPlays.forEach(_ => up.push({
      ...new Universe(_).asResource('', ''),
      bIsGM: !!_.bIsGM
    }))
    up.forEach((_) => {
      delete _._links
      delete _._embedded
    })

    const returnValue = user.asResource(baseAPI(req))
    returnValue.universesOwns = uo
    returnValue.universesPlays = up

    res.status(200).json(returnValue)
  } catch {
    res.sendStatus(500)
  }
}
