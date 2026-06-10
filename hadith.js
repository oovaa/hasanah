const { fetchFromUmmah } = require('./ummahapi')

async function GetRandomHadith() {
    try {
        const data = await fetchFromUmmah('/hadith/random')
        const h = data

        if (h) {
            return {
                hadith: h.arabic || h.arab || h.text || 'Arabic text unavailable',
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

module.exports.GetRandomHadith = GetRandomHadith

// Usage example:
// let h = await GetRandomHadith()
// console.log(h)
