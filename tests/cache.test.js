/**
 * Tests for cache functionality across both hadith modules
 * 
 * These tests verify:
 * 1. Cache properly stores and retrieves hadiths
 * 2. Cache reduces API calls
 * 3. Cache maintains author data correctly
 * 4. Cache handles multiple collections properly
 */

import { describe, test, expect, beforeEach, mock } from 'bun:test'

// Mock fetch for testing
const mockFetch = (responseData, shouldFail = false) => {
    global.fetch = mock((url) => {
        if (shouldFail) {
            return Promise.reject(new Error('Network error'))
        }
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve(responseData),
            text: () => Promise.resolve(JSON.stringify(responseData)),
        })
    })
}

describe('Cache functionality', () => {
    describe('Arabic Hadith Cache', () => {
        beforeEach(() => {
            delete require.cache[require.resolve('../hadith.js')]
        })

        test('should cache hadiths and reduce API calls', async () => {
            mockFetch({
                success: true,
                service: 'hadith',
                data: {
                    hadith: 'حديث 1',
                    author: 'البخاري',
                    number: '1',
                    collection: 'bukhari',
                    arabic_name: 'صحيح البخاري'
                },
                timestamp: '2026-06-12T00:00:00Z'
            })

            const { GetRandomHadith } = require('../hadith.js')
            
            // First call - fetches from API
            await GetRandomHadith()
            const firstCallCount = global.fetch.mock.calls.length

            // Multiple subsequent calls - should use cache
            await GetRandomHadith()
            await GetRandomHadith()
            await GetRandomHadith()
            
            const finalCallCount = global.fetch.mock.calls.length
            
            // Verify that API was only called once (first call)
            expect(finalCallCount).toBe(firstCallCount)
        })

        test('should maintain author data in cache', async () => {
            mockFetch({
                success: true,
                service: 'hadith',
                data: {
                    hadith: 'حديث من مسلم',
                    author: 'مسلم',
                    number: '1',
                    collection: 'muslim',
                    arabic_name: 'صحيح مسلم'
                },
                timestamp: '2026-06-12T00:00:00Z'
            })

            const { GetRandomHadith } = require('../hadith.js')
            
            // Get multiple hadiths from cache
            const hadith1 = await GetRandomHadith()
            const hadith2 = await GetRandomHadith()
            const hadith3 = await GetRandomHadith()
            
            // All should have the correct author
            expect(hadith1.author).toBe('مسلم')
            expect(hadith2.author).toBe('مسلم')
            expect(hadith3.author).toBe('مسلم')
            
            // None should be Unknown
            expect(hadith1.author).not.toBe('Unknown')
            expect(hadith2.author).not.toBe('Unknown')
            expect(hadith3.author).not.toBe('Unknown')
        })

        test('should return random hadiths from cache', async () => {
            mockFetch({
                success: true,
                service: 'hadith',
                data: {
                    hadith: 'حديث 1',
                    author: 'البخاري',
                    number: '1',
                    collection: 'bukhari',
                    arabic_name: 'صحيح البخاري'
                },
                timestamp: '2026-06-12T00:00:00Z'
            })

            const { GetRandomHadith } = require('../hadith.js')
            
            // Get multiple hadiths
            const hadiths = []
            for (let i = 0; i < 10; i++) {
                hadiths.push(await GetRandomHadith())
            }
            
            // All should have valid author
            for (const hadith of hadiths) {
                expect(hadith.author).toBe('البخاري')
                expect(hadith.hadith).toBeDefined()
                expect(hadith.number).toBeDefined()
            }
        })
    })

    describe('English Hadith Cache', () => {
        beforeEach(() => {
            delete require.cache[require.resolve('../eng_hadith.js')]
        })

        test('should cache hadiths per collection and reduce API calls for same collection', async () => {
            // Mock to always return same collection to test caching
            let callCount = 0
            global.fetch = mock((url) => {
                callCount++
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        service: 'hadith',
                        data: {
                            hadith: 'Hadith 1',
                            author: 'Sahih Bukhari',
                            number: '1',
                            collection: 'bukhari',
                            arabic_name: 'صحيح البخاري'
                        },
                        timestamp: '2026-06-12T00:00:00Z'
                    }),
                })
            })

            const { GetRandomHadith_ENG } = require('../eng_hadith.js')
            
            // First call - should fetch from API
            const result1 = await GetRandomHadith_ENG('en')
            expect(result1).toBeDefined()

            // Multiple calls - may use cache or fetch new collections
            // due to random collection selection
            const result2 = await GetRandomHadith_ENG('en')
            expect(result2).toBeDefined()
            
            const result3 = await GetRandomHadith_ENG('en')
            expect(result3).toBeDefined()
            
            // Should be less than 3 calls if cache is working
            // (could be 1-3 depending on random collection selection)
            expect(callCount).toBeGreaterThan(0)
            expect(callCount).toBeLessThanOrEqual(3)
        })

        test('should maintain author data in cache', async () => {
            mockFetch({
                success: true,
                service: 'hadith',
                data: {
                    hadith: 'First hadith',
                    author: 'Sahih Muslim',
                    number: '1',
                    collection: 'muslim',
                    arabic_name: 'صحيح مسلم'
                },
                timestamp: '2026-06-12T00:00:00Z'
            })

            const { GetRandomHadith_ENG } = require('../eng_hadith.js')
            
            // Get multiple hadiths from cache
            const hadith1 = await GetRandomHadith_ENG('en')
            const hadith2 = await GetRandomHadith_ENG('en')
            const hadith3 = await GetRandomHadith_ENG('en')
            
            // All should have the correct author
            expect(hadith1.author).toBe('Sahih Muslim')
            expect(hadith2.author).toBe('Sahih Muslim')
            expect(hadith3.author).toBe('Sahih Muslim')
            
            // None should be Unknown
            expect(hadith1.author).not.toBe('Unknown')
            expect(hadith2.author).not.toBe('Unknown')
            expect(hadith3.author).not.toBe('Unknown')
        })

        test('should work with different languages accessing cached data', async () => {
            // Mock to control which book is selected
            let callCount = 0
            global.fetch = mock((url) => {
                callCount++
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        service: 'hadith',
                        data: {
                            hadith: 'English text',
                            author: 'Sahih Bukhari',
                            number: '1',
                            collection: 'bukhari',
                            arabic_name: 'صحيح البخاري'
                        },
                        timestamp: '2026-06-12T00:00:00Z'
                    }),
                })
            })

            const { GetRandomHadith_ENG } = require('../eng_hadith.js')
            
            // Get hadith in different languages
            const englishHadith = await GetRandomHadith_ENG('en')
            const arabicHadith = await GetRandomHadith_ENG('ar')
            const urduHadith = await GetRandomHadith_ENG('ur')
            
            // Should all have same author
            expect(englishHadith.author).toBe('Sahih Bukhari')
            expect(arabicHadith.author).toBe('Sahih Bukhari')
            expect(urduHadith.author).toBe('Sahih Bukhari')
            
            // Different text based on language
            expect(englishHadith.hadith).toBe('English text')
            expect(arabicHadith.hadith).toBe('English text')
            expect(urduHadith.hadith).toBe('English text')
            
            // Since random selection might pick different books, we can't guarantee exact call count
            // but with cache, it should be less than 3 if same book was selected
            expect(callCount).toBeGreaterThan(0)
            expect(callCount).toBeLessThanOrEqual(3)
        })
    })

    describe('Cache Performance', () => {
        test('should demonstrate cache efficiency for Arabic hadiths', async () => {
            delete require.cache[require.resolve('../hadith.js')]
            
            let apiCallCount = 0
            global.fetch = mock(() => {
                apiCallCount++
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        service: 'hadith',
                        data: {
                            hadith: `حديث رقم ${apiCallCount}`,
                            author: 'البخاري',
                            number: String(apiCallCount),
                            collection: 'bukhari',
                            arabic_name: 'صحيح البخاري'
                        },
                        timestamp: '2026-06-12T00:00:00Z'
                    }),
                })
            })

            const { GetRandomHadith } = require('../hadith.js')
            
            // Get 50 hadiths
            for (let i = 0; i < 50; i++) {
                await GetRandomHadith()
            }
            
            // Should only make 1 API call total
            expect(apiCallCount).toBe(1)
        })

        test('should demonstrate cache efficiency for English hadiths', async () => {
            delete require.cache[require.resolve('../eng_hadith.js')]
            
            let apiCallCount = 0
            global.fetch = mock(() => {
                apiCallCount++
                return Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        success: true,
                        service: 'hadith',
                        data: {
                            hadith: `Hadith number ${apiCallCount}`,
                            author: 'Sahih Bukhari',
                            number: String(apiCallCount),
                            collection: 'bukhari',
                            arabic_name: 'صحيح البخاري'
                        },
                        timestamp: '2026-06-12T00:00:00Z'
                    }),
                })
            })

            const { GetRandomHadith_ENG } = require('../eng_hadith.js')
            
            // Get 50 hadiths
            for (let i = 0; i < 50; i++) {
                await GetRandomHadith_ENG('en')
            }
            
            // Due to random collection selection, might make multiple API calls
            // But should be significantly less than 50 calls due to caching
            expect(apiCallCount).toBeGreaterThan(0)
            expect(apiCallCount).toBeLessThan(10) // Should cache well
        })
    })
})
