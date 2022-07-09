
const Readable = require('stream').Readable
const request = require('supertest')
const assert = require('assert')
const json = require('..')
const Koa = require('koa')

describe('streams', () => {
  it('should not do anything binary streams', (done) => {
    const app = new Koa()

    app.use(json())

    app.use((ctx) => {
      const stream = ctx.body = new Readable()
      stream.push('lol')
      stream.push(null)
    })

    request(app.listen())
      .get('/')
      .expect(200, (err, res) => {
        if (err) return done(err)

        assert.equal(res.body.toString(), 'lol')
        done()
      })
  })

  it('should always stringify object streams', (done) => {
    const app = new Koa()

    app.use(json({
      pretty: false
    }))

    app.use((ctx) => {
      const stream = ctx.body = new Readable({ objectMode: true })
      stream.push({
        message: '1'
      })
      stream.push({
        message: '2'
      })
      stream.push(null)
    })

    request(app.listen())
      .get('/')
      .expect('Content-Type', /application\/json/)
      .expect(200, (err, res) => {
        if (err) return done(err)

        assert.ok(res.text.includes('{"message":"1"}'))
        assert.ok(res.text.includes('{"message":"2"}'))
        assert.deepEqual(res.body, [{
          message: '1'
        }, {
          message: '2'
        }])
        done()
      })
  })

  it('should prettify object streams', (done) => {
    const app = new Koa()

    app.use(json())

    app.use((ctx) => {
      const stream = ctx.body = new Readable({ objectMode: true })
      stream.push({
        message: '1'
      })
      stream.push({
        message: '2'
      })
      stream.push(null)
    })

    request(app.listen())
      .get('/')
      .expect('Content-Type', /application\/json/)
      .expect(200, (err, res) => {
        if (err) return done(err)

        assert.ok(res.text.includes('{\n  "message": "1"\n}'))
        assert.ok(res.text.includes('{\n  "message": "2"\n}'))
        assert.deepEqual(res.body, [{
          message: '1'
        }, {
          message: '2'
        }])
        done()
      })
  })
})
