const { HadithService } = require('../../services/hadith-service')

describe('HadithService', () => {
  let hadithService

  beforeEach(() => {
    hadithService = new HadithService()
  })

  test('should fetch random hadith in Arabic', async () => {
    const hadith = await hadithService.getRandomHadith('ar')
    expect(hadith).toBeDefined()
    expect(hadith.hadith).toBeDefined()
    expect(hadith.author).toBeDefined()
    expect(hadith.number).toBeDefined()
  })

  test('should fetch random hadith in English', async () => {
    const hadith = await hadithService.getRandomHadith('en')
    expect(hadith).toBeDefined()
    expect(hadith.hadith).toBeDefined()
    expect(hadith.author).toBeDefined()
    expect(hadith.number).toBeDefined()
  })
})