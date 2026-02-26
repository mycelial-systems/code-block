import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { CodeBlock as CodeBlockHtml } from '../src/html.js'
import { CodeBlock as CodeBlockClient } from '../src/client.js'
import '../src/index.js'

function nextTick () {
    return new Promise<void>(resolve => {
        setTimeout(resolve, 0)
    })
}

test('html helper renders pre markup and copy button', t => {
    const html = CodeBlockHtml({ code: 'const answer = 42' })

    t.ok(html.includes('<pre'), 'includes pre markup')
    t.ok(html.includes('<copy-button'), 'includes copy-button markup')
    t.ok(html.includes('const answer = 42'), 'includes escaped code')
})

test('full component renders from plain text content', async t => {
    document.body.innerHTML = ''
    const el = document.createElement('code-block')
    el.textContent = 'const answer = 42'
    document.body.append(el)

    await waitFor('code-block')
    await nextTick()

    t.ok(el.querySelector('[data-code-block-root]'), 'renders the wrapper')
    t.ok(el.querySelector('pre'), 'renders a <pre> element')
    t.ok(el.querySelector('code'), 'renders a <code> element')
    t.ok(el.querySelector('copy-button'), 'renders a copy button')
})

test('client hydration updates payload from rendered code', async t => {
    document.body.innerHTML = ''

    if (!customElements.get('client-only-code-block')) {
        class ClientOnlyCodeBlock extends CodeBlockClient {}
        customElements.define('client-only-code-block', ClientOnlyCodeBlock)
    }

    const el = document.createElement('client-only-code-block')
    el.innerHTML = CodeBlockHtml({ code: 'console.log("hello")' })
    document.body.append(el)

    await waitFor('client-only-code-block')
    await nextTick()

    const copyButton = el.querySelector('copy-button')
    t.equal(copyButton?.getAttribute('payload'),
        'console.log("hello")',
        'sets copy payload from code text')
})

test('client hydration updates payload when code changes', async t => {
    document.body.innerHTML = ''
    if (!customElements.get('client-only-code-block-2')) {
        class ClientOnlyCodeBlock extends CodeBlockClient {}
        customElements.define('client-only-code-block-2', ClientOnlyCodeBlock)
    }

    const el = document.createElement('client-only-code-block-2')
    el.innerHTML = CodeBlockHtml({ code: 'alpha' })
    document.body.append(el)

    await waitFor('client-only-code-block-2')
    await nextTick()

    const code = el.querySelector('[data-code-block-code]')
    if (!code) {
        t.fail('code element should exist')
        return
    }

    code.textContent = 'beta'
    await nextTick()
    await nextTick()

    const copyButton = el.querySelector('copy-button')
    t.equal(copyButton?.getAttribute('payload'),
        'beta',
        'keeps payload in sync with text content')
})

test('client hydration applies accessible icon-button labels', async t => {
    document.body.innerHTML = ''
    if (!customElements.get('client-only-code-block-3')) {
        class ClientOnlyCodeBlock extends CodeBlockClient {}
        customElements.define('client-only-code-block-3', ClientOnlyCodeBlock)
    }

    const el = document.createElement('client-only-code-block-3')
    el.innerHTML = CodeBlockHtml({ code: 'echo "a11y"' })
    document.body.append(el)

    await waitFor('client-only-code-block-3')
    await nextTick()
    await nextTick()

    const button = el.querySelector('copy-button button')
    t.equal(button?.getAttribute('aria-label'),
        'Copy code to clipboard',
        'sets an accessible aria-label')
    t.equal(button?.getAttribute('title'),
        'Copy code to clipboard',
        'sets a visible title tooltip')
})

test('disables icon button when there is no code payload', async t => {
    document.body.innerHTML = ''
    if (!customElements.get('client-only-code-block-4')) {
        class ClientOnlyCodeBlock extends CodeBlockClient {}
        customElements.define('client-only-code-block-4', ClientOnlyCodeBlock)
    }

    const el = document.createElement('client-only-code-block-4')
    el.innerHTML = CodeBlockHtml({ code: '' })
    document.body.append(el)

    await waitFor('client-only-code-block-4')
    await nextTick()

    const button = el.querySelector('copy-button button') as HTMLButtonElement|null
    t.ok(Boolean(button?.disabled), 'disables copy button without payload')
})

test('all done', () => {
    if (window) {
        // @ts-expect-error tests
        window.testsFinished = true
    }
})
