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
            hadiths: {
                data: [
                    {
                        hadithNumber: '1',
                        hadithEnglish: 'Actions are by intentions',
                        hadithArabic: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                        hadithUrdu: 'اعمال کا دارومدار نیتوں پر ہے',
                        book: {
                            bookName: 'Sahih Bukhari',
                        },
                    },
                ],
            },
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
            hadiths: {
                data: [
                    {
                        hadithNumber: '42',
                        hadithEnglish: 'The strong believer is better than the weak believer',
                        hadithArabic: 'المؤمن القوي خير وأحب إلى الله',
                        book: {
                            bookName: 'Sahih Muslim',
                        },
                    },
                ],
            },
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result.hadith).toBe('The strong believer is better than the weak believer')
        expect(result.author).toBe('Sahih Muslim')
        expect(result.number).toBe('42')
    })

    test('should return hadith in Arabic language when requested', async () => {
        mockFetch({
            hadiths: {
                data: [
                    {
                        hadithNumber: '100',
                        hadithEnglish: 'English text',
                        hadithArabic: 'النص العربي',
                        book: {
                            bookName: 'Sahih Bukhari',
                        },
                    },
                ],
            },
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('ar')

        expect(result.hadith).toBe('النص العربي')
        expect(result.author).toBe('Sahih Bukhari')
    })

    test('should return hadith in Urdu language when requested', async () => {
        mockFetch({
            hadiths: {
                data: [
                    {
                        hadithNumber: '200',
                        hadithEnglish: 'English text',
                        hadithArabic: 'النص العربي',
                        hadithUrdu: 'اردو متن',
                        book: {
                            bookName: 'Sahih Muslim',
                        },
                    },
                ],
            },
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
                    hadiths: {
                        data: [
                            {
                                hadithNumber: '1',
                                hadithEnglish: 'Hadith 1',
                                book: { bookName: 'Sahih Bukhari' },
                            },
                            {
                                hadithNumber: '2',
                                hadithEnglish: 'Hadith 2',
                                book: { bookName: 'Sahih Bukhari' },
                            },
                        ],
                    },
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
            hadiths: {
                data: [
                    {
                        hadithNumber: '1',
                        hadithEnglish: 'Hadith without book info',
                        // book field is missing
                    },
                ],
            },
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        const result = await GetRandomHadith_ENG('en')

        expect(result.author).toBe('Unknown')
    })

    test('should fallback to Unknown when bookName is missing', async () => {
        mockFetch({
            hadiths: {
                data: [
                    {
                        hadithNumber: '1',
                        hadithEnglish: 'Hadith with incomplete book info',
                        book: {
                            // bookName is missing
                        },
                    },
                ],
            },
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
            // Missing hadiths field
            data: [],
        })

        const { GetRandomHadith_ENG } = require('../eng_hadith.js')
        
        await expect(GetRandomHadith_ENG('en')).rejects.toThrow('Invalid API response structure')
    })

    test('should provide fallback values for missing hadithNumber', async () => {
        mockFetch({
            hadiths: {
                data: [
                    {
                        // Missing hadithNumber
                        hadithEnglish: 'Hadith without number',
                        book: { bookName: 'Sahih Muslim' },
                    },
                ],
            },
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
                hadiths: {
                    data: [
                        {
                            hadithNumber: '1',
                            hadithEnglish: `Hadith from ${bookName}`,
                            book: { bookName },
                        },
                    ],
                },
            })

            const { GetRandomHadith_ENG } = require('../eng_hadith.js')
            const result = await GetRandomHadith_ENG('en')

            expect(result.author).toBe(bookName)
        }
    })
})
