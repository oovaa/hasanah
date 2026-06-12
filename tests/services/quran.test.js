const { QuranService } = require('../../services/quran-service')
const { UmmahAPI } = require('../../ummah-api')

describe('QuranService', () => {
  let api
  let quranService

  beforeEach(() => {
    api = new UmmahAPI()
    quranService = new QuranService()
    quranService.api = api
  })

  test('should fetch random ayah', async () => {
    const mockData = {
      text: 'Test ayah text',
      surah: { name: 'Test Surah', englishName: 'Test Surah English' },
      numberInSurah: 1
    }
    api.get = jest.fn().mockResolvedValue({ data: mockData })

    const ayah = await quranService.getRandomAyah('en')
    expect(ayah).toBeDefined()
    expect(ayah.text).toBeDefined()
    expect(ayah.surah_name).toBeDefined()
    expect(ayah.ayah_num).toBeDefined()
  })

  test('should fetch specific ayah', async () => {
    const mockData = {
      text: 'Test specific ayah text',
      surah: { name: 'Test Surah', englishName: 'Test Surah English' },
      numberInSurah: 2
    }
    api.get = jest.fn().mockResolvedValue({ data: mockData })

    const ayah = await quranService.getSpecificAyah(2, 255, 'ar')
    expect(ayah.text).toBeDefined()
    expect(ayah.surah_name).toBeDefined()
    expect(ayah.ayah_num).toBeDefined()
  })
})