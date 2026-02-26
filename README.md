# code-block
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/code-block/nodejs.yml?style=flat-square)](https://github.com/substrate-system/code-block/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/code-block?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@substrate-system/code-block?cache-control=no-cache)](https://packagephobia.com/result?p=@substrate-system/code-block)
[![GZip size](https://flat.badgen.net/bundlephobia/minzip/@substrate-system/code-block)](https://bundlephobia.com/package/@substrate-system/code-block)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)

A web component that renders a `<pre><code>` block with an internal copy
icon button.

[See a live demo](https://substrate-system.github.io/code-block/)

<details><summary><h2>Contents</h2></summary>

<!-- toc -->

- [Install](#install)
- [API](#api)
  * [`@substrate-system/code-block`](#substrate-systemcode-block)
  * [`@substrate-system/code-block/client`](#substrate-systemcode-blockclient)
  * [`@substrate-system/code-block/html`](#substrate-systemcode-blockhtml)
  * [CommonJS](#commonjs)
- [CSS](#css)
  * [Import CSS](#import-css)
  * [CSS Variables](#css-variables)
- [Host Attributes](#host-attributes)
- [SSR + Hydration Example](#ssr--hydration-example)
  * [Server](#server)
  * [Client](#client)
- [Pre-built Files](#pre-built-files)
  * [Copy](#copy)
  * [HTML](#html)

<!-- tocstop -->

</details>

## Install

```sh
npm i -S @substrate-system/code-block
```

## Example

```js
import '@substrate-system/code-block'
import '@substrate-system/code-block/css'

```

```html
<code-block>
  const answer = 42
</code-block>
```

## API

This package exposes ESM and CommonJS via
[package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### `@substrate-system/code-block`

Full component (render + hydrate). It registers `<code-block>` when imported.

```js
import '@substrate-system/code-block'
import '@substrate-system/code-block/css'
```

```html
<code-block>
  const answer = 42
</code-block>
```

### `@substrate-system/code-block/client`

Client-only behavior (hydration only). Use this to hydrate HTML that was
rendered on the server.

```js
import { define } from '@substrate-system/code-block/client'
import '@substrate-system/code-block/css'

define()
```

### `@substrate-system/code-block/html`

Server-side HTML renderer.

```js
import { CodeBlock } from '@substrate-system/code-block/html'

const html = CodeBlock({
  code: 'console.log("hello")',
  copyHint: true,
  copyButtonLabel: 'Copy code to clipboard'
})
```

`CodeBlock.outerHTML(options, attrs)` is also provided to generate the host
element wrapper.

### CommonJS

```js
require('@substrate-system/code-block')
```

## CSS

### Import CSS

```js
import '@substrate-system/code-block/css'
```

Or minified:

```js
import '@substrate-system/code-block/min/css'
```


## Attributes

Supported on `<code-block>`:

1. `hint` &mdash; Enables copy feedback hint when present. Use `hint="false"`
   to disable.
2. `copy-button-label` &mdash; Accessible label/title for the icon button.
   Default: `Copy code to clipboard`.



## SSR + Hydration Example

### Server

```js
import { CodeBlock } from '@substrate-system/code-block/html'

const html = CodeBlock.outerHTML({
  code: 'npm i -S @substrate-system/code-block'
})
```

### Client

```js
import { define } from '@substrate-system/code-block/client'
import '@substrate-system/code-block/css'

define()
```

## Pre-built Files

This package exposes minified JS/CSS in `dist/`.

### Copy

```sh
cp ./node_modules/@substrate-system/code-block/dist/index.min.js ./public/code-block.min.js
cp ./node_modules/@substrate-system/code-block/dist/index.min.css ./public/code-block.css
```

### HTML

```html
<head>
    <link rel="stylesheet" href="./code-block.css">
</head>
<body>
    <code-block>console.log('hello')</code-block>
    <script type="module" src="./code-block.min.js"></script>
</body>
```
