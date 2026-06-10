const BASE_URL = 'https://ummahapi.com/api'

async function fetchFromUmmah(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`)
    if (!response.ok) {
        throw new Error(`UmmahAPI error: ${response.status}`)
    }
    const json = await response.json()
    if (json.success === false) {
        throw new Error(`UmmahAPI returned success: false`)
    }
    return json.data || json
}

async function getRandomDuaa() {
    return await fetchFromUmmah('/duas/random')
}

async function getRandomNameOfAllah() {
    const randomId = Math.floor(Math.random() * 99) + 1
    return await fetchFromUmmah(`/asma-ul-husna/${randomId}`)
}

async function getTafsir(tafsirId, surah, ayah) {
    return await fetchFromUmmah(`/tafsir/${tafsirId}/surah/${surah}/ayah/${ayah}`)
}

module.exports = {
    fetchFromUmmah,
    getRandomDuaa,
    getRandomNameOfAllah,
    getTafsir
}