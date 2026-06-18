const { LocationService } = require('../../services/location-service')

describe('LocationService', () => {
  let service

  beforeEach(() => {
    service = new LocationService()
  })

  test('should parse location from ip-api response', async () => {
    const mockData = { status: 'success', lat: 40.71, lon: -74.01, city: 'New York', country: 'United States' }
    global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })

    const loc = await service.getCurrentLocation()
    expect(loc.latitude).toBe(40.71)
    expect(loc.longitude).toBe(-74.01)
    expect(loc.city).toBe('New York')
    expect(loc.country).toBe('United States')
  })

  test('should throw on failed location detection', async () => {
    global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ status: 'fail', message: 'invalid query' }) })

    await expect(service.getCurrentLocation()).rejects.toThrow('invalid query')
  })
})
