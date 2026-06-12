const { UmmahAPI } = require('../ummah-api')

class HijriService {
  constructor(api) {
    this.api = api || new UmmahAPI()
  }

  async getDate(gregorianDate = null) {
    const endpoint = '/hijri/date'
    const params = gregorianDate ? { date: gregorianDate } : {}
    return this.api.get(endpoint, params)
  }

  async getCalendar(year, month) {
    const endpoint = `/hijri/calendar/${year}/${month}`
    return this.api.get(endpoint, {})
  }

  async getIslamicEvents() {
    const endpoint = '/hijri/events'
    return this.api.get(endpoint, {})
  }

  async getPrayerTimes(lat, lng, date = null) {
    const endpoint = '/hijri/prayer-times'
    const params = { lat, lng }
    if (date) params.date = date
    return this.api.get(endpoint, params)
  }
}

module.exports = { HijriService }