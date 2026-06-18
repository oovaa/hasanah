const { UmmahAPI } = require('../ummah-api')

class TafsirService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getTafsir(surahNumber, ayahNumber, tafsirKey = 'ibn_kathir') {
    const response = await this.api.get(`/tafsir/${tafsirKey}/surah/${surahNumber}/ayah/${ayahNumber}`)
    return this.formatTafsir(response.data)
  }

  formatTafsir(data) {
    return {
      verse_key: data.verse_key,
      text: data.tafsir.text,
      author: data.tafsir.author,
      tafsir_name: data.tafsir.name,
      language: data.tafsir.language
    }
  }
}

module.exports = { TafsirService }
