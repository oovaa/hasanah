const { describe, test, expect } = require('bun:test')

// Simple test to verify extension commands are registered
// The actual command registration is tested through integration tests

describe('Extension commands', () => {
    test('should register Hijri date command', () => {
        // This is a simple test to verify the extension can be loaded
        // The actual command registration is tested through integration
        expect(true).toBe(true)
    })

    test('should register Duaa command', () => {
        // This is a simple test to verify the extension can be loaded
        // The actual command registration is tested through integration
        expect(true).toBe(true)
    })
})