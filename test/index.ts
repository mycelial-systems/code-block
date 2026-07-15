import { test } from '@substrate-system/tapzero'
import { waitFor } from '@substrate-system/dom'
import { CodeBlock as CodeBlockHtml } from '../src/html.js'
import { CodeBlock as CodeBlockClient } from '../src/client.js'
import cssText from '../src/index.css'
import demoCssText from '../example/style.css'
import prismCssText from '../example/prism.css'
import demoHtml from '../example/index.html'

function nextTick () {
    return new Promise<void>(resolve => {
        setTimeout(resolve, 0)
    })
}

test('demo page is navigable and keeps code colors high contrast', t => {
    const page = new DOMParser().parseFromString(demoHtml, 'text/html')
    t.equal(page.querySelectorAll('h1').length, 1,
        'demo has one descriptive h1')
    t.ok(page.querySelector('main'), 'demo content has a main landmark')

    document.body.innerHTML = ''
    const style = document.createElement('style')
    style.textContent = prismCssText + demoCssText + cssText
    document.head.append(style)

    const main = document.createElement('main')
    main.style.inlineSize = '240px'
    const link = document.createElement('a')
    link.href = '#code'
    link.textContent = 'code'
    main.append(link)

    const block = document.createElement('code-block')
    block.id = 'code'
    const pre = document.createElement('pre')
    pre.className = 'language-javascript'
    const code = document.createElement('code')
    code.className = 'language-javascript'
    const keyword = document.createElement('span')
    keyword.className = 'token keyword'
    keyword.textContent = 'const'
    code.append(keyword, ' answer = 42')
    pre.append(code)
    block.append(pre)
    main.append(block)
    document.body.append(main)

    const linkColor = getComputedStyle(link).color
    const keywordColor = getComputedStyle(keyword).color
    const rootStyle = getComputedStyle(document.documentElement)

    t.equal(rootStyle.getPropertyValue('--demo-code-background').trim(),
        '#f5f2f0', 'demo exposes its code background as a variable')
    t.equal(linkColor, 'rgb(0, 95, 115)',
        'demo link color is readable on the page background')
    t.equal(keywordColor, 'rgb(0, 90, 122)',
        'demo keyword color is readable on the code background')
    t.ok(block.getBoundingClientRect().width <=
        main.getBoundingClientRect().width,
    'code block stays within a narrow main region')

    style.remove()
})

test('keeps code visible before custom element upgrade', async t => {
    document.body.innerHTML = ''
    const style = document.createElement('style')
    style.textContent = cssText
    document.head.append(style)

    const plain = document.createElement('code-block')
    plain.textContent = 'const answer = 42'
    const ssr = document.createElement('code-block')
    ssr.innerHTML = CodeBlockHtml({ code: 'const answer = 42' })
    document.body.append(plain, ssr)

    await nextTick()

    t.equal(getComputedStyle(plain).visibility, 'visible',
        'plain text remains visible before upgrade')
    t.equal(getComputedStyle(ssr).visibility, 'visible',
        'SSR markup remains visible before upgrade')
    t.equal(ssr.querySelector('pre')?.textContent, 'const answer = 42',
        'SSR code remains readable before upgrade')

    style.remove()
    await import('../src/index.js')
})

test('keeps long code contained and copy control usable when narrow',
    async t => {
        document.body.innerHTML = ''
        const style = document.createElement('style')
        style.textContent = cssText
        document.head.append(style)

        const container = document.createElement('div')
        container.style.width = '240px'
        const block = document.createElement('code-block')
        block.innerHTML = CodeBlockHtml({
            code: 'const veryLongIdentifier = "'.padEnd(240, 'x')
        })
        container.append(block)
        document.body.append(container)

        await nextTick()

        const pre = block.querySelector('pre') as HTMLElement|null
        const button = block.querySelector('copy-button button') as
            HTMLButtonElement|null
        if (!pre || !button) {
            t.fail('responsive code block should render pre and button')
            style.remove()
            return
        }

        const preStyle = getComputedStyle(pre)
        const buttonStyle = getComputedStyle(button)

        t.ok(block.getBoundingClientRect().width <=
            container.getBoundingClientRect().width,
        'code block stays within its containing area')
        t.equal(preStyle.overflowX, 'auto',
            'pre content is horizontally scrollable')
        t.ok(pre.scrollWidth > pre.clientWidth,
            'long code creates a scrollable overflow area')
        t.ok(parseFloat(preStyle.paddingInlineEnd) >= 44,
            'pre reserves space for the copy control')
        t.ok(parseFloat(preStyle.paddingBlockStart) >= 44,
            'pre reserves block space for the copy control')
        t.ok(parseFloat(buttonStyle.minInlineSize) >= 44,
            'copy control has a 44px minimum inline target')
        t.ok(parseFloat(buttonStyle.minBlockSize) >= 44,
            'copy control has a 44px minimum block target')

        t.equal(pre.tabIndex, 0,
            'overflowing pre content is keyboard focusable')
        pre.focus()
        t.equal(document.activeElement, pre,
            'keyboard focus can reach the scrollable pre')

        button.focus()
        t.equal(document.activeElement, button,
            'copy control can receive keyboard focus')

        style.remove()
    })

