const { PrayerAlertService } = require('../../services/prayer-alert-service')

function futureDate(minutesFromNow) {
  const d = new Date()
  d.setMinutes(d.getMinutes() + minutesFromNow)
  return d.toISOString()
}

describe('PrayerAlertService', () => {
  let service

  beforeEach(() => {
    service = new PrayerAlertService()
    service.location = { latitude: 40.71, longitude: -74.01, city: 'New York', country: 'US' }
  })

  test('should fire 10-minute alert for fajr', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(7),
        dhuhr: futureDate(60),
        asr: futureDate(120),
        maghrib: futureDate(180),
        isha: futureDate(240)
      }
    }

    const alerts = []
    service.check((msg) => alerts.push(msg))
    expect(alerts.length).toBe(1)
    expect(alerts[0]).toContain('minutes to Fajr prayer')
  })

  test('should fire now alert when 1 minute to prayer', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(1),
        dhuhr: futureDate(60),
        asr: futureDate(120),
        maghrib: futureDate(180),
        isha: futureDate(240)
      }
    }

    const alerts = []
    service.check((msg) => alerts.push(msg))
    expect(alerts.length).toBe(1)
    expect(alerts[0]).toBe('Fajr prayer is now!')
  })

  test('should not fire duplicate alerts', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(7),
        dhuhr: futureDate(60),
        asr: futureDate(120),
        maghrib: futureDate(180),
        isha: futureDate(240)
      }
    }

    const alerts = []
    service.check((msg) => alerts.push(msg))
    service.check((msg) => alerts.push(msg))
    expect(alerts.length).toBe(1)
  })

  test('should not fire alerts when prayer times are far away', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(30),
        dhuhr: futureDate(90),
        asr: futureDate(150),
        maghrib: futureDate(210),
        isha: futureDate(270)
      }
    }

    const alerts = []
    service.check((msg) => alerts.push(msg))
    expect(alerts.length).toBe(0)
  })

  test('should return cached location', async () => {
    const loc = await service.getLocation()
    expect(loc.latitude).toBe(40.71)
    expect(loc.city).toBe('New York')
  })
})
