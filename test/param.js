
var request = require('supertest');
var json = require('..');
var koa = require('koa');

describe('param', function(){
  it('should default to being disabled', function(done){
    var app = koa();

    app.use(json({ pretty: false }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/?pretty')
    .expect('{"foo":"bar"}', done);
  })

  it('should pretty-print when present', function(done){
    var app = koa();

    app.use(json({ pretty: false, param: 'pretty' }));

    app.use(function *(next){
      this.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/?pretty')
    .expect('{\n  "foo": "bar"\n}', done);
  })
})