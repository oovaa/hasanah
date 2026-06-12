const { UmmahAPI } = require('../ummah-api')

class HadithService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getHadith(book, chapter, verse = null) {
    const endpoint = `/hadith/${book}/${chapter}`
    const params = verse ? { verse } : {}
    return this.api.get(endpoint, params)
  }

  async getSahihBukhari() {
    const endpoint = '/hadith/sahih-bukhari'
    return this.api.get(endpoint, {})
  }

  async getMuslim() {
    const endpoint = '/hadith/muslim'
    return this.api.get(endpoint, {})
  }

  async search(query, language = 'en') {
    const endpoint = '/hadith/search'
    const params = { query, language }
    return this.api.get(endpoint, params)
  }
}

module.exports = { HadithService }