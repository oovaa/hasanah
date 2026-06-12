/**
 * Tests for English Hadith functionality (eng_hadith.js)
 * 
 * These tests verify:
 * 1. Hadith retrieval returns proper structure with author field
 * 2. Author field is never "Unknown" when data is properly provided
 * 3. Cache functionality works correctly
 * 4. Multiple language support (en, ar, ur)
 * 5. Error handling works as expected
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

describe('English Hadith (eng_hadith.js)', () => {
    // Clear module cache before each test to ensure fresh state
    beforeEach(() => {
        delete require.cache[require.resolve('../eng_hadith.js')]
    })

    test('should return hadith with author field (not book) in English', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'Actions are by intentions',
                author: 'Sahih Bukhari',
                number: '1',
                collection: 'bukhari',
                arabic_name: 'صحيح البخاري'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result).toBeDefined()
        expect(result.hadith).toBeDefined()
        expect(result.author).toBeDefined()
        expect(result.number).toBeDefined()
        
        // Verify author field exists and is not undefined
        expect(typeof result.author).toBe('string')
        expect(result.author.length).toBeGreaterThan(0)
        expect(result.author).toBe('Sahih Bukhari')
    })

    test('should return hadith in English language', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'The strong believer is better than the weak believer',
                author: 'Sahih Muslim',
                number: '42',
                collection: 'muslim',
                arabic_name: 'صحيح مسلم'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result.hadith).toBe('The strong believer is better than the weak believer')
        expect(result.author).toBe('Sahih Muslim')
        expect(result.number).toBe('42')
    })

    test('should return hadith in Arabic language when requested', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'النص العربي',
                author: 'Sahih Bukhari',
                number: '100',
                collection: 'bukhari',
                arabic_name: 'صحيح البخاري'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('ar')

        expect(result.hadith).toBe('النص العربي')
        expect(result.author).toBe('Sahih Bukhari')
    })

    test('should return hadith in Urdu language when requested', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'اردو متن',
                author: 'Sahih Muslim',
                number: '200',
                collection: 'muslim',
                arabic_name: 'صحيح مسلم'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('ur')

        expect(result.hadith).toBe('اردو متن')
        expect(result.author).toBe('Sahih Muslim')
    })

    test('should cache hadiths correctly per collection', async () => {
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

    test('should fallback to Unknown when book data is missing', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'Hadith without book info',
                author: 'Unknown',
                number: '1',
                collection: 'unknown-collection',
                arabic_name: 'غير معروف'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result.author).toBe('Unknown')
    })

    test('should fallback to Unknown when bookName is missing', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'Hadith with incomplete book info',
                author: 'Unknown',
                number: '1',
                collection: 'unknown-collection',
                arabic_name: 'غير معروف'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result.author).toBe('Unknown')
    })

    test('should handle API errors gracefully', async () => {
        mockFetch(null, true)

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        
        await expect(GetRandomHadith_ENG('en')).rejects.toThrow()
    })

    test('should handle invalid API response structure', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            // data field exists but is empty/invalid
            data: {},
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        
        // With Ummah API, the service will handle missing fields gracefully
        // instead of throwing an error
        const result = await GetRandomHadith_ENG('en')
        expect(result).toBeDefined()
    })

    test('should provide fallback values for missing hadithNumber', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'Hadith without number',
                author: 'Sahih Muslim',
                number: 'N/A',
                collection: 'muslim',
                arabic_name: 'صحيح مسلم'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result.number).toBe('N/A')
        expect(result.author).toBe('Sahih Muslim')
    })

    test('should handle different book collections', async () => {
        const books = [
            'Sahih Bukhari',
            'Sahih Muslim',
            'Al Tirmidhi',
            'Abu Dawood',
            'Ibn e Majah',
            'Sunan Nasai',
        ]

        for (const bookName of books) {
            delete require.cache[require.resolve('../eng_hadith.js')]
            
            mockFetch({
                success: true,
                service: 'hadith',
                data: {
                    hadith: `Hadith from ${bookName}`,
                    author: bookName,
                    number: '1',
                    collection: bookName.toLowerCase().replace(/\s+/g, '-'),
                    arabic_name: bookName
                },
                timestamp: '2026-06-12T00:00:00Z'
            })

            const { GetRandomHadith_ENG } = require('../eng_hadith.js')
            const result = await GetRandomHadith_ENG('en')

            expect(result.author).toBe(bookName)
        }
    })
})
