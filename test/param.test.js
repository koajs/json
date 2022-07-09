const request = require('supertest')
const Koa = require('koa')

const json = require('..')

describe('param', () => {
  it('should default to being disabled', (done) => {
    const app = new Koa()

    app.use(json({ pretty: false }))

    app.use((ctx) => {
      ctx.body = { foo: 'bar' }
    })

    request(app.listen())
      .get('/?pretty')
      .expect('{"foo":"bar"}', done)
  })

  it('should pretty-print when present', (done) => {
    const app = new Koa()

    app.use(json({ pretty: false, param: 'pretty' }))

    app.use((ctx) => {
      ctx.body = { foo: 'bar' }
    })

    request(app.listen())
      .get('/?pretty')
      .expect('{\n  "foo": "bar"\n}', done)
  })
})
