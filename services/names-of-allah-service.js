const { UmmahAPI } = require('../ummah-api')

class NamesOfAllahService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getAllNames(language = 'en') {
    const endpoint = '/names-of-allah'
    const params = { language }
    return this.api.get(endpoint, params)
  }

  async getName(nameId) {
    const endpoint = `/names-of-allah/${nameId}`
    return this.api.get(endpoint, {})
  }

  async getByCategory(category, language = 'en') {
    const endpoint = `/names-of-allah/category/${category}`
    const params = { language }
    return this.api.get(endpoint, params)
  }

  async getByLetter(letter, language = 'en') {
    const endpoint = `/names-of-allah/letter/${letter}`
    const params = { language }
    return this.api.get(endpoint, params)
  }
}

module.exports = { NamesOfAllahService }