
# koa-json

  JSON pretty-printed response middleware.
  Also converts node object streams to binary.

## Installation

```
$ npm install koa-json
```

## Options

 - `pretty` default to pretty response [true]
 - `param` optional query-string param for pretty responses [none]
 - `spaces` JSON spaces [2]

## Example

  Always pretty by default:

```js
const json = require('koa-json')
const Koa = require('koa')
const app = new Koa()

app.use(json())

app.use((ctx) => {
  ctx.body = { foo: 'bar' }
})
```

  yields:

```js
$ GET /

{
  "foo": "bar"
}
```

  Default to being disabled (useful in production), but
  togglable via the query-string parameter:

```js
const Koa = require('koa')
const app = new Koa()

app.use(json({ pretty: false, param: 'pretty' }))

app.use((ctx) => {
  ctx.body = { foo: 'bar' }
})
```

 yields:

```js
$ GET /

{"foo":"bar"}
```

```js
$ GET /?pretty

{
  "foo": "bar"
}
```

# License

  MIT
