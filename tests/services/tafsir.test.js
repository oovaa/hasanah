const { TafsirService } = require('../../services/tafsir-service')
const { UmmahAPI } = require('../../ummah-api')

describe('TafsirService', () => {
  let api
  let tafsirService

  beforeEach(() => {
    api = new UmmahAPI()
    tafsirService = new TafsirService()
    tafsirService.api = api
  })

  test('should fetch tafsir with default key', async () => {
    const mockData = {
      data: {
        verse_key: '1:1',
        tafsir: {
          key: 'ibn_kathir',
          name: 'Tafsir Ibn Kathir',
          language: 'en',
          author: 'Hafiz Ibn Kathir',
          text: 'In the name of Allah, the Most Gracious, the Most Merciful.'
        }
      }
    }
    api.get = () => Promise.resolve(mockData)

    const result = await tafsirService.getTafsir(1, 1)
    expect(result.verse_key).toBe('1:1')
    expect(result.text).toBe('In the name of Allah, the Most Gracious, the Most Merciful.')
    expect(result.author).toBe('Hafiz Ibn Kathir')
    expect(result.tafsir_name).toBe('Tafsir Ibn Kathir')
    expect(result.language).toBe('en')
  })

  test('should fetch tafsir with specified key', async () => {
    const mockData = {
      data: {
        verse_key: '36:1',
        tafsir: {
          key: 'muyassar',
          name: 'Tafsir Al-Muyassar',
          language: 'en',
          author: 'King Fahd Complex',
          text: 'Ya Sin.'
        }
      }
    }
    api.get = () => Promise.resolve(mockData)

    const result = await tafsirService.getTafsir(36, 1, 'muyassar')
    expect(result.verse_key).toBe('36:1')
    expect(result.tafsir_name).toBe('Tafsir Al-Muyassar')
  })

  test('should format tafsir data', () => {
    const data = {
      verse_key: '1:1',
      tafsir: {
        key: 'ibn_kathir',
        name: 'Tafsir Ibn Kathir',
        language: 'en',
        author: 'Hafiz Ibn Kathir',
        text: 'Bismillah...'
      }
    }
    const result = tafsirService.formatTafsir(data)
    expect(result.verse_key).toBe('1:1')
    expect(result.text).toBe('Bismillah...')
    expect(result.author).toBe('Hafiz Ibn Kathir')
    expect(result.tafsir_name).toBe('Tafsir Ibn Kathir')
    expect(result.language).toBe('en')
  })
})
