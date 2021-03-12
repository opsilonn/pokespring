import Universe from '../../../models/universe.model.js'
import User from '../../../models/user.model.js'

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export default async function login (req, res) {
  let user
  try {
    user = await User.getByName(req.body.username)
  } catch { }

  if (!user || !await User.checkPassword(req.body.username, req.body.password)) {
    await req.session.destroy()
    res.status(401).json({ message: 'Wrong username or password !' })
    return
  }

  req.session.idUser = user.id

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

  res.status(200).json({ id: user.id, username: user.data.username, universesOwns: uo, universesPlays: up })
}
