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

describe('Main getText function', () => {
  beforeEach(() => {
    delete require.cache[require.resolve('../main.js')]
    delete require.cache[require.resolve('../hadith.js')]
    delete require.cache[require.resolve('../eng_hadith.js')]
  })

  test('should display hadith with author in Arabic (turn 0)', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
        collection_name: 'صحيح البخاري',
        hadithnumber: 1,
        collection: 'bukhari',
        id: 'bukhari-1',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { getText } = require('../main.js')
    const result = await getText(0, 'ar')

    expect(result).toContain('إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ')
    expect(result).toContain('author (')
    expect(result).toContain('صحيح البخاري')
  })

  test('should display hadith with author in English (turn 0)', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        english: 'Actions are by intentions',
        collection_name: 'Sahih Muslim',
        hadithnumber: 42,
        collection: 'muslim',
        id: 'muslim-42',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { getText } = require('../main.js')
    const result = await getText(0, 'en')

    expect(result).toContain('Actions are by intentions')
    expect(result).toContain('author (')
    expect(result).toContain('Sahih Muslim')
  })

  test('should format hadith text correctly with author and number', async () => {
    mockFetch({
      success: true,
      service: 'hadith',
      data: {
        arabic: 'حديث تجريبي',
        collection_name: 'صحيح مسلم',
        hadithnumber: 123,
        collection: 'muslim',
        id: 'muslim-123',
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { getText } = require('../main.js')
    const result = await getText(0, 'ar')

    expect(result).toMatch(/💚 author \(.+\) \(\d+\)/)
  })

  test('should handle ayah display (turn = 1)', async () => {
    mockFetch({
      success: true,
      service: 'quran',
      data: {
        surah: { name_arabic: 'الفاتحة', name_english: 'Al-Fatiha' },
        verse: {
          arabic: 'بسم الله الرحمن الرحيم',
          ayah: 1,
          translations: { sahih_international: 'In the name of Allah' },
        },
      },
      timestamp: '2026-06-12T00:00:00Z',
    })

    const { getText } = require('../main.js')
    const result = await getText(1, 'ar')

    expect(result).toContain('بسم الله الرحمن الرحيم')
    expect(result).toContain('❤️')
    expect(result).not.toContain('author')
  })

  test('should handle duaa display (turn = 2)', async () => {
    mockFetch({
      data: {
        id: 1,
        arabic: 'اللهم بك أصبحنا',
        translation: 'O Allah, with You we enter the morning',
        category_info: { name: 'Morning' },
        source: 'Bukhari'
      }
    })

    const { getText } = require('../main.js')
    const result = await getText(2, 'ar')

    expect(result).toContain('اللهم بك أصبحنا')
    expect(result).toContain('🤲')
    expect(result).toContain('Morning')
  })

  test('should handle duaa display in English (turn = 2)', async () => {
    mockFetch({
      data: {
        arabic: 'ربنا آتنا في الدنيا حسنة',
        translation: 'Our Lord, give us good',
        category_info: { name: 'Quran' },
        source: 'Quran 2:201'
      }
    })

    const { getText } = require('../main.js')
    const result = await getText(2, 'en')

    expect(result).toContain('Our Lord, give us good')
    expect(result).toContain('🤲')
  })

  test('should fallback to default Duaa on hadith fetch error in Arabic (turn 0)', async () => {
    mockFetch(null, true)

    const { getText } = require('../main.js')
    const result = await getText(0, 'ar')

    expect(result).toContain('اللهم احفظ السودان واهله')
    expect(result).toContain('سبحان الله وبحمده')
  })

  test('should fallback to default Duaa on hadith fetch error in English (turn 0)', async () => {
    mockFetch(null, true)

    const { getText } = require('../main.js')
    const result = await getText(0, 'en')

    expect(result).toContain('O God, protect Sudan and its people')
    expect(result).toContain('Glory to God and praise to Him')
  })

  test('should fallback to default Duaa on ayah fetch error in Arabic (turn 1)', async () => {
    mockFetch(null, true)

    const { getText } = require('../main.js')
    const result = await getText(1, 'ar')

    expect(result).toContain('اللهم احفظ السودان واهله')
  })

  test('should fallback to default Duaa on ayah fetch error in English (turn 1)', async () => {
    mockFetch(null, true)

    const { getText } = require('../main.js')
    const result = await getText(1, 'en')

    expect(result).toContain('O God, protect Sudan and its people')
  })

  test('should fallback to default Duaa on duaa fetch error in Arabic (turn 2)', async () => {
    mockFetch(null, true)

    const { getText } = require('../main.js')
    const result = await getText(2, 'ar')

    expect(result).toContain('اللهم احفظ السودان واهله')
  })

  test('should fallback to default Duaa on duaa fetch error in English (turn 2)', async () => {
    mockFetch(null, true)

    const { getText } = require('../main.js')
    const result = await getText(2, 'en')

    expect(result).toContain('O God, protect Sudan and its people')
  })

  test('should never show Unknown author when API provides data correctly', async () => {
    const collections = [
      { id: 'bukhari', name: 'صحيح البخاري' },
      { id: 'muslim', name: 'صحيح مسلم' },
      { id: 'tirmidzi', name: 'سنن الترمذي' },
    ]

    for (const c of collections) {
      delete require.cache[require.resolve('../main.js')]
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

      const { getText } = require('../main.js')
      const result = await getText(0, 'ar')

      expect(result).not.toContain('Unknown')
      expect(result).toContain(c.name)
    }
  })
})
