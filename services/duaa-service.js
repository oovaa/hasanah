const { UmmahAPI } = require('../ummah-api')

class DuaaService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getDuaa(duaaId) {
    const endpoint = `/duaa/${duaaId}`
    return this.api.get(endpoint, {})
  }

  async getAllDuaa(category = null) {
    const endpoint = '/duaa'
    const params = category ? { category } : {}
    return this.api.get(endpoint, params)
  }

  async getMorningDuaa() {
    const endpoint = '/duaa/morning'
    return this.api.get(endpoint, {})
  }

  async getEveningDuaa() {
    const endpoint = '/duaa/evening'
    return this.api.get(endpoint, {})
  }

  async search(query, language = 'en') {
    const endpoint = '/duaa/search'
    const params = { query, language }
    return this.api.get(endpoint, params)
  }
}

module.exports = { DuaaService }