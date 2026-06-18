import { describe, test, expect, beforeEach, mock } from 'bun:test'

const mockFetch = (responseData, shouldFail = false) => {
  global.fetch = mock((url) => {
    if (shouldFail) return Promise.reject(new Error('Network error'))
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(responseData),
      text: () => Promise.resolve(JSON.stringify(responseData)),
    })
  })
}

describe('Arabic Hadith (hadith.js)', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../hadith.js')]
  })

  test('should return hadith with author field', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'حديث تجريبي',
        collection_name: 'صحيح البخاري',
        hadithnumber: 1,
        collection: 'bukhari',
        id: 'bukhari-1',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith } = require('../hadith.js')
    const result = await GetRandomHadith()

    expect(result).toBeDefined()
    expect(result.hadith).toBeDefined()
    expect(result.author).toBeDefined()
    expect(result.number).toBeDefined()
    expect(typeof result.author).toBe('string')
    expect(result.author.length).toBeGreaterThan(0)
  })

  test('should return Arabic author name correctly', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
        collection_name: 'صحيح البخاري',
        hadithnumber: 123,
        collection: 'bukhari',
        id: 'bukhari-123',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith } = require('../hadith.js')
    const result = await GetRandomHadith()

    expect(result.author).toBe('صحيح البخاري')
    expect(result.hadith).toBe('إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ')
    expect(result.number).toBe(123)
  })

  test('should handle different collections correctly', async () => {
    const collections = [
      { id: 'muslim', name: 'صحيح مسلم' },
      { id: 'tirmidzi', name: 'سنن الترمذي' },
      { id: 'nasai', name: 'سنن النسائي' },
      { id: 'abu-daud', name: 'سنن أبي داود' },
    ]

    for (const c of collections) {
      delete require.cache[require.resolve('../hadith.js')]

      mockFetch({
        success: true,
        service: 'hadith',
        data: {
          arabic: 'حديث من ' + c.name,
          collection_name: c.name,
          hadithnumber: 1,
          collection: c.id,
          id: c.id + '-1',
        },
        timestamp: '2026-06-12T00:00:00Z',
      })

      const { GetRandomHadith } = require('../hadith.js')
      const result = await GetRandomHadith()

      expect(result.author).toBe(c.name)
    }
  })

  test('should cache hadiths correctly', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'حديث 1',
        collection_name: 'صحيح البخاري',
        hadithnumber: 1,
        collection: 'bukhari',
        id: 'bukhari-1',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith } = require('../hadith.js')

    const result1 = await GetRandomHadith()
    expect(result1).toBeDefined()
    expect(global.fetch).toHaveBeenCalledTimes(1)

    const result2 = await GetRandomHadith()
    expect(result2).toBeDefined()
    expect(global.fetch).toHaveBeenCalledTimes(1)
  })

  test('should fallback to Unknown when author data is missing', async () => {
    mockFetch({
      data: {
        id: 'unknown-collection',
        arabic: 'حديث بدون مصدر',
      },
    })

    const { GetRandomHadith } = require('../hadith.js')
    const result = await GetRandomHadith()

    expect(result.author).toBeDefined()
    expect(typeof result.author).toBe('string')
  })

  test('should handle API errors gracefully', async () => {
    mockFetch(null, true)

    const { GetRandomHadith } = require('../hadith.js')
    await expect(GetRandomHadith()).rejects.toThrow()
  })

  test('should handle invalid API response structure', async () => {
    mockFetch({
      data: {},
    })

    const { GetRandomHadith } = require('../hadith.js')
    const result = await GetRandomHadith()
    expect(result).toBeDefined()
  })

  test('should provide fallback values for missing fields', async () => {
    mockFetch({
      data: {
        arabic: 'حديث بدون رقم',
      },
    })

    const { GetRandomHadith } = require('../hadith.js')
    const result = await GetRandomHadith()

    expect(result).toBeDefined()
    expect(result.number).toBeDefined()
    expect(result.author).toBeDefined()
  })
})
