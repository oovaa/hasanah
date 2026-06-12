const { DuaaService } = require('../../services/duaa-service')
const { UmmahAPI } = require('../../ummah-api')

describe('DuaaService', () => {
  let api
  let duaaService

  beforeEach(() => {
    api = new UmmahAPI()
    duaaService = new DuaaService(api)
  })

  test('should initialize with API instance', () => {
    expect(duaaService.api).toBe(api)
  })

  test('should get duaa', async () => {
    const mockData = { duaa: 'test duaa' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await duaaService.getDuaa(1)

    expect(api.get).toHaveBeenCalledWith('/duaa/1', {})
    expect(result).toEqual(mockData)
  })

  test('should get all duaa', async () => {
    const mockData = { duaa: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await duaaService.getAllDuaa()

    expect(api.get).toHaveBeenCalledWith('/duaa', {})
    expect(result).toEqual(mockData)
  })

  test('should get all duaa with category', async () => {
    const mockData = { duaa: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await duaaService.getAllDuaa('morning')

    expect(api.get).toHaveBeenCalledWith('/duaa', { category: 'morning' })
    expect(result).toEqual(mockData)
  })

  test('should get morning duaa', async () => {
    const mockData = { duaa: 'morning' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await duaaService.getMorningDuaa()

    expect(api.get).toHaveBeenCalledWith('/duaa/morning', {})
    expect(result).toEqual(mockData)
  })

  test('should get evening duaa', async () => {
    const mockData = { duaa: 'evening' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await duaaService.getEveningDuaa()

    expect(api.get).toHaveBeenCalledWith('/duaa/evening', {})
    expect(result).toEqual(mockData)
  })

  test('should search duaa', async () => {
    const mockData = { results: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await duaaService.search('test', 'en')

    expect(api.get).toHaveBeenCalledWith('/duaa/search', { query: 'test', language: 'en' })
    expect(result).toEqual(mockData)
  })
})