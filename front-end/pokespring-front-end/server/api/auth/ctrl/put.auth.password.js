import User from '../../../models/user.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function changePassword (req, res) {
  try {
    if (!req.body.oldPassword) { throw new Error('`oldPassword` field required !') }
    if (!req.body.newPassword) { throw new Error('`newPassword` field required !') }

    const user = await User.get(req.session.idUser)

    if (!user || !await User.checkPassword(user.data.username, req.body.oldPassword)) {
      res.status(401).json({ message: 'Invalid password !' })
      return
    }

    const bSucceded = await User.changePassword(req.body.newPassword, parseInt(req.session.idUser))
    res.status(200).json(bSucceded)
  } catch (err) {
    res.status(400).json(err.message)
  }
}
