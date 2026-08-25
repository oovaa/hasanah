
const { UmmahAPI } = require('../ummah-api')

describe('UmmahAPI', () => {
  let origFetch

  beforeEach(() => {
    origFetch = globalThis.fetch
  })

  afterEach(() => {
    globalThis.fetch = origFetch
  })

  test('should initialize with base URL', () => {
    const api = new UmmahAPI()
    expect(api.baseURL).toBe('https://ummahapi.com/api')
  })

  test('should pass an AbortSignal timeout to fetch', async () => {
    let seenSignal
    globalThis.fetch = ((url, opts) => {
      seenSignal = opts.signal
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: 1 }) })
    })
    const api = new UmmahAPI()
    await api.get('/today-hijri')
    expect(seenSignal).toBeInstanceOf(AbortSignal)
    expect(seenSignal.aborted).toBe(false)
  })

  test('should reject when the abort signal fires (timeout)', async () => {
    globalThis.fetch = (
      () =>
        new Promise((_, reject) =>
          setTimeout(() => reject(new DOMException('Aborted', 'AbortError')), 50)
        )
    )
    const api = new UmmahAPI()
    await expect(api.get('/quran/random')).rejects.toThrow()
  })

  test('should cache non-random endpoints and skip cache for random', async () => {
    let calls = 0
    globalThis.fetch = (() => {
      calls++
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ data: calls }) })
    })
    const api = new UmmahAPI()
    await api.get('/today-hijri')
    await api.get('/today-hijri')
    expect(calls).toBe(1)
    await api.get('/duas/random')
    await api.get('/duas/random')
    expect(calls).toBe(3)
  })
})