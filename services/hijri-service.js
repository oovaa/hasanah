const { UmmahAPI } = require('../ummah-api')

class HijriCalendarService {
  constructor() {
    this.api = new UmmahAPI()
  }

  async getTodayHijriDate() {
    const response = await this.api.get('/today-hijri')
    return this.formatHijriDate(response.data.hijri)
  }

  formatHijriDate(data) {
    return {
      date: data.date,
      month: data.month_name,
      year: data.year,
      day: data.day
    }
  }
}

module.exports = { HijriCalendarService }