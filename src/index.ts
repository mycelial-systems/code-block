import { define as defineElement } from '@substrate-system/web-component/util'
import { CodeBlock as CodeBlockClient } from './client.js'
import { CodeBlock as CodeBlockHtml } from './html.js'

declare global {
    interface HTMLElementTagNameMap {
        'code-block': CodeBlock
    }
}

/**
 * Browser APIs + rendering logic
 */
export class CodeBlock extends CodeBlockClient {
    connectedCallback () {
        if (!this.querySelector('[data-code-block-root]')) {
            this.render()
        }

        super.connectedCallback()
    }

    getSourceCode () {
        const code = this.querySelector('[data-code-block-code]')
        if (code) return code.textContent ?? ''
        return this.textContent ?? ''
    }

    getCopyHint () {
        if (!this.hasAttribute('hint')) return true
        const hint = this.getAttribute('hint')
        if (hint === null || hint === '' || hint === 'true') return true
        if (hint === 'false') return false
        return hint
    }

    getLanguageClass () {
        return Array.from(this.classList)
            .find(name => name.startsWith('language-')) ?? ''
    }

    render () {
        this.innerHTML = CodeBlockHtml({
            code: this.getSourceCode(),
            copyHint: this.getCopyHint(),
            copyButtonLabel: this.getCopyButtonLabel(),
            languageClass: this.getLanguageClass()
        })
    }
}

export default CodeBlock

export function define () {
    return defineElement(CodeBlock.TAG, CodeBlock)
}

define()
