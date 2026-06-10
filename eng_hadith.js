const { fetchFromUmmah } = require('./ummahapi')

async function GetRandomHadith_ENG() {
    try {
        const data = await fetchFromUmmah('/hadith/random')
        const h = data

        if (h) {
            return {
                hadith: h.english || h.text || 'English text unavailable',
                author: h.collection_name || h.collection || 'Unknown',
                number: h.hadithnumber || h.number || 'N/A',
            }
        } else {
            throw new Error('No hadith found')
        }
    } catch (error) {
        console.error('Error fetching random Hadith:', error)
        throw new Error(error.message || 'Unknown error')
    }
}

module.exports.GetRandomHadith_ENG = GetRandomHadith_ENG
