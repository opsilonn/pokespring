import User from '../../../models/user.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function PutUser (req, res) {
  try {
    const user = await User.update(parseInt(req.params.id), req.body)
    res.status(200).json(user.asResource(baseAPI(req)))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log('err :', err)
    const jsonErr = { code: err.code, message: 'Error while modifying a user.\n' }

    if (err.code === 'ER_PARAMETER_UNDEFINED') {
      jsonErr.message += 'Missing a parameter.\n'
    } else if (err.code === 'ER_DUP_ENTRY') {
      jsonErr.message += 'Duplicate of a unique row.\n'
    }
    jsonErr.message += 'Please verify that your data is valid !'

    res.status(400).json(jsonErr)
  }
}
