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
    const mockData = { data: { names: [] } }
    api.get = () => Promise.resolve(mockData)

    const result = await namesOfAllahService.getAllNames()
    expect(result.names).toBeDefined()
  })

  test('should get name by id', async () => {
    const mockData = { data: { name: 'Ar-Rahman', number: 1 } }
    api.get = () => Promise.resolve(mockData)

    const result = await namesOfAllahService.getName(1)
    expect(result.name).toBe('Ar-Rahman')
    expect(result.number).toBe(1)
  })

  test('should get random name', async () => {
    const mockData = { data: { name: 'Ar-Rahman' } }
    api.get = () => Promise.resolve(mockData)

    const result = await namesOfAllahService.getRandomName()
    expect(result.name).toBe('Ar-Rahman')
  })

  test('should search names', async () => {
    const mockData = { data: { results: [{ name: 'Ar-Rahman' }] } }
    api.get = () => Promise.resolve(mockData)

    const result = await namesOfAllahService.search('merciful')
    expect(result.results).toBeDefined()
  })
})
