async function getRandomSurah() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah')
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        const surahs = data['data']
        const surahs_number = Math.floor(Math.random() * surahs.length)
        return surahs[surahs_number]
    } catch (error) {
        console.error('Error fetching random Surah:', error)
        throw error // Rethrow the error after logging it
    }
}

async function getRandomAyah(surah) {
    try {
        const ayahNumber = Math.floor(Math.random() * surah.numberOfAyahs) + 1
        const response = await fetch(
            `https://api.alquran.cloud/v1/ayah/${surah.number}:${ayahNumber}`
        )
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const data = await response.json()
        return data['data']
    } catch (error) {
        console.error('Error fetching random Ayah:', error)
        throw error // Rethrow the error after logging it
    }
}

async function oldgetAyahText() {
    try {
        const surah = await getRandomSurah()
        const ayah = await getRandomAyah(surah)
        return ayah
    } catch (error) {
        console.error('Error fetching Ayah text:', error)
        throw error // Rethrow the error after logging it
    }
}

async function oldgetSpecificAyah(surahNumber, ayahNumber) {
    if (typeof surahNumber !== 'number' || typeof ayahNumber !== 'number') {
        surahNumber = parseInt(surahNumber)
        ayahNumber = parseInt(ayahNumber)
    }
    try {
        const response = await fetch(
            `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}`
        )
        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`)
            throw new Error(`HTTP error! status: ${response.status}`)
        }
        const json_res = await response.json()
        const data = json_res['data']

        const ans = {
            text: data['text'],
            ssurah_name: data['surah']['name'],
            ayahNumber,
        }
        return ans
    } catch (error) {
        console.error('Error fetching specific Ayah:', error)
        throw error // Rethrow the error after logging it
    }
}

module.exports.oldgetSpecificAyah = oldgetSpecificAyah
module.exports.oldgetAyahText = oldgetAyahText

// Usage examples:
// let data = await oldgetSpecificAyah(2, 255);
// console.log(data.text, data.numberInSurah, data.surah.name);

// oldgetAyahText().then(ayah => {
//   // You can handle the returned ayah here
//   console.log(ayah.text);
// });
