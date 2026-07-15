import { test } from '@substrate-system/tapzero'
import { assertWCAGCompliance } from '@substrate-system/tapout/axe'
import { CodeBlock as CodeBlockHtml } from '../src/html.js'
import cssText from '../src/index.css'
import demoCssText from '../example/style.css'
import prismCssText from '../example/prism.css'
import demoHtml from '../example/index.html'

test('demo page meets WCAG AA accessibility checks', async t => {
    const page = new DOMParser().parseFromString(demoHtml, 'text/html')
    document.documentElement.lang = page.documentElement.lang
    document.head.innerHTML = ''
    document.title = page.title
    document.body.innerHTML = page.body.innerHTML

    const style = document.createElement('style')
    style.textContent = prismCssText + demoCssText + cssText
    document.head.append(style)

    const main = document.querySelector('main')
    t.ok(main, 'demo content has a main landmark')
    main?.insertAdjacentHTML('beforeend', CodeBlockHtml.outerHTML({
        code: 'const answer = 42',
        languageClass: 'language-javascript'
    }))

    await assertWCAGCompliance(t, 'AA')
    style.remove()
})

test('all done', () => {
    // @ts-expect-error browser global
    window.testsFinished = true
})
