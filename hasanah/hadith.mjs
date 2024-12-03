import dotenv from 'dotenv'
dotenv.config()

// API
// https://www.hadithapi.com/docs/hadiths

/**
 * Retrieves a random Hadith from the API.
 * @returns {Promise<Object|string>} A Promise that resolves to a random Hadith object or an error message.
 */
async function getRandomHadith() {
  try {
    const response = await fetch(`https://www.hadithapi.com/api/hadiths/?apiKey=${process.env.HADITH_API_KEY}`)

    if (!response.ok) {
      throw new Error('Network response was not ok ' + (await response.text()))
    }

    const data = await response.json()
  //   console.log(data)
    if (!data || !data['hadiths'] || !data['hadiths']['data']) {
      throw new Error('Invalid API response')
    }

    const hadiths = data['hadiths']['data']
    const randomIndex = Math.floor(Math.random() * hadiths.length)
    return hadiths[randomIndex]['hadithEnglish']
  } catch (error) {
    console.error('Error fetching random Hadith:', error.message)
    if (error.message === 'Network response was not ok') {
      return 'No internet connection available.'
    }
    return 'An error occurred: ' + error.message
  }
}
/**
 * Prints a random Hadith.
 * @returns {Promise<any>| null} The random Hadith object, or null if no Hadith is found.
 */
async function GetRandomHadith() {
  try {
    const hadith = await getRandomHadith()
    if (hadith) {
      // hadith['book'] = collection.arabic
      return hadith
    } else {
      throw new Error('No Hadith found.')
    }
  } catch (error) {
    console.error('Error printing random Hadith:', error.message)
    return null
  }
}

// module.exports.GetRandomHadith = GetRandomHadith

// Usage example:
let h = await GetRandomHadith();
console.log(h);
