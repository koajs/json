
const request = require('supertest');
const json = require('..');
const Koa = require('koa');

describe('pretty', () => {
  it('should default to true', (done) => {
    const app = new Koa();

    app.use(json());

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{\n  "foo": "bar"\n}', done);
  })

  it('should retain content-type', (done) => {
    const app = new Koa();

    app.use(json());

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('Content-Type', /application\/json/, done);
  })

  it('should pass through when false', (done) => {
    const app = new Koa();

    app.use(json({ pretty: false }));

    app.use((ctx) => {
      ctx.body = { foo: 'bar' };
    });

    request(app.listen())
    .get('/')
    .expect('{"foo":"bar"}', done);
  })

  it('should allow custom spaces', (done) => {
    const app = new Koa();

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
