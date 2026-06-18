const { LocationService } = require('../../services/location-service')

describe('LocationService', () => {
  let service

  beforeEach(() => {
    service = new LocationService()
  })

  test('should use ipapi.co as primary provider', async () => {
    const mockData = { latitude: 14.05, longitude: 35.35, city: 'Gedaref', country_name: 'Sudan' }
    global.fetch = () => Promise.resolve({ ok: true, json: () => Promise.resolve(mockData) })

    const loc = await service.getCurrentLocation()
    expect(loc.latitude).toBe(14.05)
    expect(loc.longitude).toBe(35.35)
    expect(loc.city).toBe('Gedaref')
    expect(loc.country).toBe('Sudan')
  })

  test('should fallback to ip-api.com when ipapi.co fails', async () => {
    let calls = 0
    global.fetch = () => {
      calls++
      if (calls === 1) return Promise.reject(new Error('ipapi.co down'))
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'success', lat: 40.71, lon: -74.01, city: 'New York', country: 'United States' })
      })
    }

    const loc = await service.getCurrentLocation()
    expect(loc.latitude).toBe(40.71)
    expect(loc.longitude).toBe(-74.01)
    expect(loc.city).toBe('New York')
    expect(calls).toBe(2)
  })

  test('should throw when all providers fail', async () => {
    global.fetch = () => Promise.reject(new Error('network error'))

    await expect(service.getCurrentLocation()).rejects.toThrow('Failed to detect location')
  })
})
