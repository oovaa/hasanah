const { UmmahAPI } = require('../ummah-api')

class HadithService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getRandomHadith() {
    const response = await this.api.get('/hadith/random')
    return this.formatHadith(response.data)
  }

  async getSpecificHadith(collection, number) {
    const response = await this.api.get(`/hadith/${collection}/${number}`)
    return this.formatHadith(response.data)
  }

  formatHadith(data) {
    return {
      hadith: data.hadith || data.arabic || '',
      author: data.author || data.book?.bookName || data.collection_name || '',
      number: data.number || data.hadithNumber || '',
      collection: data.collection || data.id || ''
    }
  }
}

module.exports = { HadithService }