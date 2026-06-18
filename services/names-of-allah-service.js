const { UmmahAPI } = require('../ummah-api')

class NamesOfAllahService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getAllNames() {
    const response = await this.api.get('/asma-ul-husna')
    return response.data
  }

  async getName(nameId) {
    const response = await this.api.get(`/asma-ul-husna/${nameId}`)
    return response.data
  }

  async getRandomName() {
    const response = await this.api.get('/asma-ul-husna/random')
    return response.data
  }

  async search(query) {
    const response = await this.api.get('/asma-ul-husna/search', { q: query })
    return response.data
  }
}

module.exports = { NamesOfAllahService }
