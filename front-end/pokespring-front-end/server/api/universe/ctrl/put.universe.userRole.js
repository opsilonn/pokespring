import Universe from '../../../models/universe.model.js'
import User from '../../../models/user.model.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putUniverse (req, res) {
  try {
    const user = await User.getByName(req.body.username)
    const bSucceeded = await Universe.updateUserRole(parseInt(req.params.id), user.id, req.body.bIsGM)
    res.status(200).json(bSucceeded)
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.code)
    const jsonErr = { code: err.code, message: 'Error while updating the new universe.\n' }

    if (err.code === 'ER_PARAMETER_UNDEFINED') {
      jsonErr.message += 'Missing a parameter.\n'
    }
    jsonErr.message += 'Please verify that your data is valid !'

    res.status(400).json(jsonErr)
  }
}
