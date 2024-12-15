const { GetRandomHadith } = require('./hadith')
const { getAyah } = require('./quraan')

const DEFAULT_DUAA = 'اللهم احفظ السودان واهله ❤️ سبحان الله وبحمده'

/**
 * @typedef {Object} Hadith
 * @property {string} arab - The Arabic text of the Hadith.
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
    try {
        let text
        if (turns) {
            // Fetch a random Hadith
            const hadith = await GetRandomHadith()
            if (hadith && hadith.arab && hadith.book) {
                text = `${hadith.arab} 💚 book (${hadith.book}) (${hadith.number})`
            } else {
                text = `${DEFAULT_DUAA} 💚 hadith failed`
            }
        } else {
            // Fetch a random Ayah
            const ayah = await getAyah(language)
            if (ayah && ayah.text && ayah.surah_name && ayah.ayah_num) {
                text = `${ayah.text} ❤️ ${ayah.surah_name} (${ayah.ayah_num})`
            }
        }
        if (!text) {
            // If no text was fetched, toggle turns and try again
            turns = !turns
            return getText(turns, language)
        }
        return text
    } catch (error) {
        console.error('Error fetching text:', error)
        return DEFAULT_DUAA
    }
}

module.exports.getText = getText
