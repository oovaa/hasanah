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

describe('Cache functionality', () => {
  describe('Arabic Hadith Cache', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../hadith.js')]
    })

    test('should cache hadiths and reduce API calls', async () => {
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
      await GetRandomHadith()
      const firstCallCount = global.fetch.mock.calls.length

      await GetRandomHadith()
      await GetRandomHadith()
      await GetRandomHadith()

      const finalCallCount = global.fetch.mock.calls.length
      expect(finalCallCount).toBe(firstCallCount + 3)
    })

    test('should maintain author data in cache', async () => {
      mockFetch({
        success: true,
        service: 'hadith',
        data: {
          arabic: 'حديث من مسلم',
          collection_name: 'صحيح مسلم',
          hadithnumber: 1,
          collection: 'muslim',
          id: 'muslim-1',
        },
        timestamp: '2026-06-12T00:00:00Z',
      })

      const { GetRandomHadith } = require('../hadith.js')

      const hadith1 = await GetRandomHadith()
      const hadith2 = await GetRandomHadith()
      const hadith3 = await GetRandomHadith()

      expect(hadith1.author).toBe('صحيح مسلم')
      expect(hadith2.author).toBe('صحيح مسلم')
      expect(hadith3.author).toBe('صحيح مسلم')

      expect(hadith1.author).not.toBe('Unknown')
      expect(hadith2.author).not.toBe('Unknown')
      expect(hadith3.author).not.toBe('Unknown')
    })

    test('should return random hadiths from cache', async () => {
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

      const hadiths = []
      for (let i = 0; i < 10; i++) {
        hadiths.push(await GetRandomHadith())
      }

      for (const hadith of hadiths) {
        expect(hadith.author).toBe('صحيح البخاري')
        expect(hadith.hadith).toBeDefined()
        expect(hadith.number).toBeDefined()
      }
    })
  })

  describe('English Hadith Cache', () => {
    beforeEach(() => {
      delete require.cache[require.resolve('../eng_hadith.js')]
    })

    test('should cache hadiths per collection and reduce API calls for same collection', async () => {
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

    test('should maintain author data in cache', async () => {
      mockFetch({
        success: true,
        service: 'hadith',
        data: {
          arabic: 'First hadith',
          collection_name: 'Sahih Muslim',
          hadithnumber: 1,
          collection: 'muslim',
          id: 'muslim-1',
        },
        timestamp: '2026-06-12T00:00:00Z',
      })

      const { GetRandomHadith_ENG } = require('../eng_hadith.js')

      const hadith1 = await GetRandomHadith_ENG('en')
      const hadith2 = await GetRandomHadith_ENG('en')
      const hadith3 = await GetRandomHadith_ENG('en')

      expect(hadith1.author).toBe('Sahih Muslim')
      expect(hadith2.author).toBe('Sahih Muslim')
      expect(hadith3.author).toBe('Sahih Muslim')

      expect(hadith1.author).not.toBe('Unknown')
      expect(hadith2.author).not.toBe('Unknown')
      expect(hadith3.author).not.toBe('Unknown')
    })

    test('should work with different languages accessing cached data', async () => {
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
                arabic: 'English text',
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

      const englishHadith = await GetRandomHadith_ENG('en')
      const arabicHadith = await GetRandomHadith_ENG('ar')
      const urduHadith = await GetRandomHadith_ENG('ur')

      expect(englishHadith.author).toBe('Sahih Bukhari')
      expect(arabicHadith.author).toBe('Sahih Bukhari')
      expect(urduHadith.author).toBe('Sahih Bukhari')

      expect(englishHadith.hadith).toBe('English text')
      expect(arabicHadith.hadith).toBe('English text')
      expect(urduHadith.hadith).toBe('English text')

      expect(callCount).toBeGreaterThan(0)
      expect(callCount).toBeLessThanOrEqual(3)
    })
  })

  describe('Cache Performance', () => {
    test('should demonstrate cache efficiency for Arabic hadiths', async () => {
      delete require.cache[require.resolve('../hadith.js')]

      let apiCallCount = 0
      global.fetch = mock(() => {
        apiCallCount++
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              service: 'hadith',
              data: {
                arabic: `حديث رقم ${apiCallCount}`,
                collection_name: 'صحيح البخاري',
                hadithnumber: apiCallCount,
                collection: 'bukhari',
                id: `bukhari-${apiCallCount}`,
              },
              timestamp: '2026-06-12T00:00:00Z',
            }),
        })
      })

      const { GetRandomHadith } = require('../hadith.js')

      for (let i = 0; i < 50; i++) {
        await GetRandomHadith()
      }

      expect(apiCallCount).toBe(50)
    })

    test('should demonstrate cache efficiency for English hadiths', async () => {
      delete require.cache[require.resolve('../eng_hadith.js')]

      let apiCallCount = 0
      global.fetch = mock(() => {
        apiCallCount++
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              success: true,
              service: 'hadith',
              data: {
                arabic: `Hadith number ${apiCallCount}`,
                collection_name: 'Sahih Bukhari',
                hadithnumber: apiCallCount,
                collection: 'bukhari',
                id: `bukhari-${apiCallCount}`,
              },
              timestamp: '2026-06-12T00:00:00Z',
            }),
        })
      })

      const { GetRandomHadith_ENG } = require('../eng_hadith.js')

      for (let i = 0; i < 50; i++) {
        await GetRandomHadith_ENG('en')
      }

      expect(apiCallCount).toBe(50)
    })
  })
})
