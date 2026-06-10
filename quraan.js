const { fetchFromUmmah } = require('./ummahapi')

const specificAyahCache = {}

async function getRandomAyah(language) {
    try {
        // Try random verse endpoint
        const data = await fetchFromUmmah('/quran/random')
        return data.verse || data
    } catch (e) {
        // Fallback to random surah and ayah if random doesn't exist
        const surah = Math.floor(Math.random() * 114) + 1
        const ayah = Math.floor(Math.random() * 5) + 1 // Safe guess
        const data = await fetchFromUmmah(`/quran/surah/${surah}/ayah/${ayah}?apikey=umh_3e5af9c544dfcf970f24d6ed97800ed29bb6ff54`)
        return data.verse || data
    }
}

async function getAyah(language) {
    try {
        const ayah = await getRandomAyah(language)
        return {
            text: language === 'ar' ? (ayah.text_uthmani || ayah.arabic || ayah.text) : (ayah.translation || ayah.english || ayah.text),
            surah_name: language === 'ar' ? (ayah.surah_name_arabic || ayah.surah_name || `Surah ${ayah.surah_number}`) : (ayah.surah_name_english || ayah.surah_name || `Surah ${ayah.surah_number}`),
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
        const data = await fetchFromUmmah(`/quran/surah/${surahNumber}/ayah/${ayah_num}?apikey=umh_3e5af9c544dfcf970f24d6ed97800ed29bb6ff54`)
        const ayah = data.verse || data
        const result = {
            text: language === 'ar' ? (ayah.text_uthmani || ayah.arabic || ayah.text) : (ayah.translation || ayah.english || ayah.text),
            surah_name: language === 'ar' ? (ayah.surah_name_arabic || ayah.surah_name || `Surah ${surahNumber}`) : (ayah.surah_name_english || ayah.surah_name || `Surah ${surahNumber}`),
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
