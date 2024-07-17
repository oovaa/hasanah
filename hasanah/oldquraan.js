async function getRandomSurah() {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah')
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

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

async function getAyahText() {
  try {
    const surah = await getRandomSurah()
    const ayah = await getRandomAyah(surah)
    return ayah
  } catch (error) {
    console.error('Error fetching Ayah text:', error)
    throw error // Rethrow the error after logging it
  }
}

async function getSpecificAyah(surahNumber, ayahNumber) {
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
    const data = await response.json()
    return data['data']
  } catch (error) {
    console.error('Error fetching specific Ayah:', error)
    throw error // Rethrow the error after logging it
  }
}

module.exports.getSpecificAyah = getSpecificAyah
module.exports.getAyahText = getAyahText

// Usage examples:
// let data = await getSpecificAyah(2, 255);
// console.log(data.text, data.numberInSurah, data.surah.name);

// getAyahText().then(ayah => {
//   // You can handle the returned ayah here
//   console.log(ayah.text);
// });
