import InterestPoint from '../../../models/interestPoint.model.js'
import { baseAPI } from '../../routes'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default async function putTemplate (req, res) {
  try {
    const interestPoint = await InterestPoint.update(parseInt(req.params.id), req.body)
    res.status(200).json(interestPoint.asResource(baseAPI(req)))
  } catch (err) {
    // eslint-disable-next-line no-console
    console.log(err.code)
    const jsonErr = { code: err.code, message: 'Error while updating the new template.\n' }

    if (err.code === 'ER_PARAMETER_UNDEFINED') {
      jsonErr.message += 'Missing a parameter.\n'
    }
    jsonErr.message += 'Please verify that your data is valid !'

    res.status(400).json(jsonErr)
  }
}
