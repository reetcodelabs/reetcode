import { defineConfig } from 'vitest/config'
export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['tests/setupTests.ts'],
        reporters: ['json'],
        outputFile: 'test.output.json'
    },
})
