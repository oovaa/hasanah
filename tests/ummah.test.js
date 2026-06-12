const { UmmahAPI } = require('../ummah-api')

describe('UmmahAPI', () => {
  test('should initialize with base URL', () => {
    const api = new UmmahAPI()
    expect(api.baseURL).toBe('https://ummahapi.com/api')
  })
})