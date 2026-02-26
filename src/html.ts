import { CopyButton } from '@substrate-system/copy-button/html'
import { toAttributes } from '@substrate-system/web-component/attributes'

export interface CodeBlockOptions {
    code?:string
    copyHint?:string|boolean
    copyButtonLabel?:string
    classes?:string[]
    languageClass?:string
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

function getLanguageClassFromList (classNames:string[]) {
    return classNames.find(name => name.startsWith('language-')) ?? ''
}

function getLanguageClassFromAttrs (attrs:Record<string, AttrValue>) {
    const classValue = attrs.class
    if (typeof classValue === 'string') {
        return getLanguageClassFromList(classValue.split(/\s+/).filter(Boolean))
    }
    if (Array.isArray(classValue)) {
        return getLanguageClassFromList(classValue)
    }
    return ''
}

function toCopyButtonMarkup (code:string, hint:string|boolean) {
    const attrs = toAttributes({
        'data-code-block-copy': true,
        payload: escapeHtml(code),
        hint: hint !== false
    })

    return `<copy-button ${attrs}>${CopyButton({
        classes: ['code-block-copy-icon'],
        hint
    })}</copy-button>`
}

export const CodeBlock:CodeBlockRenderer = (options:CodeBlockOptions = {}) => {
    const code = options.code ?? ''
    const hint = options.copyHint ?? true
    const wrapperClasses = ['code-block-inner']
        .concat(options.classes ?? [])
        .filter(Boolean)
        .join(' ')
    const languageClass = (
        options.languageClass ??
        (options.classes ?? []).find(name => name.startsWith('language-')) ??
        ''
    ).trim()
    const preClasses = ['code-block-pre', languageClass].filter(Boolean).join(' ')
    const codeClasses = [languageClass].filter(Boolean).join(' ')
    const label = options.copyButtonLabel ?? 'Copy code to clipboard'
    const safeCode = escapeHtml(code)
    const codeClassAttr = codeClasses ? ` class="${escapeHtml(codeClasses)}"` : ''

    return `<div class="${wrapperClasses}" data-code-block-root>
        <pre class="${escapeHtml(preClasses)}"><code data-code-block-code${codeClassAttr}>${safeCode}</code></pre>
        <div class="code-block-controls">
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
    const rendered = CodeBlock({
        ...options,
        languageClass: options.languageClass ?? getLanguageClassFromAttrs(attrs)
    })

    return `<code-block${hostAttributes.length ? ` ${hostAttributes}` : ''}>
        ${rendered}
    </code-block>`
}
