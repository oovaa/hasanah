const { PrayerTimeService } = require('./prayer-time-service')
const { LocationService } = require('./location-service')

class PrayerAlertService {
  constructor() {
    this.prayerTimeService = new PrayerTimeService()
    this.locationService = new LocationService()
    this.currentTimes = null
    this.sentAlerts = {}
    this.location = null
    this.intervalId = null
  }

  async start(onNotify) {
    try {
      this.location = await this.locationService.getCurrentLocation()
      await this.fetchTodayTimes()
    } catch {
      return
    }
    this.intervalId = setInterval(() => this.check(onNotify), 60000)
    this.check(onNotify)
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  async fetchTodayTimes() {
    this.currentTimes = await this.prayerTimeService.getPrayerTimes(
      this.location.latitude, this.location.longitude
    )
    this.sentAlerts = {}
  }

  check(onNotify) {
    if (!this.currentTimes) return
    const now = new Date()
    const today = now.toISOString().split('T')[0]
    if (this.currentTimes.date !== today) {
      this.fetchTodayTimes().catch(() => {})
      return
    }
    const prayerNames = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    const nowTs = now.getTime()
    for (const name of prayerNames) {
      const dt = this.currentTimes.prayer_datetimes[name]
      if (!dt) continue
      const prayerTs = new Date(dt).getTime()
      const diffMs = prayerTs - nowTs
      const diffMin = Math.round(diffMs / 60000)
      if (diffMin > 1 && diffMin <= 10 && !this.sentAlerts[`${name}_10`]) {
        this.sentAlerts[`${name}_10`] = true
        onNotify(`${diffMin} minutes to ${capitalize(name)} prayer`, 6000)
      }
      if (diffMin >= 0 && diffMin <= 1 && !this.sentAlerts[`${name}_1`]) {
        this.sentAlerts[`${name}_1`] = true
        onNotify(`${capitalize(name)} prayer is now!`, 8000)
      }
    }
  }

  async getLocation() {
    if (this.location) return this.location
    this.location = await this.locationService.getCurrentLocation()
    return this.location
  }
}

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1) }

module.exports = { PrayerAlertService }
