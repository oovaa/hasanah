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

  test('should get random duaa', async () => {
    const mockData = {
      data: {
        id: 1,
        category: 'morning',
        title: 'Morning Duaa',
        arabic: 'اللهم بك أصبحنا',
        translation: 'O Allah, with You we enter the morning',
        transliteration: 'Allahumma bika asbahna',
        source: 'Bukhari',
        category_info: { name: 'Evening & Morning' }
      }
    }
    api.get = () => Promise.resolve(mockData)

    const result = await duaaService.getRandomDuaa()
    expect(result.text).toBe('اللهم بك أصبحنا')
    expect(result.translation).toBe('O Allah, with You we enter the morning')
    expect(result.category).toBe('Evening & Morning')
    expect(result.source).toBe('Bukhari')
    expect(result.title).toBe('Morning Duaa')
  })

  test('should format duaa with arabic text', () => {
    const data = {
      arabic: 'ربنا آتنا في الدنيا حسنة',
      translation: 'Our Lord, give us in this world good',
      transliteration: 'Rabbana atina fid-dunya hasanah',
      category_info: { name: 'Quran' },
      source: 'Quran 2:201',
      title: 'Dua for goodness'
    }
    const result = duaaService.formatDuaa(data)
    expect(result.text).toBe('ربنا آتنا في الدنيا حسنة')
    expect(result.translation).toBe('Our Lord, give us in this world good')
    expect(result.category).toBe('Quran')
    expect(result.source).toBe('Quran 2:201')
  })

  test('should fallback to translation when no arabic text', () => {
    const data = {
      translation: 'Our Lord, give us good',
      category_info: { name: 'Quran' }
    }
    const result = duaaService.formatDuaa(data)
    expect(result.text).toBe('Our Lord, give us good')
  })
})
