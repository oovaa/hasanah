const API_BASE_URL = 'https://quranapi.pages.dev/api'
const TOTAL_SURAH = 114

/**
 * @param {number} range
 */
function getRandomNum(range) {
  return Math.floor(Math.random() * range) + 1
}

/**
 * @param {string | URL | Request} url
 */
async function fetchFromAPI(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Failed to fetch data: ${error.message}`)
    throw error // Rethrow to handle it in the calling function if needed
  }
}

/**
 * Retrieves a random ayah (verse) from the Quran API.
 * @returns {Promise<{text: string, surah_name: string, ayah_num: number}>} The random ayah, along with its surah name and ayah number.
 */
/**
 * @typedef {Object} Ayah
 * @property {string} text - The text of the ayah.
 * @property {string} surah_name - The name of the surah.
 * @property {number} ayah_num - The number of the ayah.
 */

/**
 * Retrieves a random ayah (verse) from the Quran API.
 * @param {string} language - The language of the ayah ('ar' for Arabic, otherwise English).
 * @returns {Promise<Ayah>} The random ayah, along with its surah name and ayah number.
 */
async function getAyah(language) {
  const surah_num = getRandomNum(TOTAL_SURAH)
  const url = `${API_BASE_URL}/${surah_num}.json`
  const data = await fetchFromAPI(url)
  const numofayahs = data['totalAyah'] - 1
  const ayah_num = getRandomNum(numofayahs)
  const lang = language == 'ar' ? 'arabic1' : 'english'
  const ayah = data[lang][ayah_num]
  const surah_name = language == 'ar' ? data['surahNameArabic'] : data['surahName']

  // console.log({ text: ayah, surah_name, ayah_num: ayah_num + 1 });

  return { text: ayah, surah_name, ayah_num: ayah_num + 1 } // Adjust for zero-based index
}

/**
 * @param {String} surahNumber
 * @param {String} ayahNumber
 */
async function getSpecificAyah(surahNumber, ayahNumber, language) {
  const res = await fetchFromAPI(`${API_BASE_URL}/${surahNumber}/${ayahNumber}.json`)
  const ans = {
    text: language == 'ar' ? res['arabic1'] : res['english'],
    surah_name: language == 'ar' ? res['surahNameArabic'] : res['surahName'],
    ayahNumber
  }
  return ans
}

// إِنَّ ٱلْأَبْرَارَ يَشْرَبُونَ مِن كَأْسٍ كَانَ مِزَاجُهَا كَافُورًا
// مِن شَرِّ مَا خَلَقَ

module.exports.getAyah = getAyah
module.exports.getSpecificAyah = getSpecificAyah
