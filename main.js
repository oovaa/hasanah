const { GetRandomHadith_ENG } = require('./eng_hadith')
const { GetRandomHadith } = require('./hadith')
const { getAyah } = require('./quraan')

/**
 * @typedef {Object} Hadith
 * @property {string} hadith - The text of the Hadith.
 * @property {string} book - The book where the Hadith is found.
 * @property {number} number - The number of the Hadith in the book.
 */

/**
 * @typedef {Object} Ayah
 * @property {string} text - The text of the Ayah.
 * @property {string} surah_name - The name of the Surah.
 * @property {number} ayah_num - The number of the Ayah.
 */

/**
 * Fetches either a random Hadith or Ayah based on the turns flag and language.
 * @param {boolean} turns - Whether to show a Hadith (true) or an Ayah (false).
 * @param {string} language - The language for the Ayah (en for English, ar for Arabic).
 * @returns {Promise<string>} The text to display.
 */

async function getText(turns, language) {
    // The 'turns' parameter is a boolean that determines whether to fetch a Hadith (if true) or an Ayah (if false).
    // If fetching fails, the function toggles 'turns' and tries fetching the other type of text.
    let text
    const DEFAULT_DUAA =
        language === 'ar'
            ? 'اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده'
            : 'O God, protect Sudan and its people ❤️ Glory to God and praise to Him'

    try {
        if (turns) {
            const hadith =
                language === 'ar'
                    ? await GetRandomHadith()
                    : await GetRandomHadith_ENG()

            text = `${hadith.hadith} 💚 book (${hadith.book}) (${hadith.number})`
        } else {
            const ayahData = await getAyah(language)
            text = `${ayahData.text} ❤️ ${ayahData.surah_name} (${ayahData.ayah_num})`
        }
    } catch (error) {
        console.error('Error fetching text:', error)
        text = turns ? `${DEFAULT_DUAA} 💚` : DEFAULT_DUAA
    }
    return text
}

// console.log(await getText(false, 'en'))

module.exports.getText = getText
