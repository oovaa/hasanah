const { NamesOfAllahService } = require('../../services/names-of-allah-service')
const { UmmahAPI } = require('../../ummah-api')

describe('NamesOfAllahService', () => {
  let api
  let namesOfAllahService

  beforeEach(() => {
    api = new UmmahAPI()
    namesOfAllahService = new NamesOfAllahService(api)
  })

  test('should initialize with API instance', () => {
    expect(namesOfAllahService.api).toBe(api)
  })

  test('should get all names', async () => {
    const mockData = { names: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getAllNames()

    expect(api.get).toHaveBeenCalledWith('/names-of-allah', { language: 'en' })
    expect(result).toEqual(mockData)
  })

  test('should get all names with language', async () => {
    const mockData = { names: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getAllNames('ar')

    expect(api.get).toHaveBeenCalledWith('/names-of-allah', { language: 'ar' })
    expect(result).toEqual(mockData)
  })

  test('should get name', async () => {
    const mockData = { name: 'test' }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getName(1)

    expect(api.get).toHaveBeenCalledWith('/names-of-allah/1', {})
    expect(result).toEqual(mockData)
  })

  test('should get by category', async () => {
    const mockData = { names: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getByCategory('attributes')

    expect(api.get).toHaveBeenCalledWith('/names-of-allah/category/attributes', { language: 'en' })
    expect(result).toEqual(mockData)
  })

  test('should get by category with language', async () => {
    const mockData = { names: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getByCategory('attributes', 'ar')

    expect(api.get).toHaveBeenCalledWith('/names-of-allah/category/attributes', { language: 'ar' })
    expect(result).toEqual(mockData)
  })

  test('should get by letter', async () => {
    const mockData = { names: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getByLetter('a')

    expect(api.get).toHaveBeenCalledWith('/names-of-allah/letter/a', { language: 'en' })
    expect(result).toEqual(mockData)
  })

  test('should get by letter with language', async () => {
    const mockData = { names: [] }
    api.get = jest.fn().mockResolvedValue(mockData)

    const result = await namesOfAllahService.getByLetter('a', 'ar')

    expect(api.get).toHaveBeenCalledWith('/names-of-allah/letter/a', { language: 'ar' })
    expect(result).toEqual(mockData)
  })
})