const { HadithService } = require('./services/hadith-service')
const { QuranService } = require('./services/quran-service')

const hadithService = new HadithService()
const quranService = new QuranService()

/**
 * @typedef {Object} Hadith
 * @property {string} hadith - The text of the Hadith.
 * @property {string} author - The author/narrator of the Hadith collection.
 * @property {number} number - The number of the Hadith in the collection.
 */

/**
 * @typedef {Object} Ayah
 * @property {string} text - The text of the Ayah.
 * @property {string} surah_name - The name of the Surah.
 * @property {number} ayah_num - The number of the Ayah.
 */

/**
 * Fetches either a random Hadith or Ayah based on the turns flag and language.
 * @param {boolean} turns - If true, fetch Hadith; if false, fetch Ayah.
 * @param {string} language - Language code ('en' for English, 'ar' for Arabic).
 * @returns {Promise<string>} The text to display in notification.
 */

async function getText(turns, language) {
    // If fetching fails, fallback to default Duaa.
    let text
    const DEFAULT_DUAA =
        language === 'ar'
            ? 'اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده'
            : 'O God, protect Sudan and its people ❤️ Glory to God and praise to Him'
    try {
        if (turns) {
            const hadith = await hadithService.getRandomHadith(language)

            text = `${hadith.hadith} 💚 author (${hadith.author}) (${hadith.number})`
        } else {
            const ayahData = await quranService.getRandomAyah(language)
            text = `${ayahData.text} ❤️ ${ayahData.surah_name} (${ayahData.ayah_num})`
        }
    } catch (error) {
        console.error('Error fetching text:', error)
        text = turns ? `${DEFAULT_DUAA} 💚` : DEFAULT_DUAA
    }
    return text
}

// console.log(await getText(true, 'ar'))

module.exports.getText = getText
