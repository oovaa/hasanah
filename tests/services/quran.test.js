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
      surah: { name_arabic: 'Test Surah', name_english: 'Test Surah English' },
      verse: { arabic: 'Test ayah text', ayah: 1, translations: { sahih_international: 'Test ayah text EN' } }
    }
    api.get = () => Promise.resolve({ data: mockData })

    const ayah = await quranService.getRandomAyah('en')
    expect(ayah).toBeDefined()
    expect(ayah.text).toBeDefined()
    expect(ayah.surah_name).toBeDefined()
    expect(ayah.ayah_num).toBeDefined()
  })

  test('should fetch specific ayah', async () => {
    const mockData = {
      surah: { name_arabic: 'Test Surah', name_english: 'Test Surah English' },
      verse: { arabic: 'Test specific ayah text', ayah: 2, translations: { sahih_international: 'Test specific ayah text EN' } }
    }
    api.get = () => Promise.resolve({ data: mockData })

    const ayah = await quranService.getSpecificAyah(2, 255, 'ar')
    expect(ayah.text).toBeDefined()
    expect(ayah.surah_name).toBeDefined()
    expect(ayah.ayah_num).toBeDefined()
  })
})