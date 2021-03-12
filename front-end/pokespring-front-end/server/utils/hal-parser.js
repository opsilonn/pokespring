import { Object } from 'core-js'
import hal from 'hal'

export class HalResourceData extends Object {}

export class HalToOneLinks extends Object {}

export class HalResource {
  /** @type { Number } */
  id
  /** @type { HalResourceData } */
  data
  /** @type { HalToOneLinks } */
  toOneLinks
  /** @type { String[] } */
  static toManyLinks = []

  /**
   * @param { String } baseAPI
   * @param { String } resourcePath
   * @returns { import('hal').Resource }
   */
  asResource (baseAPI, resourcePath) {
    // The data from the object
    const data = { }
    Object.keys(this.data).forEach((_) => {
      if (this.data[_] !== null) { data[_] = this.data[_] }
    })
    Object.keys(this.toOneLinks).forEach((_) => {
      if (this.toOneLinks[_] !== null) { data['id' + _.charAt(0).toUpperCase() + _.slice(1)] = this.toOneLinks[_] }
    })
    const resource = hal.Resource({ id: this.id, ...data },
      encodeURI(`${baseAPI + resourcePath}/${this.id}`))

    // the links one to one and many to one
    const toOneLinks = Object.keys(this.toOneLinks)
    toOneLinks.forEach((key) => {
      if (this.toOneLinks[key] != null) {
        // transform templateCategory to template-category
        const rel = ([...key].map(c => c === c.toLowerCase() ? c : '-' + c.toLowerCase())).join('')
        // transforme user to users OR template-category to template-categories
        const link = rel.charAt(rel.length - 1) !== 'y' ? rel + 's' : rel.slice(0, rel.length - 1) + 'ies'

        resource.link(rel,
          encodeURI(`${baseAPI + link}/${this.toOneLinks[key]}`))
      }
    })

    // the links one to many
    this.constructor.toManyLinks.forEach((toManyLink) => {
      resource.link(toManyLink,
        encodeURI(`${baseAPI + resourcePath}/${this.id}/${toManyLink}`))
    })

    return resource
  }

  /**
   * @param { String } baseAPI
   * @param { HalResource[] } list
   * @param { String } selfLink
   * @param { String } resourcePath
   * @param { typeof HalResource } Classe
   * @returns { import('hal').Resource }
   */
  static asResourceList (baseAPI, list, selfLink, resourcePath, Classe) {
    const resources = []
    for (const item of list) {
      const resource = new Classe(item)
      resources.push(resource.asResource(baseAPI, resourcePath).toJSON())
    }

    const resource = hal.Resource({ list: resources }, encodeURI(baseAPI + selfLink))

    return resource
  }
}

export default {
  HalResource,
  HalResourceData,
  HalToOneLinks
}
