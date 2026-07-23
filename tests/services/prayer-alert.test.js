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

  test('getLocation fetches from service when not cached', async () => {
    const s = new PrayerAlertService()
    s.locationService = { getCurrentLocation: () => Promise.resolve({ latitude: 15.5, longitude: 32.5, city: 'Khartoum', country: 'Sudan' }) }

    const loc = await s.getLocation()
    expect(loc.latitude).toBe(15.5)
    expect(loc.city).toBe('Khartoum')
  })

  test('check returns early when currentTimes is null', () => {
    const s = new PrayerAlertService()
    let called = false
    s.check(() => { called = true })
    expect(called).toBe(false)
  })

  test('start fetches location and times, calls check, sets intervalId', async () => {
    const s = new PrayerAlertService()
    s.locationService = { getCurrentLocation: () => Promise.resolve({ latitude: 15.5, longitude: 32.5, city: 'Khartoum', country: 'Sudan' }) }
    s.prayerTimeService = {
      getPrayerTimes: () => Promise.resolve({
        date: new Date().toISOString().split('T')[0],
        prayer_times: { fajr: '04:00', dhuhr: '12:00', asr: '15:30', maghrib: '18:15', isha: '19:45' },
        prayer_datetimes: {
          fajr: futureDate(30),
          dhuhr: futureDate(120),
          asr: futureDate(240),
          maghrib: futureDate(360),
          isha: futureDate(480)
        }
      })
    }

    const alerts = []
    await s.start((msg) => alerts.push(msg))

    expect(s.location).toBeDefined()
    expect(s.currentTimes).toBeDefined()
    expect(s.intervalId).toBeDefined()
    expect(alerts.length).toBe(0)
    s.stop()
  })

  test('stop clears interval', () => {
    const s = new PrayerAlertService()
    s.intervalId = setTimeout(() => {}, 1000)
    s.stop()
    expect(s.intervalId).toBeNull()
  })

  test('check fetches new times on date rollover', async () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    service.currentTimes = {
      date: yesterday.toISOString().split('T')[0],
      prayer_times: { fajr: '04:00', dhuhr: '12:00', asr: '15:30', maghrib: '18:15', isha: '19:45' },
      prayer_datetimes: {
        fajr: futureDate(7),
        dhuhr: futureDate(60),
        asr: futureDate(120),
        maghrib: futureDate(180),
        isha: futureDate(240)
      }
    }
    let fetchCalled = false
    service.prayerTimeService = {
      getPrayerTimes: () => {
        fetchCalled = true
        const today = new Date().toISOString().split('T')[0]
        return Promise.resolve({
          date: today,
          prayer_times: { fajr: '04:00', dhuhr: '12:00', asr: '15:30', maghrib: '18:15', isha: '19:45' },
          prayer_datetimes: {
            fajr: futureDate(7), dhuhr: futureDate(60), asr: futureDate(120),
            maghrib: futureDate(180), isha: futureDate(240)
          }
        })
      }
    }

    service.check(() => {})
    expect(fetchCalled).toBe(true)
  })

  test('fires alerts for multiple prayers simultaneously', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(5),
        dhuhr: futureDate(7),
        asr: futureDate(120),
        maghrib: futureDate(180),
        isha: futureDate(240)
      }
    }

    const alerts = []
    service.check((msg) => alerts.push(msg))
    expect(alerts.length).toBe(2)
    expect(alerts[0]).toContain('Fajr')
    expect(alerts[1]).toContain('Dhuhr')
  })

  test('does not alert for already-passed prayers', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(-5),
        dhuhr: futureDate(7),
        asr: futureDate(120),
        maghrib: futureDate(180),
        isha: futureDate(240)
      }
    }

    const alerts = []
    service.check((msg) => alerts.push(msg))
    expect(alerts.length).toBe(1)
    expect(alerts[0]).toContain('Dhuhr')
  })

  test('fires now alert at exact 1 minute mark', () => {
    service.currentTimes = {
      date: new Date().toISOString().split('T')[0],
      prayer_times: { fajr: '03:45', dhuhr: '12:58', asr: '18:12', maghrib: '20:30', isha: '22:10' },
      prayer_datetimes: {
        fajr: futureDate(0),
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
})
