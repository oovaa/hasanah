const { UmmahAPI } = require('../ummah-api')

class HijriCalendarService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getTodayHijriDate() {
    const data = await this.api.get('/today-hijri')
    return this.formatHijriDate(data)
  }

  formatHijriDate(data) {
    return {
      date: data.date,
      month: data.month,
      year: data.year,
      day: data.day
    }
  }
}

module.exports = { HijriCalendarService }