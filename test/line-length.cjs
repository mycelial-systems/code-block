const fs = require('node:fs')
const path = require('node:path')

const MAX_LENGTH = 79
const ROOTS = ['src', 'test', 'example']
const EXTENSIONS = new Set(['.cjs', '.css', '.html', '.js', '.ts'])

function normalize (file) {
    return file.split(path.sep).join('/')
}

function isExcluded (file) {
    return /^example\/prism\./.test(normalize(file))
}

function collectFiles (root) {
    const entries = fs.readdirSync(root, { withFileTypes: true })
    return entries.flatMap(entry => {
        const file = path.join(root, entry.name)
        if (entry.isDirectory()) return collectFiles(file)
        return EXTENSIONS.has(path.extname(file)) ? [file] : []
    })
}

function findViolations (files, options = {}) {
    const readFile = options.readFile ?? (
        file => fs.readFileSync(file, 'utf8')
    )
    return files.flatMap(file => {
        if (isExcluded(file)) return []

        return readFile(file).split(/\r?\n/).flatMap((line, index) => {
            if (line.length <= MAX_LENGTH) return []
            return [{
                file: normalize(file),
                line: index + 1,
                length: line.length
            }]
        })
    })
}

function main () {
    const files = ROOTS.flatMap(collectFiles)
    const violations = findViolations(files)

    if (violations.length === 0) {
        console.log(`Line length check passed (${MAX_LENGTH} columns max)`)
        return
    }

    for (const violation of violations) {
        console.error(
            `${violation.file}:${violation.line} is ${violation.length}` +
            ` columns long`
        )
    }
    process.exitCode = 1
}

if (require.main === module) main()

module.exports = { findViolations }
