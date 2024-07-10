const collections = [
  { english: 'muslim', arabic: 'مسلم' },
  { english: 'bukhari', arabic: 'البخاري' },
  { english: 'tirmidzi', arabic: 'الترمذي' },
  { english: 'nasai', arabic: 'النسائي' },
  { english: 'abudaud', arabic: 'أبو داود' },
  { english: 'ibnumajah', arabic: 'ابن ماجه' },
  { english: 'ahmad', arabic: 'أحمد' },
  { english: 'darimi', arabic: 'الدارمي' },
  { english: 'malik', arabic: 'مالك' }
]

const getRandomCollection = () => {
  const randomIndex = Math.floor(Math.random() * collections.length)
  return collections[randomIndex]
}

const collection = getRandomCollection()

async function getRandomHadith() {
  try {
    const response = await fetch(
      `https://api.hadith.gading.dev/books/${collection.english}?range=300-500`
    )

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const data = await response.json()
    const hadiths = data['data']['hadiths']
    const randomIndex = Math.floor(Math.random() * hadiths.length)
    return hadiths[randomIndex]
  } catch (error) {
    console.error('Error fetching random Hadith:', error)
    if (error.message === 'Network response was not ok') {
      return 'No internet connection available.'
    }
    return 'An error occurred: ' + error.message
  }
}

async function printRandomHadith() {
  try {
    const hadith = await getRandomHadith()
    if (hadith) {
      hadith['book'] = collection.arabic
      return hadith
    } else {
      throw new Error('No Hadith found.')
    }
  } catch (error) {
    console.error('Error printing random Hadith:', error)
    return null
  }
}

module.exports.printRandomHadith = printRandomHadith

// Usage example:
// let h = await printRandomHadith();
// console.log(h);
