
var Readable = require('stream').Readable;
var request = require('supertest');
var assert = require('assert');
var json = require('..');
var Koa = require('koa');

describe('streams', function(){
  it('should not do anything binary streams', function (done) {
    var app = new Koa();

    app.use(json());

    app.use((ctx) => {
      var stream = ctx.body = new Readable();
      stream.push('lol');
      stream.push(null);
    });

    request(app.listen())
    .get('/')
    .expect('lol', done);
  })

  it('should always stringify object streams', function (done) {
    var app = new Koa();

    app.use(json({
      pretty: false
    }));

    app.use((ctx) => {
      var stream = ctx.body = new Readable({ objectMode: true });
      stream.push({
        message: '1'
      });
      stream.push({
        message: '2'
      });
      stream.push(null);
    })

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/)
    .expect(200, function (err, res) {
      if (err) return done(err);

      assert.ok(res.text.includes('{"message":"1"}'));
      assert.ok(res.text.includes('{"message":"2"}'));
      assert.deepEqual(res.body, [{
          message: '1'
        }, {
          message: '2'
        }]);
      done();
    })
  })

  it('should prettify object streams', function (done) {
    var app = new Koa();

    app.use(json());

    app.use((ctx) => {
      var stream = ctx.body = new Readable({ objectMode: true });
      stream.push({
        message: '1'
      });
      stream.push({
        message: '2'
      });
      stream.push(null);
    })

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/)
    .expect(200, function (err, res) {
      if (err) return done(err);

      assert.ok(res.text.includes('{\n  "message": "1"\n}'));
      assert.ok(res.text.includes('{\n  "message": "2"\n}'));
      assert.deepEqual(res.body, [{
          message: '1'
        }, {
          message: '2'
        }]);
      done();
    })
  })
})
