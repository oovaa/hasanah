/**
 * Fetches a random Ayah from the Quran in the specified language.
 *
 * @param {string} language - The language code for the Ayah ('ar' for Arabic, 'en' for English).
 * @returns {Promise<Object>} A promise that resolves to the data of the random Ayah.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
async function getRandomAyah(language) {
    try {
        const ayahNumber = Math.floor(Math.random() * 6236) + 1
        const extension = language == 'ar' ? 'ar.asad' : 'en.asad'
        const url = `https://api.alquran.cloud/v1/ayah/${ayahNumber}/`
        const response = await fetch(url + extension)

        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        return data['data']
    } catch (error) {
        console.error('Error fetching random Ayah:', error)
        throw error // Rethrow the error after logging it
    }
}

/**
 * Fetches a random Ayah (verse) text in the specified language.
 *
 * @async
 * @function getAyah
 * @param {string} language - The language in which to fetch the Ayah text.
 *                            Use 'ar' for Arabic or any other language code for the respective translation.
 * @returns {Promise<Object>} A promise that resolves to an object containing the Ayah text,
 *                            Surah name, and Ayah number.
 * @throws Will throw an error if there is an issue fetching the Ayah text.
 */
async function getAyah(language) {
    try {
        const ayah = await getRandomAyah(language)
        const result = {
            ayah: ayah.text,
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
 *
 * @param {string} surahNumber - The number of the Surah (chapter) in the Quran.
 * @param {string} ayah_num - The number of the Ayah (verse) in the Surah.
 * @param {string} language - The language code for the translation ('ar' for Arabic, 'en' for English).
 * @returns {Promise<Object>} A promise that resolves to an object containing the Ayah text, Surah name, and Ayah number.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
async function getSpecificAyah(surahNumber, ayah_num, language) {
    const url = `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayah_num}/`
    const extension = language == 'ar' ? 'ar.asad' : 'en.asad'
    try {
        const response = await fetch(url + extension)
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`)
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json_res = await response.json()
        const data = json_res['data']

        const ans = {
            text: data['text'],
            surah_name:
                language == 'ar' ? data.surah.name : data.surah.englishName,
            ayah_num,
        }
        return ans
    } catch (error) {
        console.error('Error fetching specific Ayah:', error)
        throw error // Rethrow the error after logging it
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
