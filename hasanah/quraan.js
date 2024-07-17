const API_BASE_URL = 'https://quranapi.pages.dev/api'
const TOTAL_SURAH = 114

function getRandomNum(range) {
  return Math.floor(Math.random() * range) + 1
}

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

async function newgetAyah() {
  const surah_num = getRandomNum(TOTAL_SURAH)
  const url = `${API_BASE_URL}/${surah_num}.json`
  const data = await fetchFromAPI(url)
  const numofayahs = data['totalAyah'] - 1
  const ayah_num = getRandomNum(numofayahs)
  const ayah = data['arabic1'][ayah_num]
  const surah_name = data['surahNameArabic']
  return { ayah, surah_name, ayah_num: ayah_num + 1 } // Adjust for zero-based index
}

async function displayRandomAyah() {
  try {
    const test = await newgetAyah()
    console.log(test)
  } catch (error) {
    console.error(`Error displaying Ayah: ${error.message}`)
  }
}

// إِنَّ ٱلْأَبْرَارَ يَشْرَبُونَ مِن كَأْسٍ كَانَ مِزَاجُهَا كَافُورًا
// مِن شَرِّ مَا خَلَقَ

module.exports.newgetAyah = newgetAyah
