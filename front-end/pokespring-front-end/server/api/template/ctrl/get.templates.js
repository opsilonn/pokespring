import Template from '../../../models/template.model.js'
import { baseAPI } from '../../routes.js'

/**
 * @param { import('express').Request } req
 * @param { import('express').Response } res
 */
export default function getTemplates (req, res) {
  Template.getAll()
    .then((templates) => {
      res.status(200).json(Template.asResourceList(baseAPI(req), templates))
    })
}
