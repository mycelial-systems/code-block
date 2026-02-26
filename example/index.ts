import '@substrate-system/a11y'
import '../src/index.css'
import '../src/index.js'

type PrismGlobal = {
    highlightAllUnder:(element:Element) => void
    highlightElement:(element:Element) => void
}

const block = document.createElement('code-block')
block.classList.add('language-javascript')
block.textContent = `// vite.config.js
import { defineConfig } from 'vite'
import path from 'node:path'

export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
})`

document.body.append(block)

const prism = (window as Window & { Prism?:PrismGlobal }).Prism
if (prism) prism.highlightAllUnder(block)
