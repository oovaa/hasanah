const { UmmahAPI } = require('../ummah-api')

class QuranService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getRandomAyah(language = 'ar') {
    const response = await this.api.get('/quran/random')
    return this.formatAyah(response.data, language)
  }

  async getSpecificAyah(surahNumber, ayahNumber, language = 'ar') {
    const response = await this.api.get(`/quran/surah/${surahNumber}/ayah/${ayahNumber}`, { script: 'uthmani' })
    return this.formatAyah(response.data, language)
  }

  formatAyah(data, language) {
    return {
      text: language === 'ar' ? data.verse.arabic : data.verse.translations.sahih_international,
      surah_name: language === 'ar' ? data.surah.name_arabic : data.surah.name_english,
      ayah_num: data.verse.ayah
    }
  }
}

module.exports = { QuranService }