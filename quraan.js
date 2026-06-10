const { fetchFromUmmah } = require('./ummahapi')

const specificAyahCache = {}
const UMMAH_API_KEY = 'umh_3e5af9c544dfcf970f24d6ed97800ed29bb6ff54'

function getAyahText(ayah, language) {
    if (language === 'ar') return ayah.text_uthmani || ayah.arabic || ayah.text
    return ayah.translation || ayah.english || ayah.text
}

function getSurahName(ayah, language, defaultName) {
    if (language === 'ar') return ayah.surah_name_arabic || ayah.surah_name || defaultName
    return ayah.surah_name_english || ayah.surah_name || defaultName
}

async function getRandomAyah() {
    try {
        // Try random verse endpoint
        const data = await fetchFromUmmah('/quran/random')
        return data.verse || data
    } catch (e) {
        // Fallback to random surah and ayah if random doesn't exist
        const surah = Math.floor(Math.random() * 114) + 1
        const ayah = Math.floor(Math.random() * 5) + 1 // Safe guess
        const data = await fetchFromUmmah(`/quran/surah/${surah}/ayah/${ayah}?apikey=${UMMAH_API_KEY}`)
        return data.verse || data
    }
}

async function getAyah(language) {
    try {
        const ayah = await getRandomAyah()
        return {
            text: getAyahText(ayah, language),
            surah_name: getSurahName(ayah, language, `Surah ${ayah.surah_number}`),
            ayah_num: ayah.verse_number || ayah.ayah || 'N/A',
        }
    } catch (error) {
        console.error('Error fetching Ayah text:', error)
        throw error
    }
}

async function getSpecificAyah(surahNumber, ayah_num, language) {
    const cacheKey = `${language}:${surahNumber}:${ayah_num}`
    if (specificAyahCache[cacheKey]) return specificAyahCache[cacheKey]

    try {
        const data = await fetchFromUmmah(`/quran/surah/${surahNumber}/ayah/${ayah_num}?apikey=${UMMAH_API_KEY}`)
        const ayah = data.verse || data
        const result = {
            text: getAyahText(ayah, language),
            surah_name: getSurahName(ayah, language, `Surah ${surahNumber}`),
            ayah_num: ayah.verse_number || ayah_num,
        }
        specificAyahCache[cacheKey] = result
        return result
    } catch (error) {
        console.error('Error fetching specific Ayah:', error)
        throw error
    }
}

module.exports = {
    getSpecificAyah,
    getAyah
}
