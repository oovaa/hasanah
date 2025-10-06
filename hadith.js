// Simple in-memory cache for Hadiths
const hadithCache = {}
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
 * Utility to handle API fetch with error handling and timeout.
 * @param {string} url - API endpoint.
 * @param {object} [options] - Fetch options.
 * @param {number} [timeout=10000] - Timeout in ms.
 * @returns {Promise<Response>} Fetch response.
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
 * @returns {Promise<Object>} Random Hadith object.
 */
async function getRandomHadith() {
    const cacheKey = collection.english
    if (hadithCache[cacheKey]) {
        const hadiths = hadithCache[cacheKey]
        const randomIndex = Math.floor(Math.random() * hadiths.length)
        return hadiths[randomIndex]
    }
    try {
        const response = await safeFetch(
            `https://api.hadith.gading.dev/books/${collection.english}?range=300-500`
        )
        if (!response.ok) {
            const text = await response.text()
            throw new Error(
                `Network response was not ok: ${response.status} - ${text}`
            )
        }
        const data = await response.json()
        if (!data || !data['data'] || !Array.isArray(data['data']['hadiths'])) {
            throw new Error('Invalid API response structure')
        }
        const hadiths = data['data']['hadiths']
        if (!hadiths.length) throw new Error('No hadiths found in response')
        hadithCache[cacheKey] = hadiths
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
 * Gets a random Hadith in Arabic.
 * @returns {Promise<Object>} Hadith object.
 */
async function GetRandomHadith() {
    try {
        const hadith = await getRandomHadith()
        if (hadith) {
            return {
                hadith: hadith['arab'],
                book: hadith['book'] || 'Unknown',
                number: hadith['number'] || 'N/A',
            }
        } else {
            throw new Error('No hadith found')
        }
    } catch (error) {
        console.error('Error printing random Hadith:', error)
        throw new Error(error.message || 'Unknown error')
    }
}

module.exports.GetRandomHadith = GetRandomHadith

// Usage example:
// let h = await GetRandomHadith()
// console.log(h)
