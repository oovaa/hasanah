const { HijriService } = require('../../services/hijri-service')
const { UmmahAPI } = require('../../ummah-api')

describe('HijriService', () => {
  let api
  let hijriService

  beforeEach(() => {
    api = new UmmahAPI()
    hijriService = new HijriService(api)
  })

  test('should initialize with API instance', () => {
    expect(hijriService.api).toBe(api)
  })

  test('should get date', async () => {
    const mockData = { hijriDate: '1445-01-01' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hijriService.getDate()

    expect(api.get).toHaveBeenCalledWith('/hijri/date', {})
    expect(result).toEqual(mockData)
  })

  test('should get date with gregorian date', async () => {
    const mockData = { hijriDate: '1445-01-01' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hijriService.getDate('2023-06-21')

    expect(api.get).toHaveBeenCalledWith('/hijri/date', { date: '2023-06-21' })
    expect(result).toEqual(mockData)
  })

  test('should get calendar', async () => {
    const mockData = { calendar: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hijriService.getCalendar(1445, 1)

    expect(api.get).toHaveBeenCalledWith('/hijri/calendar/1445/1', {})
    expect(result).toEqual(mockData)
  })

  test('should get events', async () => {
    const mockData = { events: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hijriService.getIslamicEvents()

    expect(api.get).toHaveBeenCalledWith('/hijri/events', {})
    expect(result).toEqual(mockData)
  })

  test('should get prayer times', async () => {
    const mockData = { prayerTimes: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hijriService.getPrayerTimes(31.0, 35.0)

    expect(api.get).toHaveBeenCalledWith('/hijri/prayer-times', { lat: 31.0, lng: 35.0 })
    expect(result).toEqual(mockData)
  })

  test('should get prayer times with date', async () => {
    const mockData = { prayerTimes: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hijriService.getPrayerTimes(31.0, 35.0, '2023-06-21')

    expect(api.get).toHaveBeenCalledWith('/hijri/prayer-times', { lat: 31.0, lng: 35.0, date: '2023-06-21' })
    expect(result).toEqual(mockData)
  })
})