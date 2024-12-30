// API
// https://www.hadithapi.com/docs/hadiths

const slugs = [
    'sahih-bukhari',
    'sahih-muslim',
    'al-tirmidhi',
    'abu-dawood',
    'ibn-e-majah',
    'sunan-nasai',
]

/**
 * Retrieves a random Hadith from the API.
 * @returns {Promise<Object|string>} A Promise that resolves to a random Hadith object or an error message.
 */
async function fetchRandomHadith() {
    const book = slugs[Math.floor(Math.random() * slugs.length)]

    try {
        const response = await fetch(
            `https://www.hadithapi.com/api/hadiths/?apiKey=$2y$10$P8VPmYSunct4p52yC32YGuoZ9fIcC6nbNEine2UK6hISoIRp78i&paginate=70&book=${book}`
        )

        if (!response.ok) {
            throw new Error(
                'Network response was not ok ' + (await response.text())
            )
        }

        const data = await response.json()
        if (!data || !data['hadiths'] || !data['hadiths']['data']) {
            throw new Error('Invalid API response')
        }

        const hadiths = data['hadiths']['data']
        const randomIndex = Math.floor(Math.random() * hadiths.length)
        return hadiths[randomIndex]
    } catch (error) {
        console.error('Error fetching random Hadith:', error.message)
        if (error.message.includes('Network response was not ok')) {
            return 'No internet connection available.'
        }
        return 'An error occurred: ' + error.message
    }
}

/**
 * Prints a random Hadith.
 * @returns {Promise<any>| null} The random Hadith object, or null if no Hadith is found.
 */
async function GetRandomHadith_ENG(language = 'en') {
    const lang = {
        ar: 'hadithArabic',
        en: 'hadithEnglish',
        ur: 'hadithUrdu',
    }[language]

    try {
        const hadith = await fetchRandomHadith()
        if (hadith) {
            return {
                hadith: hadith[`${lang}`],
                book: hadith['book']['bookName'],
                number: hadith['hadithNumber'],
            }
        } else {
            throw new Error('No Hadith found.')
        }
    } catch (error) {
        console.error('Error printing random Hadith:', error.message)
        return null
    }
}

module.exports.GetRandomHadith_ENG = GetRandomHadith_ENG

// Usage example:
// @ts-ignore
// time('start')
// for (let i = 0; i < 10; i++) {
// let h = await GetRandomHadith_ENG('en')
// console.log(h)
// }
// timeEnd('start')
