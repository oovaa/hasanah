const collections = [
    { english: 'muslim', arabic: 'مسلم' },
    { english: 'bukhari', arabic: 'البخاري' },
    { english: 'tirmidzi', arabic: 'الترمذي' },
    { english: 'nasai', arabic: 'النسائي' },
    { english: 'abu-daud', arabic: 'أبو داود' },
    { english: 'ibnu-majah', arabic: 'ابن ماجه' },
    { english: 'ahmad', arabic: 'أحمد' },
    { english: 'darimi', arabic: 'الدارمي' },
    { english: 'malik', arabic: 'مالك' },
]

/**
 * Returns a random collection from the 'collections' array.
 * @returns {object} A random collection.
 */
const getRandomCollection = () => {
    const randomIndex = Math.floor(Math.random() * collections.length)
    return collections[randomIndex]
}

const collection = getRandomCollection()

/**
 * Retrieves a random Hadith from the API.
 * @returns {Promise<Object|string>} A Promise that resolves to a random Hadith object or an error message.
 */
async function getRandomHadith() {
    try {
        const response = await fetch(
            `https://api.hadith.gading.dev/books/${collection.english}?range=300-500`
        )

        if (!response.ok) {
            throw new Error(
                'Network response was not ok ' + (await response.text())
            )
        }

        const data = await response.json()
        if (!data || !data['data'] || !data['data']['hadiths']) {
            throw new Error('Invalid API response')
        }

        const hadiths = data['data']['hadiths']
        const randomIndex = Math.floor(Math.random() * hadiths.length)
        return hadiths[randomIndex]
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
            hadith['book'] = collection.arabic

            return {
                book: hadith.book,
                number: hadith.number,
                hadith: hadith.arab,
            }
        } else {
            throw new Error('No Hadith found.')
        }
    } catch (error) {
        console.error('Error printing random Hadith:', error.message)
        return null
    }
}

module.exports.GetRandomHadith = GetRandomHadith

// Usage example:
// let h = await GetRandomHadith()
// console.log(h)
