import { define as defineElement } from '@substrate-system/web-component/util'
import { define as defineCopyButton } from '@substrate-system/copy-button/client'

defineCopyButton()

/**
 * This one does not know how to render itself. Should be used in
 * conjunction with server-side rendered HTML.
 */
export class CodeBlock extends HTMLElement {
    static TAG = 'code-block'
    static observedAttributes = ['copy-button-label']

    codeEl:HTMLElement|null
    copyButtonEl:HTMLElement|null
    codeObserver:MutationObserver|null
    buttonObserver:MutationObserver|null

    constructor () {
        super()
        this.codeEl = null
        this.copyButtonEl = null
        this.codeObserver = null
        this.buttonObserver = null
    }

    attributeChangedCallback (
        name:string,
        _oldValue:string|null,
        _newValue:string|null
    ):void {
        if (name === 'copy-button-label') this.applyIconButtonA11y()
    }

    disconnectedCallback ():void {
        this.codeObserver?.disconnect()
        this.buttonObserver?.disconnect()
        this.codeObserver = null
        this.buttonObserver = null
    }

    connectedCallback ():void {
        this.hydrate()
    }

    hydrate ():void {
        this.codeEl = this.querySelector('[data-code-block-code]')
        this.copyButtonEl = this.querySelector('copy-button[data-code-block-copy]')
        this.observeCode()
        this.observeCopyButton()
        this.syncPayload()
        this.applyIconButtonA11y()
    }

    observeCode ():void {
        this.codeObserver?.disconnect()
        if (!this.codeEl) return

        const observer = new MutationObserver(() => {
            this.syncPayload()
        })

        observer.observe(this.codeEl, {
            childList: true,
            characterData: true,
            subtree: true
        })

        this.codeObserver = observer
    }

    observeCopyButton ():void {
        this.buttonObserver?.disconnect()
        if (!this.copyButtonEl) return

        const observer = new MutationObserver(() => {
            this.applyIconButtonA11y()
        })

        observer.observe(this.copyButtonEl, {
            childList: true,
            subtree: true
        })

        this.buttonObserver = observer
    }

    syncPayload ():void {
        if (!this.copyButtonEl || !this.codeEl) return
        const payload = this.codeEl.textContent ?? ''
        this.copyButtonEl.setAttribute('payload', payload)

        const iconButton = this.copyButtonEl.querySelector('button') as
            (HTMLButtonElement|null)
        if (iconButton) iconButton.disabled = payload.length === 0
    }

    getCopyButtonLabel ():string {
        const label = this.getAttribute('copy-button-label')
        return label?.trim() || 'Copy code to clipboard'
    }

    applyIconButtonA11y ():void {
        if (!this.copyButtonEl) return
        const iconButton = this.copyButtonEl.querySelector('button')
        if (!iconButton) return

        const label = this.getCopyButtonLabel()
        iconButton.setAttribute('type', 'button')
        iconButton.setAttribute('aria-label', label)
        iconButton.setAttribute('title', label)
    }
}

export default CodeBlock

export function define () {
    return defineElement(CodeBlock.TAG, CodeBlock)
}
