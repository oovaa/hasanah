const { UmmahAPI } = require('../ummah-api')

class DuaaService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getRandomDuaa() {
    const response = await this.api.get('/duas/random')
    return this.formatDuaa(response.data)
  }

  formatDuaa(data) {
    return {
      text: data.arabic || data.translation || '',
      translation: data.translation || '',
      transliteration: data.transliteration || '',
      category: data.category_info?.name || data.category || '',
      source: data.source || '',
      title: data.title || ''
    }
  }
}

module.exports = { DuaaService }
