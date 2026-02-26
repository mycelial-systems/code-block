# code-block
[![tests](https://img.shields.io/github/actions/workflow/status/substrate-system/code-block/nodejs.yml?style=flat-square)](https://github.com/substrate-system/code-block/actions/workflows/nodejs.yml)
[![types](https://img.shields.io/npm/types/@substrate-system/code-block?style=flat-square)](README.md)
[![module](https://img.shields.io/badge/module-ESM%2FCJS-blue?style=flat-square)](README.md)
[![install size](https://flat.badgen.net/packagephobia/install/@bicycle-codes/keys?cache-control=no-cache)](https://packagephobia.com/result?p=@bicycle-codes/keys)
[![GZip size](https://img.badgesize.io/https%3A%2F%2Fesm.sh%2F%40substrate-system%2Fcode-block%2Fes2022%2Ffile.mjs?style=flat-square&compression=gzip)](https://esm.sh/@substrate-system/code-block/es2022/code-block.mjs)
[![semantic versioning](https://img.shields.io/badge/semver-2.0.0-blue?logo=semver&style=flat-square)](https://semver.org/)
[![Common Changelog](https://nichoth.github.io/badge/common-changelog.svg)](./CHANGELOG.md)
[![license](https://img.shields.io/badge/license-Big_Time-blue?style=flat-square)](LICENSE)


`<package description goes here>`

[See a live demo](https://substrate-system.github.io/code-block/)

<details><summary><h2>Contents</h2></summary>
<!-- toc -->
</details>

## install

Installation instructions

```sh
npm i -S @substrate-system/code-block
```

## API

This exposes ESM and common JS via [package.json `exports` field](https://nodejs.org/api/packages.html#exports).

### ESM
```js
import '@substrate-system/code-block'
```

### Common JS
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

### Customize CSS via some variables

```css
code-block {
    --example: pink;
}
```

## use
This calls the global function `customElements.define`. Just import, then use
the tag in your HTML.

### JS
```js
import '@substrate-system/code-block'
```

### HTML
```html
<div>
    <code-block></code-block>
</div>
```

### pre-built
This package exposes minified JS and CSS files too. Copy them to a location that is
accessible to your web server, then link to them in HTML.

#### copy
```sh
cp ./node_modules/@substrate-system/code-block/dist/index.min.js ./public/code-block.min.js
cp ./node_modules/@substrate-system/code-block/dist/style.min.css ./public/code-block.css
```

#### HTML
```html
<head>
    <link rel="stylesheet" href="./code-block.css">
</head>
<body>
    <!-- ... -->
    <script type="module" src="./code-block.min.js"></script>
</body>
```
