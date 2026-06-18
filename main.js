const { HadithService } = require('./services/hadith-service')
const { QuranService } = require('./services/quran-service')
const { DuaaService } = require('./services/duaa-service')

const hadithService = new HadithService()
const quranService = new QuranService()
const duaaService = new DuaaService()

async function getRandomHadith(language) {
  const hadith = await hadithService.getRandomHadith(language)
  return `${hadith.hadith} 💚 author (${hadith.author}) (${hadith.number})`
}

async function getRandomAyah(language) {
  const ayahData = await quranService.getRandomAyah(language)
  return `${ayahData.text} ❤️ ${ayahData.surah_name} (${ayahData.ayah_num})`
}

async function getRandomDuaa(language) {
  const dua = await duaaService.getRandomDuaa()
  const text = language === 'ar' ? dua.text : (dua.translation || dua.text)
  return `${text} 🤲 ${dua.category}${dua.source ? ` (${dua.source})` : ''}`
}

async function getText(turn, language) {
  const DEFAULT_DUAA =
      language === 'ar'
          ? 'اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده'
          : 'O God, protect Sudan and its people ❤️ Glory to God and praise to Him'
  try {
    switch (turn) {
      case 0:
        return await getRandomHadith(language)
      case 1:
        return await getRandomAyah(language)
      case 2:
        return await getRandomDuaa(language)
      default:
        return await getRandomHadith(language)
    }
  } catch (error) {
    console.error('Error fetching text:', error)
    return DEFAULT_DUAA
  }
}

module.exports.getText = getText
