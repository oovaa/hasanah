class UmmahAPI {
  constructor(apiKey = null) {
    this.baseURL = 'https://ummahapi.com/api'
    this.apiKey = apiKey
    this.cache = {}
    this.cacheTimeout = 24 * 60 * 60 * 1000 // 24 hours
  }

  async get(endpoint, params = {}) {
    const cacheKey = `${endpoint}?${JSON.stringify(params)}`
    if (this.cache[cacheKey] && Date.now() - this.cache[cacheKey].timestamp < this.cacheTimeout) {
      return this.cache[cacheKey].data
    }

    const url = new URL(`${this.baseURL}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value))

    const headers = {}
    if (this.apiKey) {
      headers['x-api-key'] = this.apiKey
    }

    const response = await fetch(url.toString(), { headers })
    if (!response.ok) {
      throw new Error(`API error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    this.cache[cacheKey] = { data, timestamp: Date.now() }
    return data
  }
}

module.exports = { UmmahAPI }