const { UmmahAPI } = require('../ummah-api')

class PrayerTimeService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getPrayerTimes(latitude, longitude, method = 'MuslimWorldLeague', madhab = 'Shafi') {
    const params = {
      lat: latitude,
      lng: longitude,
      method,
      madhab
    }
    const response = await this.api.get('/prayer-times', params)
    return this.formatPrayerTimes(response.data)
  }

  formatPrayerTimes(data) {
    return {
      date: data.date,
      timezone: data.timezone,
      location: data.location,
      method: data.calculation_method,
      madhab: data.madhab,
      prayer_times: data.prayer_times,
      current_status: data.current_status
    }
  }
}

module.exports = { PrayerTimeService }
