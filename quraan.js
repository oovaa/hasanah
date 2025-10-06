// Simple in-memory cache for Ayahs
const ayahCache = {}
const specificAyahCache = {}
/**
 * Fetches a random Ayah from the Quran in the specified language.
 * @param {string} language - Language code ('ar' for Arabic, 'en' for English).
 * @returns {Promise<Object>} Ayah data object.
 * @throws {Error} If fetch operation fails.
 */
async function getRandomAyah(language) {
    try {
        const ayahNumber = Math.floor(Math.random() * 6236) + 1
        const cacheKey = `${language}:${ayahNumber}`
        if (ayahCache[cacheKey]) {
            return ayahCache[cacheKey]
        }
        const extension = language == 'ar' ? 'ar.asad' : 'en.asad'
        const url = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/`
        const response = await fetch(url + extension)
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)
        const data = await response.json()
        ayahCache[cacheKey] = data['data']
        return data['data']
    } catch (error) {
        console.error('Error fetching random Ayah:', error)
        throw error // Rethrow the error after logging it
    }
}

/**
 * Fetches a random Ayah (verse) text in the specified language.
 * @param {string} language - Language code ('ar' for Arabic, 'en' for English).
 * @returns {Promise<Object>} Object containing Ayah text, Surah name, and Ayah number.
 * @throws {Error} If there is an issue fetching the Ayah text.
 */
async function getAyah(language) {
    try {
        const ayah = await getRandomAyah(language)
        const result = {
            text: ayah.text,
            surah_name:
                language == 'ar' ? ayah.surah.name : ayah.surah.englishName,
            ayah_num: ayah.numberInSurah,
        }
        return result
    } catch (error) {
        console.error('Error fetching Ayah text:', error)
        throw error // Rethrow the error after logging it
    }
}

/**
 * Fetches a specific Ayah from the Quran API.
 * @param {string} surahNumber - Surah (chapter) number.
 * @param {string} ayah_num - Ayah (verse) number.
 * @param {string} language - Language code ('ar' for Arabic, 'en' for English).
 * @returns {Promise<Object>} Object containing Ayah text, Surah name, and Ayah number.
 * @throws {Error} If fetch operation fails.
 */
async function getSpecificAyah(surahNumber, ayah_num, language) {
    const cacheKey = `${language}:${surahNumber}:${ayah_num}`
    if (specificAyahCache[cacheKey]) {
        return specificAyahCache[cacheKey]
    }
    const url = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayah_num}/`
    const extension = language == 'ar' ? 'ar.asad' : 'en.asad'
    try {
        const response = await fetch(url + extension)
        if (!response.ok) {
            const text = await response.text()
            throw new Error(
                `Network response was not ok: ${response.status} - ${text}`
            )
        }
        // @ts-ignore
        const { data } = await response.json()
        const result = {
            text: data.text,
            surah_name:
                language == 'ar' ? data.surah.name : data.surah.englishName,
            ayah_num: data.numberInSurah,
        }
        specificAyahCache[cacheKey] = result
        return result
    } catch (error) {
        console.error('Error fetching specific Ayah:', error)
        throw error
    }
}

// console.log(await oldgetSpecificAyah('12', '23', 'ar'))

module.exports.getSpecificAyah = getSpecificAyah
module.exports.getAyah = getAyah

// Usage examples:
// let data = await oldgetSpecificAyah(2, 255);
// console.log(data.text, data.numberInSurah, data.surah.name);

// getAyah('ar').then((ayah) => {
//     // You can handle the returned ayah here
//     console.log(ayah)
// })
