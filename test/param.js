
var request = require('supertest');
var json = require('..');
var Koa = require('koa');

describe('param', function(){
  it('should default to being disabled', function(done){
    var app = new Koa();

    app.use(json({ pretty: false }));

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/?pretty')
    .expect('{"foo":"bar"}', done);
  })

  it('should pretty-print when present', function(done){
    var app = new Koa();

    app.use(json({ pretty: false, param: 'pretty' }));

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/?pretty')
    .expect('{\n  "foo": "bar"\n}', done);
  })
})
