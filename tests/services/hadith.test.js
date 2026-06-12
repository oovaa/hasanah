const { HadithService } = require('../../services/hadith-service')
const { UmmahAPI } = require('../../ummah-api')

describe('HadithService', () => {
  let api
  let hadithService

  beforeEach(() => {
    api = new UmmahAPI()
    hadithService = new HadithService(api)
  })

  test('should initialize with API instance', () => {
    expect(hadithService.api).toBe(api)
  })

  test('should get hadith', async () => {
    const mockData = { hadith: 'test hadith' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hadithService.getHadith('bukhari', 1)

    expect(api.get).toHaveBeenCalledWith('/hadith/bukhari/1', {})
    expect(result).toEqual(mockData)
  })

  test('should get hadith with verse', async () => {
    const mockData = { hadith: 'test hadith' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hadithService.getHadith('bukhari', 1, 10)

    expect(api.get).toHaveBeenCalledWith('/hadith/bukhari/1', { verse: 10 })
    expect(result).toEqual(mockData)
  })

  test('should get sahih bukhari', async () => {
    const mockData = { book: 'sahih-bukhari' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hadithService.getSahihBukhari()

    expect(api.get).toHaveBeenCalledWith('/hadith/sahih-bukhari', {})
    expect(result).toEqual(mockData)
  })

  test('should get muslim', async () => {
    const mockData = { book: 'muslim' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hadithService.getMuslim()

    expect(api.get).toHaveBeenCalledWith('/hadith/muslim', {})
    expect(result).toEqual(mockData)
  })

  test('should search hadith', async () => {
    const mockData = { results: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await hadithService.search('test', 'en')

    expect(api.get).toHaveBeenCalledWith('/hadith/search', { query: 'test', language: 'en' })
    expect(result).toEqual(mockData)
  })
})