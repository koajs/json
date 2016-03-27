
var request = require('supertest');
var json = require('..');
var Koa = require('koa');

describe('pretty', function(){
  it('should default to true', function(done){
    var app = new Koa();

    app.use(json());

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{\n  "foo": "bar"\n}', done);
  })

  it('should retain content-type', function(done){
    var app = new Koa();

    app.use(json());

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/, done);
  })

  it('should pass through when false', function(done){
    var app = new Koa();

    app.use(json({ pretty: false }));

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{"foo":"bar"}', done);
  })

  it('should allow custom spaces', function(done){
    var app = new Koa();

    app.use(json({
      pretty: true,
      spaces: 4
    }));

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{\n    "foo": "bar"\n}', done);
  })
})
