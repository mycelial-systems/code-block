import '../src/index.css'
import '../src/index.js'

const block = document.createElement('code-block')
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
