const { UmmahAPI } = require('../ummah-api')

class HadithService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getRandomHadith(language = 'ar') {
    const response = await this.api.get('/hadith/random')
    return this.formatHadith(response.data, language)
  }

  async getSpecificHadith(collection, number, language = 'en') {
    const response = await this.api.get(`/hadith/${collection}/${number}`)
    return this.formatHadith(response.data, language)
  }

  formatHadith(data, language) {
    return {
      hadith: data.arabic || data.hadith || '',
      author: data.collection_name || data.author || '',
      number: data.hadithnumber || data.number || '',
      collection: data.collection || data.id || ''
    }
  }
}

module.exports = { HadithService }