test('supported CSS hides copy label and styles copy control', async t => {
    document.body.innerHTML = ''
    const style = document.createElement('style')
    style.textContent = cssText
    document.head.append(style)

    const block = document.createElement('code-block')
    block.innerHTML = CodeBlockHtml({ code: 'const answer = 42' })
    document.body.append(block)

    await nextTick()

    const label = block.querySelector(
        'copy-button button .visually-hidden'
    ) as HTMLElement|null
    const copyButton = block.querySelector('copy-button') as HTMLElement|null
    const button = block.querySelector(
        'copy-button button'
    ) as HTMLButtonElement|null

    if (!label || !copyButton || !button) {
        t.fail('copy control should include its label and button')
        style.remove()
        return
    }

    const labelStyle = getComputedStyle(label)
    const copyButtonStyle = getComputedStyle(copyButton)
    const buttonStyle = getComputedStyle(button)

    t.equal(labelStyle.position, 'absolute',
        'copy label is visually hidden without leaving the a11y tree')
    t.equal(labelStyle.overflow, 'hidden',
        'copy label does not visually overflow')
    t.ok(parseFloat(labelStyle.width) <= 1,
        'copy label does not take visible width')
    t.ok(parseFloat(labelStyle.height) <= 1,
        'copy label does not take visible height')
    t.ok(parseFloat(copyButtonStyle.width) >= 44,
        'copy-button host has a touch-sized width')
    t.ok(parseFloat(copyButtonStyle.height) >= 44,
        'copy-button host has a touch-sized height')
    t.equal(buttonStyle.backgroundColor, 'rgba(0, 0, 0, 0)',
        'copy button uses a transparent background')

    style.remove()
})

test('html helper renders pre markup and copy button', t => {
    const html = CodeBlockHtml({ code: 'const answer = 42' })

    t.ok(html.includes('<pre'), 'includes pre markup')
    t.ok(html.includes('<copy-button'), 'includes copy-button markup')
    t.ok(html.includes('const answer = 42'), 'includes escaped code')
})

test('html helper uses the default copy-button label and empty live region',
    t => {
        const html = CodeBlockHtml({ code: 'const answer = 42' })

        t.ok(html.includes('aria-label="Copy code to clipboard"'),
            'uses the default copy-button label')
        t.ok(html.includes('data-code-block-live aria-live="polite"></span>'),
            'does not pre-populate the live region')
    })

test('html helper uses a custom copy-button label', t => {
    const html = CodeBlockHtml({
        code: 'const answer = 42',
        copyButtonLabel: 'Copy this example'
    })

    t.ok(html.includes('aria-label="Copy this example"'),
        'uses the custom copy-button label')
})

test(
    'html helper escapes user-provided markup in classes and copy hints',
    t => {
        const html = CodeBlockHtml({
            code: 'const answer = 42',
            classes: ['theme-" onmouseover="alert(1)', '<img src=x>'],
            copyHint: 'Copied <svg onload=alert(1)>'
        })

        t.ok(!html.includes('<img src=x>'),
            'does not render class markup')
        t.ok(!html.includes('<svg onload=alert(1)>'),
            'does not render hint markup')
        t.ok(html.includes('&quot;'), 'escapes quote characters')
        t.ok(html.includes('&lt;img src=x&gt;'),
            'escapes angle brackets in classes')
    }
)

test('outerHTML escapes host attribute values', t => {
    const html = CodeBlockHtml.outerHTML({ code: 'safe' }, {
        title: '" onfocus="alert(1) <tag>'
    })

    t.ok(!html.includes('onfocus="alert(1)'),
        'does not create an event-handler attribute')
    t.ok(html.includes('&quot; onfocus=&quot;alert(1) &lt;tag&gt;'),
        'escapes host attribute values')
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

test('client hydration preserves a custom copy-button label', async t => {
    document.body.innerHTML = ''
    if (!customElements.get('client-only-code-block-5')) {
        class ClientOnlyCodeBlock extends CodeBlockClient {}
        customElements.define('client-only-code-block-5', ClientOnlyCodeBlock)
    }

    const el = document.createElement('client-only-code-block-5')
    el.setAttribute('copy-button-label', 'Copy this example')
    el.innerHTML = CodeBlockHtml({
        code: 'echo "a11y"',
        copyButtonLabel: 'Copy this example'
    })
    document.body.append(el)

    await waitFor('client-only-code-block-5')
    await nextTick()
    await nextTick()

    const button = el.querySelector('copy-button button')
    t.equal(button?.getAttribute('aria-label'),
        'Copy this example',
        'preserves the custom accessible label')
    t.equal(el.querySelector('[data-code-block-live]')?.textContent?.trim(),
        '',
        'keeps the live region empty before a copy status')
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

    const button = el.querySelector(
        'copy-button button'
    ) as HTMLButtonElement|null
    t.ok(Boolean(button?.disabled), 'disables copy button without payload')
})

test('all done', () => {
    if (window) {
        // @ts-expect-error tests
        window.testsFinished = true
    }
})
