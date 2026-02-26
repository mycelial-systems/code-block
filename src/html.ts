import { CopyButton } from '@substrate-system/copy-button/html'
import { toAttributes } from '@substrate-system/web-component/attributes'

export interface CodeBlockOptions {
    code?: string
    copyHint?: string|boolean
    copyButtonLabel?: string
    classes?: string[]
}

type AttrValue = string|number|boolean|string[]|null|undefined
type CodeBlockRenderer = ((options?:CodeBlockOptions) => string) & {
    outerHTML:(options?:CodeBlockOptions, attrs?:Record<string, AttrValue>) => string
}

function escapeHtml (str:string) {
    return str
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

function toCopyButtonMarkup (code:string, hint:string|boolean) {
    const attrs = toAttributes({
        'data-code-block-copy': true,
        payload: escapeHtml(code),
        hint: hint !== false
    })

    return `<copy-button ${attrs}>${CopyButton({
        classes: ['code-block__copy-icon'],
        hint
    })}</copy-button>`
}

export const CodeBlock:CodeBlockRenderer = (options:CodeBlockOptions = {}) => {
    const code = options.code ?? ''
    const hint = options.copyHint ?? true
    const wrapperClasses = ['code-block__inner']
        .concat(options.classes ?? [])
        .filter(Boolean)
        .join(' ')
    const label = options.copyButtonLabel ?? 'Copy code to clipboard'
    const safeCode = escapeHtml(code)

    return `<div class="${wrapperClasses}" data-code-block-root>
        <pre class="code-block__pre"><code data-code-block-code>${safeCode}</code></pre>
        <div class="code-block__controls">
            ${toCopyButtonMarkup(code, hint)}
        </div>
        <span class="visually-hidden" data-code-block-live aria-live="polite">
            ${escapeHtml(label)}
        </span>
    </div>`
}

CodeBlock.outerHTML = (
    options:CodeBlockOptions = {},
    attrs:Record<string, AttrValue> = {}
) => {
    const hostAttributes = toAttributes(attrs)
    const rendered = CodeBlock(options)

    return `<code-block${hostAttributes.length ? ` ${hostAttributes}` : ''}>
        ${rendered}
    </code-block>`
}
