const { UmmahAPI } = require('../ummah-api')

class HadithService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getRandomHadith(language = 'ar') {
    const response = await this.api.get('/hadith/random')
    return this.formatHadith(response.data, language)
  }

  async getSpecificHadith(collection, number, language = 'ar') {
    const response = await this.api.get(`/hadith/${collection}/${number}`)
    return this.formatHadith(response.data, language)
  }

  formatHadith(data, language) {
    return {
      hadith: language === 'ar' ? (data.arabic || data.english || '') : (data.english || data.arabic || ''),
      author: data.collection_name || '',
      number: data.hadithnumber || '',
      collection: data.collection || data.id || ''
    }
  }
}

module.exports = { HadithService }