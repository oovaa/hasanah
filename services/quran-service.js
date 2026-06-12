const { UmmahAPI } = require('../ummah-api')

class QuranService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getSurah(surahNumber, ayahRange = null) {
    const endpoint = `/quran/surah/${surahNumber}`
    const params = ayahRange ? { ayahRange } : {}
    return this.api.get(endpoint, params)
  }

  async getJuz(juzNumber) {
    const endpoint = `/quran/juz/${juzNumber}`
    return this.api.get(endpoint, {})
  }

  async search(query, language = 'en') {
    const endpoint = '/quran/search'
    const params = { query, language }
    return this.api.get(endpoint, params)
  }
}

module.exports = { QuranService }