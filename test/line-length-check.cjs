const assert = require('node:assert/strict')
const test = require('node:test')
const { findViolations } = require('./line-length.cjs')

test('reports project lines over 79 columns', () => {
    const violations = findViolations([
        'test/fixtures/short.ts',
        'test/fixtures/long.ts'
    ], {
        readFile (file) {
            if (file.endsWith('short.ts')) return 'const short = true\n'
            return `${'x'.repeat(80)}\n`
        }
    })

    assert.deepEqual(violations, [{
        file: 'test/fixtures/long.ts',
        line: 1,
        length: 80
    }])
})

test('ignores vendored Prism files', () => {
    const violations = findViolations(['example/prism.js'], {
        readFile: () => `${'x'.repeat(80)}\n`
    })

    assert.deepEqual(violations, [])
})
