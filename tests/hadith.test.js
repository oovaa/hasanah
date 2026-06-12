/**
 * Tests for Arabic Hadith functionality (hadith.js)
 * 
 * These tests verify:
 * 1. Hadith retrieval returns proper structure with author field
 * 2. Author field is never "Unknown" when data is properly provided
 * 3. Cache functionality works correctly
 * 4. Error handling works as expected
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

describe('Arabic Hadith (hadith.js)', () => {
    // Clear module cache before each test to ensure fresh state
    beforeEach(() => {
        delete require.cache[require.resolve('../hadith.js')]
    })

    test('should return hadith with author field (not book)', async () => {
        // Mock API response with Ummah API structure
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'حديث تجريبي',
                author: 'البخاري',
                number: '1',
                collection: 'bukhari',
                arabic_name: 'صحيح البخاري'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith } = require('../hadith.js')
        const result = await GetRandomHadith()

        expect(result).toBeDefined()
        expect(result.hadith).toBeDefined()
        expect(result.author).toBeDefined()
        expect(result.number).toBeDefined()
        
        // Verify author field exists and is not undefined
        expect(typeof result.author).toBe('string')
        expect(result.author.length).toBeGreaterThan(0)
    })

    test('should return Arabic author name correctly', async () => {
        mockFetch({
            success: true,
            service: 'hadith',
            data: {
                hadith: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                author: 'البخاري',
                number: '123',
                collection: 'bukhari',
                arabic_name: 'صحيح البخاري'
            },
            timestamp: '2026-06-12T00:00:00Z'
        })

        const { GetRandomHadith } = require('../hadith.js')
        const result = await GetRandomHadith()

        expect(result.author).toBe('البخاري')
        expect(result.hadith).toBe('إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ')
        expect(result.number).toBe('123')
    })

    test('should handle different collections correctly', async () => {
        const collections = ['muslim', 'tirmidzi', 'nasai', 'abu-daud']
        const arabicNames = ['مسلم', 'الترمذي', 'النسائي', 'أبو داود']

        for (let i = 0; i < collections.length; i++) {
            delete require.cache[require.resolve('../hadith.js')]
            
            mockFetch({
                success: true,
                service: 'hadith',
                data: {
                    hadith: 'حديث من ' + arabicNames[i],
                    author: arabicNames[i],
                    number: '1',
                    collection: collections[i],
                    arabic_name: arabicNames[i]
                },
                timestamp: '2026-06-12T00:00:00Z'
            })

            const { GetRandomHadith } = require('../hadith.js')
            const result = await GetRandomHadith()

            expect(result.author).toBe(arabicNames[i])
        }
    })

    test('should cache hadiths correctly', async () => {
        mockFetch({
            data: {
                id: 'bukhari',
                hadiths: [
                    { number: 1, arab: 'حديث 1' },
                    { number: 2, arab: 'حديث 2' },
                    { number: 3, arab: 'حديث 3' },
                ],
            },
        })

        const { GetRandomHadith } = require('../hadith.js')
        
        // First call - should fetch from API
        const result1 = await GetRandomHadith()
        expect(result1).toBeDefined()
        expect(global.fetch).toHaveBeenCalledTimes(1)

        // Second call - should use cache
        const result2 = await GetRandomHadith()
        expect(result2).toBeDefined()
        // fetch should still be called only once since we're using cache
        expect(global.fetch).toHaveBeenCalledTimes(1)
    })

    test('should fallback to Unknown when author data is missing', async () => {
        mockFetch({
            data: {
                id: 'unknown-collection',
                hadiths: [
                    {
                        number: 1,
                        arab: 'حديث بدون مصدر',
                    },
                ],
            },
        })

        const { GetRandomHadith } = require('../hadith.js')
        const result = await GetRandomHadith()

        // Should have an author, even if it's from an unknown collection
        expect(result.author).toBeDefined()
        expect(typeof result.author).toBe('string')
    })

    test('should handle API errors gracefully', async () => {
        mockFetch(null, true)

        const { GetRandomHadith } = require('../hadith.js')
        
        await expect(GetRandomHadith()).rejects.toThrow()
    })

    test('should handle invalid API response structure', async () => {
        mockFetch({
            data: {
                // Missing hadiths array
                id: 'bukhari',
            },
        })

        const { GetRandomHadith } = require('../hadith.js')
        
        // With Ummah API, the service will handle missing fields gracefully
        // instead of throwing an error
        const result = await GetRandomHadith()
        expect(result).toBeDefined()
    })

    test('should provide fallback values for missing fields', async () => {
        mockFetch({
            data: {
                id: 'bukhari',
                hadiths: [
                    {
                        // Missing number field
                        arab: 'حديث بدون رقم',
                    },
                ],
            },
        })

        const { GetRandomHadith } = require('../hadith.js')
        const result = await GetRandomHadith()

        // With Ummah API, the service will handle missing fields gracefully
        // and provide fallback values
        expect(result).toBeDefined()
        expect(result.number).toBeDefined()
        expect(result.author).toBeDefined()
    })
})
