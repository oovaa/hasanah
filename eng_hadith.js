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
 * Utility to handle API fetch with better error handling and timeout.
 * @param {string} url - The API endpoint.
 * @param {object} [options] - Fetch options.
 * @param {number} [timeout=10000] - Timeout in ms.
 * @returns {Promise<Response>} The fetch response.
 */
async function safeFetch(url, options = {}, timeout = 10000) {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        })
        clearTimeout(id)
        return response
    } catch (error) {
        clearTimeout(id)
        if (error.name === 'AbortError') {
            throw new Error('Request timed out')
        }
        throw error
    }
}

/**
 * Retrieves a random Hadith from the API.
 * @returns {Promise<Object|string>} A Promise that resolves to a random Hadith object or an error message.
 */
async function fetchRandomHadith() {
    const book = slugs[Math.floor(Math.random() * slugs.length)]
    try {
        const response = await safeFetch(
            `https://www.hadithapi.com/api/hadiths/?apiKey=$2y$10$P8VPmYSunct4p52yC32YGuoZ9fIcC6nbNEine2UK6hISoIRp78i&paginate=80&book=${book}`
        )
        if (!response.ok) {
            const text = await response.text()
            throw new Error(
                `Network response was not ok: ${response.status} - ${text}`
            )
        }
        const data = await response.json()
        if (
            !data ||
            !data['hadiths'] ||
            !Array.isArray(data['hadiths']['data'])
        ) {
            throw new Error('Invalid API response structure')
        }
        const hadiths = data['hadiths']['data']
        if (!hadiths.length) throw new Error('No hadiths found in response')
        const randomIndex = Math.floor(Math.random() * hadiths.length)
        return hadiths[randomIndex]
    } catch (error) {
        console.error('Error fetching random Hadith:', error)
        if (
            error.message &&
            error.message.includes('Network response was not ok')
        ) {
            throw new Error('Network error: ' + error.message)
        }
        throw new Error('Failed to fetch hadith: ' + error.message)
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
                book: hadith['book']?.['bookName'] || 'Unknown',
                number: hadith['hadithNumber'] || 'N/A',
            }
        } else {
            throw new Error('No hadith found')
        }
    } catch (error) {
        console.error('Error printing random Hadith:', error)
        throw new Error(error.message || 'Unknown error')
    }
}

module.exports.GetRandomHadith_ENG = GetRandomHadith_ENG

// Usage example:
// @ts-ignore
// time('start')
// for (let i = 0; i < 10; i++) {
// let h = await GetRandomHadith_ENG()
// console.log(h)
// }
// timeEnd('start')
