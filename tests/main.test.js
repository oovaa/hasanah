/**
 * Tests for main.js getText function
 * 
 * These tests verify:
 * 1. getText properly formats hadith with author field (not book)
 * 2. Error handling and fallback to default Duaa
 * 3. Both Arabic and English hadith display correctly
 * 4. Integration between main.js and hadith modules
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

describe('Main getText function', () => {
    beforeEach(() => {
        // Clear module cache before each test
        delete require.cache[require.resolve('../main.js')]
        delete require.cache[require.resolve('../hadith.js')]
        delete require.cache[require.resolve('../eng_hadith.js')]
        delete require.cache[require.resolve('../quraan.js')]
    })

    test('should display hadith with author (not book) in Arabic', async () => {
        mockFetch({
            data: {
                id: 'bukhari',
                hadiths: [
                    {
                        number: 1,
                        arab: 'إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ',
                    },
                ],
            },
        })

        const { getText } = require('../main.js')
        const result = await getText(true, 'ar')

        expect(result).toContain('إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ')
        expect(result).toContain('💚 author (') // Check for proper format with author field
        expect(result).toContain('البخاري') // Should contain Arabic author name
        expect(result).not.toContain('book (Unknown)') // Should not show "Unknown" as author
    })

    test('should display hadith with author (not book) in English', async () => {
        mockFetch({
            hadiths: {
                data: [
                    {
                        hadithNumber: '42',
                        hadithEnglish: 'Actions are by intentions',
                        book: {
                            bookName: 'Sahih Muslim',
                        },
                    },
                ],
            },
        })

        const { getText } = require('../main.js')
        const result = await getText(true, 'en')

        expect(result).toContain('Actions are by intentions')
        expect(result).toContain('💚 author (') // Check for proper format with author field
        expect(result).toContain('Sahih Muslim') // Should contain author name
        expect(result).not.toContain('book (Unknown)') // Should not show "Unknown" as author
    })

    test('should format hadith text correctly with author and number', async () => {
        mockFetch({
            data: {
                id: 'muslim',
                hadiths: [
                    {
                        number: 123,
                        arab: 'حديث تجريبي',
                    },
                ],
            },
        })

        const { getText } = require('../main.js')
        const result = await getText(true, 'ar')

        // Verify the format: hadith 💚 author (authorName) (number)
        expect(result).toMatch(/💚 author \(.+\) \(\d+\)/)
    })

    test('should handle ayah display (turns = false)', async () => {
        // Mock ayah response
        mockFetch({
            data: {
                text: 'بسم الله الرحمن الرحيم',
                surah: {
                    name: 'الفاتحة',
                },
                numberInSurah: 1,
            },
        })

        const { getText } = require('../main.js')
        const result = await getText(false, 'ar')

        expect(result).toContain('بسم الله الرحمن الرحيم')
        expect(result).toContain('❤️') // Ayah uses heart emoji
        expect(result).not.toContain('author') // Ayah doesn't have author field
    })

    test('should fallback to default Duaa on hadith fetch error in Arabic', async () => {
        mockFetch(null, true)

        const { getText } = require('../main.js')
        const result = await getText(true, 'ar')

        expect(result).toContain('اللهم احفظ السودان واهله')
        expect(result).toContain('سبحان الله وبحمده')
        expect(result).toContain('💚')
    })

    test('should fallback to default Duaa on hadith fetch error in English', async () => {
        mockFetch(null, true)

        const { getText } = require('../main.js')
        const result = await getText(true, 'en')

        expect(result).toContain('O God, protect Sudan and its people')
        expect(result).toContain('Glory to God and praise to Him')
        expect(result).toContain('💚')
    })

    test('should fallback to default Duaa on ayah fetch error in Arabic', async () => {
        mockFetch(null, true)

        const { getText } = require('../main.js')
        const result = await getText(false, 'ar')

        expect(result).toContain('اللهم احفظ السودان واهله')
        expect(result).not.toContain('💚') // Ayah fallback doesn't have green heart
    })

    test('should fallback to default Duaa on ayah fetch error in English', async () => {
        mockFetch(null, true)

        const { getText } = require('../main.js')
        const result = await getText(false, 'en')

        expect(result).toContain('O God, protect Sudan and its people')
        expect(result).not.toContain('💚') // Ayah fallback doesn't have green heart
    })

    test('should never show Unknown author when API provides data correctly', async () => {
        const collections = [
            { id: 'bukhari', arabic: 'البخاري' },
            { id: 'muslim', arabic: 'مسلم' },
            { id: 'tirmidzi', arabic: 'الترمذي' },
        ]

        for (const collection of collections) {
            delete require.cache[require.resolve('../main.js')]
            delete require.cache[require.resolve('../hadith.js')]

            mockFetch({
                data: {
                    id: collection.id,
                    hadiths: [
                        {
                            number: 1,
                            arab: 'حديث من ' + collection.arabic,
                        },
                    ],
                },
            })

            const { getText } = require('../main.js')
            const result = await getText(true, 'ar')

            expect(result).not.toContain('Unknown')
            expect(result).toContain(collection.arabic)
        }
    })
})
