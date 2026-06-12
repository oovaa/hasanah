const { HijriCalendarService } = require('./services/hijri-service')

const hijriCalendarService = new HijriCalendarService()

module.exports.getHijriDate = async () => {
  const hijriDate = await hijriCalendarService.getTodayHijriDate()
  return `${hijriDate.date} (${hijriDate.month} - ${hijriDate.year}) 🩵`
}
