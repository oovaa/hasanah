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

describe('English Hadith (eng_hadith.js)', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../eng_hadith.js')]
  })

  test('should return hadith with author field in English', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        english: 'Actions are by intentions',
        collection_name: 'Sahih Bukhari',
        hadithnumber: 1,
        collection: 'bukhari',
        id: 'bukhari-1',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    const result = await GetRandomHadith_ENG('en')

    expect(result).toBeDefined()
    expect(result.hadith).toBeDefined()
    expect(result.author).toBeDefined()
    expect(result.number).toBeDefined()
    expect(typeof result.author).toBe('string')
    expect(result.author.length).toBeGreaterThan(0)
    expect(result.author).toBe('Sahih Bukhari')
  })

  test('should return hadith in English language', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        english: 'The strong believer is better than the weak believer',
        collection_name: 'Sahih Muslim',
        hadithnumber: 42,
        collection: 'muslim',
        id: 'muslim-42',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    const result = await GetRandomHadith_ENG('en')

    expect(result.hadith).toBe('The strong believer is better than the weak believer')
    expect(result.author).toBe('Sahih Muslim')
    expect(result.number).toBe(42)
  })

  test('should return hadith in Arabic language when requested', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'النص العربي',
        collection_name: 'Sahih Bukhari',
        hadithnumber: 100,
        collection: 'bukhari',
        id: 'bukhari-100',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    const result = await GetRandomHadith_ENG('ar')

    expect(result.hadith).toBe('النص العربي')
    expect(result.author).toBe('Sahih Bukhari')
  })

  test('should return hadith in Urdu language when requested', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'اردو متن',
        collection_name: 'Sahih Muslim',
        hadithnumber: 200,
        collection: 'muslim',
        id: 'muslim-200',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    const result = await GetRandomHadith_ENG('ur')

    expect(result.hadith).toBe('اردو متن')
    expect(result.author).toBe('Sahih Muslim')
  })

  test('should cache hadiths correctly per collection', async () => {
    let callCount = 0
    global.fetch = mock((url) => {
      callCount++
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            service: 'hadith',
            data: {
              arabic: 'Hadith 1',
              collection_name: 'Sahih Bukhari',
              hadithnumber: 1,
              collection: 'bukhari',
              id: 'bukhari-1',
            },
            timestamp: '2026-06-12T00:00:00Z',
          }),
      })
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')

    const result1 = await GetRandomHadith_ENG('en')
    expect(result1).toBeDefined()

    const result2 = await GetRandomHadith_ENG('en')
    expect(result2).toBeDefined()

    const result3 = await GetRandomHadith_ENG('en')
    expect(result3).toBeDefined()

    expect(callCount).toBeGreaterThan(0)
    expect(callCount).toBeLessThanOrEqual(3)
  })

  test('should handle API errors gracefully', async () => {
    mockFetch(null, true)

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    await expect(GetRandomHadith_ENG('en')).rejects.toThrow()
  })

  test('should handle invalid API response structure', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {},
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    const result = await GetRandomHadith_ENG('en')
    expect(result).toBeDefined()
  })

  test('should provide fallback values for missing hadithNumber', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        english: 'Hadith without number',
        collection_name: 'Sahih Muslim',
        collection: 'muslim',
        id: 'muslim-0',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { GetRandomHadith_ENG } = require('../eng_hadith.js')
    const result = await GetRandomHadith_ENG('en')

    expect(result.number).toBeDefined()
    expect(result.author).toBe('Sahih Muslim')
  })

  test('should handle different book collections', async () => {
    const books = [
      'Sahih Bukhari',
      'Sahih Muslim',
      'Al Tirmidhi',
      'Abu Dawood',
      'Ibn e Majah',
      'Sunan Nasai',
    ]

    for (const bookName of books) {
      delete require.cache[require.resolve('../eng_hadith.js')]

      mockFetch({
        success: true,
        service: 'hadith',
        data: {
          english: `Hadith from ${bookName}`,
          collection_name: bookName,
          hadithnumber: 1,
          collection: bookName.toLowerCase().replace(/\s+/g, '-'),
          id: bookName.toLowerCase().replace(/\s+/g, '-') + '-1',
        },
        timestamp: '2026-06-12T00:00:00Z',
      })

      const { GetRandomHadith_ENG } = require('../eng_hadith.js')
      const result = await GetRandomHadith_ENG('en')

      expect(result.author).toBe(bookName)
    }
  })
})
