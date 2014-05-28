
var PassThrough = require('stream').PassThrough;
var request = require('supertest');
var json = require('..');
var koa = require('koa');

describe('streams', function(){
  it('should not do anything binary streams', function (done) {
    var app = koa();

    app.use(json());

    app.use(function* (next) {
      var stream = this.body = new PassThrough();
      stream.end('lol');
    });

    request(app.listen())
    .get('/')
    .expect('lol', done);
  })

  it('should always stringify object streams', function (done) {
    var app = koa();

    app.use(json({
      pretty: false
    }));

    app.use(function* (next) {
      var stream = this.body = new PassThrough({ objectMode: true });
      stream.write({
        message: '1'
      });
      stream.write({
        message: '2'
      });
      stream.end();
    })

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/)
    .expect(200, function (err, res) {
      if (err) return done(err);

      res.text.should.include('{"message":"1"}');
      res.text.should.include('{"message":"2"}');
      res.body.should.eql([{
        message: '1'
      }, {
        message: '2'
      }]);
      done();
    })
  })

  it('should prettify object streams', function (done) {
    var app = koa();

    app.use(json());

    app.use(function* (next) {
      var stream = this.body = new PassThrough({ objectMode: true });
      stream.write({
        message: '1'
      });
      stream.write({
        message: '2'
      });
      stream.end();
    })

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/)
    .expect(200, function (err, res) {
      if (err) return done(err);

      res.text.should.include('{\n  "message": "1"\n}');
      res.text.should.include('{\n  "message": "2"\n}');
      res.body.should.eql([{
        message: '1'
      }, {
        message: '2'
      }]);
      done();
    })
  })
})
