const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const dist = path.join(root, 'dist')
const minifiedEsm = fs.readdirSync(dist)
    .filter(name => name.endsWith('.min.js'))

global.document = {
    querySelector () {},
    querySelectorAll () {}
}
global.window = {}
global.HTMLElement = class HTMLElement {}

if (minifiedEsm.length === 0) {
    throw new Error('No minified ESM entry points found in dist')
}

for (const file of minifiedEsm) {
    const cjsFile = file.replace(/\.min\.js$/, '.min.cjs')
    const target = path.join(dist, cjsFile)

    if (!fs.existsSync(target)) {
        throw new Error(`Missing CommonJS export: ${cjsFile}`)
    }

    require(target)
}

console.log(`Loaded ${minifiedEsm.length} minified CommonJS exports`)
