import User from '../../../models/user.model.js'
import Universe from '../../../models/universe.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function postUniverseInvitation (req, res) {
  try {
    const user = await User.getByName(req.body.username)
    const bSucceeded = await Universe.inviteUser(parseInt(req.params.id), user.id, req.body.bIsGM)
    res.status(201).json(bSucceeded)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.code)
    const jsonErr = { code: err.code, message: 'Error while creating the new universe.\n' }

    if (err.code === 'ER_PARAMETER_UNDEFINED') {
      jsonErr.message += 'Missing a parameter.\n'
    } else if (err.code === 'ER_DUP_ENTRY') {
      jsonErr.message += 'Duplicate of a unique row.\n'
    }
    jsonErr.message += 'Please verify that your data is valid !'

    res.status(400).json(jsonErr)
  }
}
