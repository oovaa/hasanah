const { PrayerTimeService } = require('../../services/prayer-time-service')
const { UmmahAPI } = require('../../ummah-api')

describe('PrayerTimeService', () => {
  let api
  let prayerTimeService

  beforeEach(() => {
    api = new UmmahAPI()
    prayerTimeService = new PrayerTimeService()
    prayerTimeService.api = api
  })

  test('should fetch prayer times with default method and madhab', async () => {
    const mockData = {
      data: {
        date: '2026-06-18',
        timezone: 'America/New_York',
        location: { latitude: 40.71, longitude: -74.01 },
        calculation_method: 'MuslimWorldLeague',
        madhab: 'Shafi',
        prayer_times: {
          fajr: '03:45',
          sunrise: '05:25',
          dhuhr: '12:58',
          asr: '18:12',
          maghrib: '20:30',
          isha: '22:10'
        },
        current_status: {
          current_prayer: 'fajr',
          next_prayer: 'sunrise',
          time_until_next: '13 minutes'
        }
      }
    }
    api.get = () => Promise.resolve(mockData)

    const result = await prayerTimeService.getPrayerTimes(40.71, -74.01)
    expect(result.date).toBe('2026-06-18')
    expect(result.timezone).toBe('America/New_York')
    expect(result.location.latitude).toBe(40.71)
    expect(result.location.longitude).toBe(-74.01)
    expect(result.method).toBe('MuslimWorldLeague')
    expect(result.madhab).toBe('Shafi')
    expect(result.prayer_times.fajr).toBe('03:45')
    expect(result.prayer_times.dhuhr).toBe('12:58')
    expect(result.prayer_times.isha).toBe('22:10')
    expect(result.current_status.current_prayer).toBe('fajr')
  })

  test('should fetch prayer times with custom method and madhab', async () => {
    const mockData = {
      data: {
        date: '2026-06-18',
        timezone: 'Europe/London',
        location: { latitude: 51.5, longitude: -0.13 },
        calculation_method: 'ISNA',
        madhab: 'Hanafi',
        prayer_times: {
          fajr: '02:45',
          sunrise: '04:45',
          dhuhr: '13:00',
          asr: '17:30',
          maghrib: '21:15',
          isha: '23:00'
        },
        current_status: {}
      }
    }
    api.get = () => Promise.resolve(mockData)

    const result = await prayerTimeService.getPrayerTimes(51.5, -0.13, 'ISNA', 'Hanafi')
    expect(result.method).toBe('ISNA')
    expect(result.madhab).toBe('Hanafi')
    expect(result.prayer_times.fajr).toBe('02:45')
  })

  test('should format prayer times data', () => {
    const data = {
      date: '2026-06-18',
      timezone: 'America/New_York',
      location: { latitude: 40.71, longitude: -74.01 },
      calculation_method: 'MuslimWorldLeague',
      madhab: 'Shafi',
      prayer_times: {
        fajr: '03:45',
        sunrise: '05:25',
        dhuhr: '12:58',
        asr: '18:12',
        maghrib: '20:30',
        isha: '22:10'
      },
      current_status: {}
    }
    const result = prayerTimeService.formatPrayerTimes(data)
    expect(result.date).toBe('2026-06-18')
    expect(result.method).toBe('MuslimWorldLeague')
    expect(result.prayer_times.fajr).toBe('03:45')
  })
})
