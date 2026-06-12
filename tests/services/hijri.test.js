const { HijriCalendarService } = require('../../services/hijri-service')
const { UmmahAPI } = require('../../ummah-api')

describe('HijriCalendarService', () => {
  let api
  let hijriService

  beforeEach(() => {
    api = new UmmahAPI()
    hijriService = new HijriCalendarService()
    hijriService.api = api
  })

  test('should fetch today\'s Hijri date', async () => {
    const mockData = {
      date: '1445-01-01',
      month: 'Muharram',
      year: 1445,
      day: 1
    }
    api.get = jest.fn().mockResolvedValue(mockData)

    const hijriDate = await hijriService.getTodayHijriDate()
    expect(hijriDate).toBeDefined()
    expect(hijriDate.date).toBeDefined()
    expect(hijriDate.month).toBeDefined()
    expect(hijriDate.year).toBeDefined()
    expect(hijriDate.day).toBeDefined()
    expect(hijriDate.date).toBe('1445-01-01')
    expect(hijriDate.month).toBe('Muharram')
    expect(hijriDate.year).toBe(1445)
    expect(hijriDate.day).toBe(1)
  })
})