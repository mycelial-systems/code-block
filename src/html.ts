import { CopyButton } from '@substrate-system/copy-button/html'
import { DEFAULT_COPY_BUTTON_LABEL } from './constants.js'

export interface CodeBlockOptions {
    code?:string
    copyHint?:string|boolean
    copyButtonLabel?:string
    classes?:string[]
    languageClass?:string
}

type AttrValue = string|number|boolean|string[]|null|undefined
type CodeBlockRenderer = ((options?:CodeBlockOptions) => string) & {
    outerHTML: (
        options?:CodeBlockOptions,
        attrs?:Record<string, AttrValue>
    ) => string
}

function escapeHtml (str:string) {
    return str
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

function toSafeAttributes (attrs:Record<string, AttrValue>) {
    return Object.keys(attrs).reduce((result, key) => {
        const value = attrs[key]
        if (!value) return result
        if (typeof value === 'boolean') {
            return value ? `${result} ${key}`.trim() : result
        }
        const text = Array.isArray(value) ? value.join(' ') : String(value)
        return `${result} ${key}="${escapeHtml(text)}"`.trim()
    }, '')
}

function getLanguageClassFromList (classNames:string[]) {
    return classNames.find(name => name.startsWith('language-')) ?? ''
}

function getLanguageClassFromAttrs (attrs:Record<string, AttrValue>) {
    const classValue = attrs.class
    if (typeof classValue === 'string') {
        return getLanguageClassFromList(
            classValue.split(/\s+/).filter(Boolean)
        )
    }
    if (Array.isArray(classValue)) {
        return getLanguageClassFromList(classValue)
    }
    return ''
}

function toCopyButtonMarkup (
    code:string,
    hint:string|boolean,
    label:string
) {
    const attrs = toSafeAttributes({
        'data-code-block-copy': true,
        payload: code,
        hint: hint !== false
    })

    const button = CopyButton({
        classes: ['code-block-copy-icon'],
        hint: typeof hint === 'string' ? escapeHtml(hint) : hint
    }).replace(
        'aria-label="Copy"',
        `aria-label="${escapeHtml(label)}"`
    )

    return `<copy-button ${attrs}>${button}</copy-button>`
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
    const preClasses = [
        'code-block-pre',
        languageClass
    ].filter(Boolean).join(' ')
    const codeClasses = [languageClass].filter(Boolean).join(' ')
    const label = options.copyButtonLabel?.trim() ||
        DEFAULT_COPY_BUTTON_LABEL
    const safeCode = escapeHtml(code)
    const codeClassAttr = codeClasses
        ? ` class="${escapeHtml(codeClasses)}"`
        : ''
    const preMarkup = (
        `<pre class="${escapeHtml(preClasses)}" tabindex="0">` +
        `<code data-code-block-code${codeClassAttr}>${safeCode}</code></pre>`
    )

    return `<div class="${escapeHtml(wrapperClasses)}" data-code-block-root>
        ${preMarkup}
        <div class="code-block-controls">
            ${toCopyButtonMarkup(code, hint, label)}
        </div>
        <span class="visually-hidden" data-code-block-live ` +
        `aria-live="polite"></span>
    </div>`
}

CodeBlock.outerHTML = (
    options:CodeBlockOptions = {},
    attrs:Record<string, AttrValue> = {}
) => {
    const hostAttributes = toSafeAttributes(attrs)
    const rendered = CodeBlock({
        ...options,
        languageClass: options.languageClass ??
            getLanguageClassFromAttrs(attrs)
    })

    return `<code-block${hostAttributes.length ? ` ${hostAttributes}` : ''}>
        ${rendered}
    </code-block>`
}
