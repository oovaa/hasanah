const { QuranService } = require('../../services/quran-service')
const { UmmahAPI } = require('../../ummah-api')

describe('QuranService', () => {
  let api
  let quranService

  beforeEach(() => {
    api = new UmmahAPI()
    quranService = new QuranService(api)
  })

  test('should initialize with API instance', () => {
    expect(quranService.api).toBe(api)
  })

  test('should get surah', async () => {
    const mockData = { surah: 1, verses: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await quranService.getSurah(1)

    expect(api.get).toHaveBeenCalledWith('/quran/surah/1', {})
    expect(result).toEqual(mockData)
  })

  test('should get surah with ayah range', async () => {
    const mockData = { surah: 1, verses: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await quranService.getSurah(1, '1-10')

    expect(api.get).toHaveBeenCalledWith('/quran/surah/1', { ayahRange: '1-10' })
    expect(result).toEqual(mockData)
  })

  test('should get juz', async () => {
    const mockData = { juz: 1, verses: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await quranService.getJuz(1)

    expect(api.get).toHaveBeenCalledWith('/quran/juz/1', {})
    expect(result).toEqual(mockData)
  })

  test('should search quran', async () => {
    const mockData = { results: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await quranService.search('test', 'en')

    expect(api.get).toHaveBeenCalledWith('/quran/search', { query: 'test', language: 'en' })
    expect(result).toEqual(mockData)
  })
})